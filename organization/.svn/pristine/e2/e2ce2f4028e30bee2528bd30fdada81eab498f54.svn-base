//工作人员授权
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWorker()
  },

  /**
   * 授权工作人员
   */
  formSubmit: function(e) {

    var that = this;

    if(e.detail.value.name == ''){
        wx.showModal({
            title: '姓名不能为空',
            showCancel:false
        })
        return false;
    }

    if(e.detail.value.mobile == ''){
        wx.showModal({
            title: '手机号不能为空',
            showCancel:false
        })
        return false;
    }

    var regMobile = /^1\d{10}$/;
    if (!regMobile.test(e.detail.value.mobile)) {
        wx.showModal({
            title: '手机号格式有误',
            showCancel:false
        })
        return false;
    }

    wx.showModal({
      title: '确定要授权吗？',
      success: function(res) {
        if (res.cancel == true) {
          return false
        } else {
          wx.getStorage({
            key: 'userinfo',
            success: function (res) {
              wx.request({
                url: app.globalData.baseUrl + 'little/institution/giveAuth',
                data: {
                  ins_id: res.data.ins_id,
                  name: e.detail.value.name,
                  mobile: e.detail.value.mobile
                },
                success: function (_res) {
                  console.log('result',_res)
                  if (_res.data.result == 'succ') {
                    wx.showToast({
                      icon: 'success',
                      title: '授权成功',
                    })
                    that.getWorker();
                  } else {
                    wx.showToast({
                      title: _res.data.reason,
                    })
                  }
                }
              })
            },
          })
        }
      }
    })
  },

  /**
  * 获取授权的工作人员
  */
  getWorker: function() {
    var that = this
    wx.getStorage({
      key: 'userinfo',
      success: function(res) {
        wx.request({
          url: app.globalData.baseUrl + 'little/institution/getWorkers',
          data: {
            ins_id: res.data.ins_id
          },
          success: function(_res) {
            if (_res.data.result == 'succ') {
              that.setData({
                list: _res.data.info
              })
            }
          }
        })
      },
    })
  },

  /**
   * 取消授权
   */
  cancelAuth: function(e) {
    var that = this
    var id = e.currentTarget.dataset.id

    wx.showModal({
      title: '确定要取消该授权吗？',
      success: function(res) {
        if (res.cancel == true) {
          return false
        } else {

          wx.request({
            url: app.globalData.baseUrl + 'little/institution/cancelAuth',
            data: {
              manager_id: id
            },
            success: function (_res) {
              if (_res.data.result == 'succ') {
                wx.showToast({
                  title: '取消成功',
                })
                that.getWorker()
              } else {
                wx.showToast({
                  title: _res.data.reason,
                })
              }
            }
          })
        }
      }
    })
  }
})