//个人信息
var app = getApp();

Page({

  data: {
    vCodeMsg: "获取验证码",
    vCodeCDMsg: "s后重新获取",
    vCodeBtnVisable: true,
    vCodeCountDown: 60,
    getVcodeBtnColor: "#1dad4b",
    phoneNumber: "",
    is_authorise: 1, //是否显示授权按钮(0:不显示/不允许授权 1:显示 2:允许授权)
    info: []
  },

  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'userinfo',
      success: function (info) {
        //拼装验证参数
        var timestamp = app.createTimeStamp()
        var str = "uid=" + info.data.uid + '&timestamp=' + timestamp;
        var signature = app.createSignatureStr(str);
        wx.request({
          url: app.globalData.baseUrl + 'little/operate/getUserInfo',
          data: {
            uid: info.data.uid,
            timestamp: timestamp,
            signature: signature,
          },
          success: function (res) {
            if (res.data.result == 'fail') {
              wx.showModal({
                title: '提示',
                content: res.data.reason,
                showCancel: false
              })
              return false;
            } else {
              var dis = 1;
              if (res.data.info.mobile != '') {
                dis = 0; //不显示授权按钮
              }
              that.setData({
                uid: info.data.uid,
                info: res.data.info,
                is_authorise: dis
              })
            }
          }
        })
      },
    })
  },

  submitChangePhoneNum: function (_e) {
    var that = this;
    var pMobile = _e.detail.value.mobile;
    var pCode = _e.detail.value.code;
    var is_authorise = _e.detail.value.is_authorise;

    var regMobile = /^1\d{10}$/;
    if (!regMobile.test(pMobile)) {
      wx.showToast({
        title: '手机号格式不正确！'
      })
      return false;
    }
    if (is_authorise == 0 && pCode.length == 0) {
      wx.showToast({
        title: '请填写正确的验证码！'
      });
      return false;
    }

    //拼装验证参数
    var timestamp = app.createTimeStamp()
    var str = 'mobile=' + pMobile + '&code=' + pCode + "&uid=" + that.data.uid + '&is_authorise=' + is_authorise + '&timestamp=' + timestamp;
    var signature = app.createSignatureStr(str);
    wx.request({
      url: app.globalData.baseUrl + 'api/member/updateuser',
      data: {
        mobile: pMobile,
        code: pCode,
        uid: that.data.uid,
        is_authorise: is_authorise,
        timestamp: timestamp,
        signature: signature,
      },
      success: function (_res) {
        if (_res.data.result == 'succ') {
          wx.switchTab({
            url: '/pages/my/my/my'
          })
        } else {
          wx.showToast({
            title: _res.data.reason,
          })
        }
      }
    })
  },

  mobileInputEvent: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },

  getVcode: function () {
    if (this.data.vCodeBtnVisable) {
      var that = this;
      var regMobile = /^1\d{10}$/;
      if (!regMobile.test(this.data.phoneNumber)) {
        wx.showToast({
          title: '手机号格式不正确！'
        })
        return false;
      }
      wx.request({
        url: app.globalData.baseUrl + 'little/index/changeMobilecode',
        data: {
          mobile: that.data.phoneNumber,
          uid: that.data.uid
        },
        success: function (res) {
          if (res.data.result == 'fail') {
            wx.showModal({
              title: '提示',
              content: res.data.reason,
              showCancel: false
            })
            return false;
          } else {
            wx.showModal({
              title: '验证码已发送',
              showCancel: false
            })
            that.setData({
              vCodeBtnVisable: false,
              vCodeMsg: that.data.vCodeCountDown + that.data.vCodeCDMsg
            });
            that.countdown();
          }
        }
      })
    }
  },

  //授权获取微信绑定的手机号
  getPhoneNumber: function (e) {
    var that = this;
    //同意授权
    if (e.detail.encryptedData) {
      wx.getStorage({
        key: 'userinfo',
        success: function (uinfo) {
          wx.request({
            url: app.globalData.baseUrl + 'api/operate/upUserMobile',
            data: {
              uid: uinfo.data.uid,
              unionid: uinfo.data.unionId,
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv
            },
            success: function (res) {
              var info = res.data.trim();
              info = JSON.parse(info);
              console.log('授权后用户信息:', info)
              if (info.result == 'succ') {
                that.setData({
                  info: info.info,
                  is_authorise: 2  //允许授权
                })
              } else {
                //不同意授权，则显示手机号输入框
                that.setData({
                  is_authorise: 0
                })

                wx.showModal({
                  title: '提示',
                  content: info.reason,
                  showCancel: false
                })

                return false;
              }
            }
          })
        }
      })
    } else {
      //不同意授权，则显示手机号输入框
      that.setData({
        is_authorise: 0
      })
    }
  },

  countdown: function () {
    var id = setInterval(function () {
      if (this.data.vCodeCountDown <= 0) {
        this.setData({
          vCodeCountDown: 60,
          vCodeBtnVisable: true,
          // getVcodeBtnColor: "#1dad4b",
          vCodeMsg: "获取验证码"
        });
        clearInterval(id);
      }
      else {
        this.setData({
          vCodeCountDown: this.data.vCodeCountDown - 1,
          vCodeMsg: this.data.vCodeCountDown + this.data.vCodeCDMsg
        });
      }
    }.bind(this), 1000)
  }
})