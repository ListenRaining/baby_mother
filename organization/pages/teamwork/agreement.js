//申请须知页
var app = getApp()

Page({

    data: {
        is_checked:'',
        is_next:true,
        apply_status:1,
        is_login:0
    },

    getUserInfo: function (encryptedData,iv,url) {
        wx.login({
            success: function (res) {
                wx.request({
                    url: app.globalData.baseUrl + 'api/institution/checkcode',
                    data: {
                        code: res.code,
                        encryptedData: encryptedData,
                        iv: iv
                    },
                    success: function (result) {
                        var info = result.data.trim()
                        info = JSON.parse(info)
                        if (info.unionId) {
                            wx.setStorage({
                                key: 'userinfo',
                                data: info
                            })

                            wx.reLaunch({
                                url:url
                            })
                        }
                    }
                })
            }
        })
    },

    onLoad: function () {
        var that = this;
        wx.getStorage({
            key: 'userinfo',
            success: function (res) {
                wx.request({
                    url: app.globalData.baseUrl + 'little/institution/checkApply',
                    data: {
                        unionId: res.data.unionId
                    },
                    success: function (result) {
                        if (result.data.result == 'succ') {
                            wx.redirectTo({
                                url: '/pages/teamwork/success?status='+result.data.info.status+'&comment='+result.data.info.comment
                            })
                        }else{
                            that.setData({
                                is_login:1
                            })
                        }
                    }
                })
            }
        })
    },

  /**
   * 勾选符合条件
   */
  listenChange: function (e) {
      if (e.detail.value != 0) {
        this.setData({
            is_next: false
        })
      } else {
        this.setData({
            is_next: true
        })
      }
  },

    //已登录、下一步
    gonext: function () {
        wx.navigateTo({
            url: '/pages/teamwork/teamwork'
        })
    },

    //未登录、授权登录
    getuser:function (e) {
        if (e.detail.encryptedData) {
            this.getUserInfo(e.detail.encryptedData,e.detail.iv,'/pages/teamwork/agreement');
        }
    }
})
