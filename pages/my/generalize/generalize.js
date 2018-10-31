//申请成为推广员页
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        info:[],         //登录用户信息
        citylist:[],     //城市列表
        cIndex:0,        //城市下标
        rootRelativePath: '../../../',
        second: 60,
        selected1:true,
        selected:false,
        mobile:'',
        forwardCard:'',
        backCard:'',
        wxgzh:true,
        jigou:true,
        typeid:0,
        is_verify:0,
        is_show:0     //1:显示  0:不显示
    },

    onLoad: function (options) {
        var that = this
        wx.getStorage({
            key: 'userinfo',
            success: function (info) {
                wx.request({
                    url: app.globalData.baseUrl + 'little/operate/checkGeneralize',
                    data: {
                        uid: info.data.uid
                    },
                    success: function (res) {
                        if (res.data.is_generalize == 0) { //待审核
                            wx.navigateTo({
                                url: '/pages/my/generalize/success?cityname=' + res.data.is_cityname
                            })
                        } else if (res.data.is_generalize == 1 || res.data.is_generalize == 2) { //已审核、宝妈或推广员
                            wx.navigateTo({
                                url: '/pages/my/generalize/prolist'
                            })
                        }else{
                            that.setData({
                                info: res.data.info,
                                citylist: res.data.citylist,
                                is_show:1
                            })
                        }
                    }
                })
            },
            fail:function () {
                wx.navigateTo({
                    url: '/pages/my/generalize/introduce'
                })
            }
        })
    },

    /**
     * 选择图片
     */
    chooseImage: function (e) {
        var that = this;
        var type = e.currentTarget.dataset.type
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                wx.showLoading({
                    title: '正在上传...',
                })
                wx.uploadFile({
                  url: app.globalData.baseUrl + 'little/operate/uploadIdCard',
                  filePath: res.tempFilePaths[0],
                  name: 'IDcard',
                  success: function(e){
                    console.log(e)
                     var res = JSON.parse(e.data.trim());
                    wx.hideLoading();
                    if (type == 'forward') {
                      that.setData({
                        forwardCard: app.globalData.baseUrl + res.info
                      })
                    } 
                    if (type == 'back') {
                      that.setData({
                        backCard: app.globalData.baseUrl + res.info
                      })
                    } 
                  }
                })
            }
        })
    },

    //勾选身份
    clickType:function(e){
        var typeid = e.detail.value;
        if(typeid == 1){
            this.setData({
                typeid:typeid,
                wxgzh:true,
                jigou:true
            })
        }else if(typeid == 2){
            this.setData({
                typeid:typeid,
                wxgzh:false,
                jigou:true
            })
        }else{
            this.setData({
                typeid:typeid,
                wxgzh:true,
                jigou:false
            })
        }
    },

    //勾选确认提交选项
    clickVerify:function (e) {
        var value = e.detail.value;
        this.setData({
            is_verify:value
        })
    },

    //表单提交
    formSubmit: function(e) {

        var that = this;

        if (e.detail.value.username == '') {
            wx.showModal({
                title: '您还没有填写姓名',
                showCancel: false,
            })
            return false;
        }
        if (e.detail.value.mobile == '') {
            wx.showModal({
                title: '您还没有填写手机号',
                showCancel: false,
            })
            return false;
        }

        //手机号格式检测
        var regMobile = /^1\d{10}$/;
        if(!regMobile.test(e.detail.value.mobile)){
            wx.showModal({
                title: '手机号格式不正确',
                showCancel: false,
            })
            return false;
        }

        if (e.detail.value.weixin == '') {
            wx.showModal({
                title: '您还没有填写微信号',
                showCancel: false,
            })
            return false;
        }

        if (e.detail.value.gender == '') {
            wx.showModal({
                title: '您还没有勾选性别',
                showCancel: false,
            })
            return false;
        }

        if (e.detail.value.identity_card == '') {
            wx.showModal({
                title: '您还没有填写身份证号',
                showCancel: false,
            })
            return false;
        }

        //身份证格式检测
        var regCard = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        if(!regCard.test(e.detail.value.identity_card)){
            wx.showModal({
                title: '身份证格式不正确',
                showCancel: false,
            })
            return false;
        }

        if(that.data.typeid == 0){
            wx.showModal({
                title: '您还没有勾选身份',
                showCancel: false,
            })
            return false;
        }

        if(that.data.typeid == 2 && (e.detail.value.wx_Accounts == '' || e.detail.value.fans == '' || e.detail.value.frequency == '')){
            wx.showModal({
                title: '身份信息不完整',
                showCancel: false,
            })
            return false;
        }

        if((that.data.typeid == 3 || that.data.typeid == 4) && e.detail.value.address == ''){
            wx.showModal({
                title: '收货地址不能为空',
                showCancel: false,
            })
            return false;
        }

        if(that.data.is_verify == 0){
            wx.showModal({
                title: '请确认填写资料属实',
                showCancel: false,
            })
            return false;
        }

        if (that.data.forwardCard == '') {
          wx.showModal({
            title: '请上传身份证正面照片',
            showCancel: false,
          })
          return false;
        }

        if (that.data.backCard == '') {
          wx.showModal({
            title: '请上传身份证背面照片',
            showCancel: false,
          })
          return false;
        }

        //获取邀请人id
        var invite_uid = 0;
        wx.getStorage({
            key: 'puid',
            success: function (puid) {
                invite_uid = puid.data
            }
        })

        wx.getStorage({
            key: 'userinfo',
            success: function (res) {
                wx.request({
                    url: app.globalData.baseUrl + 'little/operate/createGeneralize',
                    data: {
                        uid:res.data.uid,
                        username: e.detail.value.username,
                        mobile: e.detail.value.mobile,
                        code: e.detail.value.code,
                        weixin:e.detail.value.weixin,
                        cityid:e.detail.value.cityid,
                        gender:e.detail.value.gender,
                        identity_card:e.detail.value.identity_card,
                        typeid:that.data.typeid,
                        wx_Accounts:e.detail.value.wx_Accounts,
                        fans:e.detail.value.fans,
                        frequency:e.detail.value.frequency,
                        address:e.detail.value.address,
                        forwardCard: that.data.forwardCard,
                        backCard: that.data.backCard,
                        invite_uid:invite_uid,
                    },
                    method: 'post',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    success: function (res2) {
                        if (res2.data.result == 'succ') {
                            wx.redirectTo({
                                url: '/pages/my/generalize/success?cityname='+res2.data.info + '&do=1'
                            })
                        }else{
                            wx.showModal({
                                title: res2.data.reason,
                                showCancel: false,
                            })
                            return false;
                        }
                    }
                })
            },
        })
    },

    //发送验证码
    getphone: function (e) {
        var that = this
        var mobile = that.data.mobile
        var regMobile = /^1\d{10}$/;
        if (!regMobile.test(mobile)) {
            wx.showModal({
                title: '手机号格式不正确',
                showCancel: false,
            })
            return false;
        }

        wx.request({
            url: app.globalData.baseUrl + 'little/operate/sendcode',
            data: {
                mobile: mobile
            },
            method: 'post',
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            success: function (res) {
                if (res.data.result == 'fail') {
                    wx.showToast({
                        title: res.data.reason
                    })
                    return false;
                } else {
                    wx.showToast({
                        title: '验证码已发送'
                    })
                    that.setData({
                        selected1: false,
                        selected: true
                    });
                    countdown(that);
                }
            }
        })
    },

    mobileInputEvent: function (e) {
        this.setData({
            mobile: e.detail.value
        })
    },

    bindCityChange:function (e) {
        this.setData({
            cIndex:e.detail.value
        })
    },
})

//60秒倒计时
function countdown(that) {
    var second = that.data.second;
    if (second == 0) {
        that.setData({
            selected1:true,
            selected:false,
            second: 60,
        });
        return;
    }
    var time = setTimeout(function () {
            that.setData({
                second: second - 1
            });
            countdown(that);
        }
        , 1000)
}