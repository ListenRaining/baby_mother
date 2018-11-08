App({
  /*
  memberType 会员类型，newmember(新申请会员)，oldmember(已合作会员)
  */
  getUserInfo: function (encryptedData, iv) {
        var that = this;
        wx.login({
            success: function (res) {
                wx.request({
                    url: that.globalData.baseUrl + 'api/institution/checkcode',
                    data: {
                        code: res.code,
                        encryptedData: encryptedData,
                        iv: iv,
                    },
                    success: function (data) {
                        var info = data.data.trim();
                        info = JSON.parse(info);
                        if (info.unionId) {
                            wx.getStorage({
                                key: 'manager',
                                success: function(res) {
                                    wx.request({
                                        url: that.globalData.baseUrl + 'little/institution/upuser',//用户绑定小程序
                                        data: {
                                            manager_id: res.data.manager_id,
                                            unionid: info.unionId
                                        },
                                        success: function(result) {
                                            if (result.data.result == 'succ') {
                                                info.manager_id = res.data.manager_id
                                                info.ins_id = res.data.ins_id
                                                info.main = res.data.main
                                                /*
                                                缓存用户类型数据(新申请合作会员与已合作会员)，当用户刷新的时候防止logo页面直接跳转
                                                /pages/class/schedule/schedule页面情况
                                                */
                                                info.memberType = res.data.memberType
                                                
                                                //设置缓存
                                                wx.setStorage({
                                                    key: 'userinfo',
                                                    data: info
                                                })
                                               
                                                wx.switchTab({
                                                  url: '/pages/class/schedule/schedule',
                                                })
                                              
 
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            }
        })
    },

    globalData: {
        // baseUrl: "https://act.fableedu.com/",
        // baseUrl: "http://act.test.fableedu.com/"
        // baseUrl: "http://qizheng.leju.com/"
        baseUrl: "http://act.test.fableedu.com/"
    }
})