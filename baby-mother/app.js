//app.js

var MD5Util = require('./utils/md5.js');

App({

  getUserInfo: function (url) {
    var that = this

    //调用登录接口
    wx.login({
      success: function (res) {
        var code = res.code
        wx.getUserInfo({
          success: function (res2) {
              wx.showLoading({
                  title: '加载中',
                  mask:true
              })

            var encryptedData = res2.encryptedData;
            var iv = res2.iv;
            // 调用接口获取用户信息
            wx.request({
              url: that.globalData.baseUrl +'api/operate/checkcode',
              data: {
                code: code,
                encryptedData: encryptedData,
                iv: iv,
              },
              success: function (data) {
                var info = data.data.trim()
                info = JSON.parse(info)
                console.log('userinfo:',info);
                wx.request({
                  url: that.globalData.baseUrl+'api/member/adduser',
                  data:{
                    username: info.nickName,
                    avatar: info.avatarUrl,
                    unionid: info.unionId,
                    openid: info.openId
                  },
                  success:function(code){
                    info.uid = code.data.uid

                    //用户信息入缓存
                    wx.setStorage({
                      key: 'userinfo',
                      data: info,
                    })

                    //隐藏加载中的提示语
                    wx.hideLoading()

                    //如果有弱关系标识，绑定弱关系、并把邀请人id入缓存
                    wx.getStorage({
                      key: 'puid',
                      success: function(p) {
                        var arr = p.data.split('-')
                        var puid = arr[0]
                        var recordtime = arr[1]
                        console.log('获取邀请人信息', arr)
                        if (puid != code.data.uid) {
                          wx.request({
                            url: that.globalData.baseUrl + 'little/operate/addPrepareUid',
                            data: {
                              uid: code.data.uid,
                              prepare_uid: puid
                            },
                            success: function (res2) {
                              console.log('----绑定弱关系----', res2)
                            },
                          })
                        }
                      },
                    })

                      wx.reLaunch({
                          url:url
                      })
                  }
                })
              }
            })
          },
          fail: function (res3) {
            //拒绝授权,跳转到小程序授权管理页面
             wx.redirectTo({
               url: '/pages/login/login',
             })
            //that.openSetting()
          }
        })
      }
    })
  },

    getUserInfoNew: function (encryptedData,iv,channel_id) {
        var that = this;
        //调用登录接口
        wx.login({
            success: function (res) {
                var code = res.code
                //调用接口获取用户信息
                wx.request({
                    url: that.globalData.baseUrl +'api/operate/checkcode',
                    data: {
                        code: code,
                        encryptedData: encryptedData,
                        iv: iv,
                    },
                    success: function (data) {
                        var info = data.data.trim();
                        info = JSON.parse(info);
                        wx.request({
                            url: that.globalData.baseUrl+'api/member/adduser',
                            data:{
                                username: info.nickName,
                                avatar: info.avatarUrl,
                                unionid: info.unionId,
                                openid: info.openId,
                                channel_id:channel_id
                            },
                            success:function(code){
                                //用户uid
                                info.uid = code.data.uid;

                                //用户信息入缓存
                                wx.setStorage({
                                    key: 'userinfo',
                                    data: info,
                                })

                                //如果有弱关系标识，绑定弱关系
                                wx.getStorage({
                                    key: 'puid',
                                    success: function(p) {
                                        console.log('获取邀请人信息',p)
                                        return false;
                                        if (puid != code.data.uid) {
                                            wx.request({
                                                url: that.globalData.baseUrl + 'little/operate/addPrepareUid',
                                                data: {
                                                    uid: code.data.uid,
                                                    prepare_uid: puid
                                                },
                                                success: function (res2) {
                                                    console.log('----绑定弱关系----', res2)
                                                },
                                            })
                                        }
                                    },
                                })

                                wx.getStorage({
                                    key: 'gourl',
                                    success: function (res) {
                                        wx.removeStorage({
                                            key: 'gourl',
                                        })

                                        wx.reLaunch({
                                            url:res.data
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    },

  // 时间戳产生函数
  createTimeStamp: function () {
    return parseInt(new Date().getTime() / 1000) + ''
  },

  //生成签名串
  createSignatureStr: function (str) {
    var str = str + '&signkey=B@Y3PoRsHyXPm^MW*SIv%cyYD1n9cmIw';
    return MD5Util.MD5(str).toUpperCase();
  },

  //跳转设置页面授权
  openSetting: function () {
    var that = this
    wx.openSetting({
      success: function (res) {
          that.getUserInfo()
      }
    })
  },

  /**检查弱关系邀请人，添加邀请人缓存 */
  checkPuid:function(puid){
    wx.setStorage({
      key: 'puid',
      data: puid
    })
  },

    globalData:{
        baseUrl: "http://act.test.fableedu.com/",
        // baseUrl: "http://qizheng.leju.com/"
    }
})