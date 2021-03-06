//登录页面
var app = getApp();

Page({

    data: {
        show:0,      //是否显示
        vCodeMsg: "获取验证码",
        vCodeCDMsg: "s后重新获取",
        vCodeBtnVisable: true,
        vCodeCountDown: 60,
        getVcodeBtnColor: "#1dad4b",
        phoneNumber:"",
    },

    onLoad: function (options) {
        var that = this;
        wx.getStorage({
            key: 'userinfo',
            success: function(res) {
                if(res.data.manager_id) {
                    wx.request({
                        url: app.globalData.baseUrl + 'little/institution/checkauth',
                        data: {
                            unionid: res.data.unionId
                        },
                        success: function (auth) {
                            if (auth.data.result == 'succ') {
                              /*
                                //逻辑错误，导致其他地市是否缓存无法获取
                                wx.setStorage({
                                    key: 'manager',
                                    data: res.data.info,
                                })
                              */  
                                wx.switchTab({
                                    url: '/pages/class/schedule/schedule',
                                })
                            } else {
                                that.setData({
                                    show: 1
                                })
                            }
                        },
                    })
                }else{
                    that.setData({
                        show: 1
                    })
                }
            },
            fail: function () {
                that.setData({
                    show: 1
                })
            }
        })
    },

    /**
    * 获取手机号
    */
    mobileInputEvent: function (e) {
        this.setData({
            phoneNumber: e.detail.value
        })
    },

    /**
    * 验证码
    */
    getVcode: function () {
        if (this.data.vCodeBtnVisable) {
            var that = this;
            var regMobile = /^1\d{10}$/;
            if (!regMobile.test(this.data.phoneNumber)) {
                wx.showModal({
                    title: '手机号格式有误！',
                    showCancel:false
                })
                return false;
            }

            wx.request({
                url: app.globalData.baseUrl + 'little/institution/sendmessage',
                data: {
                    mobile: that.data.phoneNumber,
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
                            vCodeBtnVisable: false,
                            vCodeMsg: that.data.vCodeCountDown + that.data.vCodeCDMsg
                        });
                        that.countdown();
                    }
                }
            })
        }
    },

    /**
     * 提交验证信息
     */
    formSubmit:function(e){
        var that = this;
        var mobile = e.detail.value.mobile;
        var code = e.detail.value.code;
        wx.request({
            url: app.globalData.baseUrl + 'little/institution/login',
            data: {
                mobile:mobile,
                code:code
            },
            success: function(res) {
                if (res.data.result == 'succ') {
                    wx.setStorage({
                        key: 'manager',
                        data: res.data.info,
                    })
              
                    //显示授权弹窗
                    that.setData({
                      display: 'block',
                    })
                } else {
                    wx.showModal({
                        title: res.data.reason,
                        showCancel:false,
                    })
                }
            }
        })
    },

    /**
     * 授权
     */
    getuser: function(e) {
        if(e.detail.encryptedData){
          app.getUserInfo(e.detail.encryptedData, e.detail.iv);
        }
    },

    countdown: function () {
        var id = setInterval(function () {
            if (this.data.vCodeCountDown <= 0) {
                this.setData({
                    vCodeCountDown: 60,
                    vCodeBtnVisable: true,
                    vCodeMsg: "获取验证码"
                });
                clearInterval(id);
            } else {
                this.setData({
                    vCodeCountDown: this.data.vCodeCountDown - 1,
                    vCodeMsg: this.data.vCodeCountDown + this.data.vCodeCDMsg
                });
            }
        }.bind(this), 1000)
    }
})