var app = getApp()

Page({

  data: {
    item_url:app.globalData.baseUrl,
    send:0,      //0:赠送  1:领取
    oid:0,       //赠送的订单id
    recive:0,    //是否领取  0：未领取；1：已领取
    info:[],     //详情信息
    user:[],     //用户信息
    is_login:0   //是否已登录
  },

  onLoad: function (options) {
    var that = this;
    that.setData({
      send:options.send
    })

    if (options.recive) {
      that.setData({
        recive:options.recive
      })
    }

    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        that.setData({
          is_login:1
        })
      }
    })

    wx.request({
      url: app.globalData.baseUrl + 'little/operate/orderinfo',
      data: {
        id:options.oid,
        send:that.data.send,
        recive:that.data.recive
      },
      success: function(res) {
        if (res.data.result == 'succ') {
          that.setData({
            oid:options.oid,
            info:res.data.info,
            user: res.data.buyer
          })
        }
      }
    })
  },

  /**
   * 分享
   */
  onShareAppMessage: function (res) {
    return {
        title: this.data.user.nickName+'赠送给您一份礼物',
        path: '/pages/my/send/send_detail?oid='+this.data.oid+'&send=1',
    }
  },

  /**
   * 领取礼物(已登录)
   */
  recive: function() {
    wx.redirectTo({
      url: '/pages/product/buy?is_gift=1&oid='+this.data.oid+'&price='+this.data.info.price+'&id='+this.data.info.id+'&from=1'
    })
  },

  /**
   * 领取礼物(未登录，需授权)
   */
  getuser: function(e) {
    if(e.detail.encryptedData){
      wx.setStorage({
          key: 'gourl',
          data: '/pages/product/buy?is_gift=1&oid='+this.data.oid+'&price='+this.data.info.price+'&id='+this.data.info.id+'&from=1'
      })      
        
      app.getUserInfoNew(e.detail.encryptedData,e.detail.iv);
    }
  }
})