//活动报名列表
var app = getApp()

Page({

  data: {
    item_url:app.globalData.baseUrl,
    list: [],
    length: 0
  },

  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        //拼装验证参数
        var timestamp = app.createTimeStamp()
        var str = "uid=" + res.data.uid + '&timestamp=' + timestamp;
        var signature = app.createSignatureStr(str);
        wx.request({
          url: app.globalData.baseUrl + 'little/index/myservice',
          data: {
            uid: res.data.uid,
            timestamp: timestamp,
            signature: signature
          },
          success: function (result) {
            that.setData({
              list: result.data.info,
              length: result.data.length
            })
          }
        })
      }
    })
  },

  /**
   * 跳转
   */
  toast: function (event) {
    var type = event.currentTarget.dataset.type;
    if (type == 1) { //活动详情
      var out_trade_no = event.currentTarget.dataset.out_trade_no;
      wx.navigateTo({
        url: '../orderinfo/orderinfo?orderid='+out_trade_no
      })
    }

    if (type == 2) { //产品详情
      var oid = event.currentTarget.dataset.oid;
      wx.navigateTo({
        url: '../orderinfo/orderinfo?oid=' + oid
      })
    }

    if (type == 3) { //赠送页面
      wx.navigateTo({
        url: '/pages/product/send'
      })
    }
  }
})