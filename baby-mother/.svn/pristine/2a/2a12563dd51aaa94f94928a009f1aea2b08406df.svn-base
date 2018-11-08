//体验课签到
var app = getApp()

Page({

    data: {
        is_login:0,
        info:[]
    },

    onLoad: function () {
        var that = this;
        wx.getStorage({
            key: 'userinfo',
            success: function (res) {
                wx.request({
                    url: app.globalData.baseUrl + 'little/operate/signInLesson',
                    data: {
                        uid: res.data.uid
                    },
                    success: function (res) {
                        if(res.data.result == 'succ'){
                            that.setData({
                                is_login:1,
                                is_button:res.data.is_button,
                                is_lesson:res.data.is_lesson,
                                info:res.data.info
                            })
                        }else{
                            that.setData({
                                is_login:1,
                                is_button:res.data.is_button,
                                is_lesson:res.data.is_lesson
                            })
                        }
                    }
                })
            }
        })
    },

    //授权
    getuser: function(e) {
        if(e.detail.encryptedData){
            app.getUserInfoNew(e.detail.encryptedData,e.detail.iv,'/pages/my/sign_in/sign_in');
        }else{
            console.log('拒绝授权');
        }
    },

    //签到操作
    sign_in:function (e) {
        wx.getStorage({
            key: 'userinfo',
            success: function (res) {
                wx.request({
                    url: app.globalData.baseUrl + 'little/operate/signIn',
                    data: {
                        uid: res.data.uid
                    },
                    success: function (res) {
                        if(res.data.result == 'succ'){
                            wx.showModal({
                                title: '提示',
                                content:'签到成功！',
                                showCancel: false,
                                success: function(result) {
                                    if(result.confirm) {
                                        wx.reLaunch({
                                            url:'/pages/my/sign_in/sign_in'
                                        })
                                    }
                                }
                            })
                        }else{
                            wx.showModal({
                                title: '提示',
                                content: res.data.reason,
                                showCancel: false
                            })
                        }
                    }
                })
            }
        })
    }
})