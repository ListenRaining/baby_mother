//订单详情
var app = getApp()

Page({

  data: {
    info: [],
    rootRelativePath: '../../../',
    info_type:0        //内容类型
  },

  onLoad: function (options) {
    var that = this;
    if (options.orderid) {
      wx.request({
        url: app.globalData.baseUrl + 'little/index/myActivityDetail',
        data: {
          out_trade_no: options.orderid
        },
        success: function (res) {
          if (res.data.result == 'succ') {
            that.setData({
              info: res.data.info,
              info_type: 1
            })
          } else {
            wx.showModal({
              title: res.data.reason,
              showCancel:false
            })
            return false;
          }
        },
      })
    }
    if (options.oid) {
      wx.request({
        url: app.globalData.baseUrl + 'little/operate/myorder',
        data: {
          oid: options.oid
        },
        success: function (res) {
          if (res.data.result == 'succ') {
            that.setData({
              info: res.data.info,
              info_type: 2
            })
          } else {
            wx.showModal({
              title: res.data.reason,
              showCancel:false
            })
            return false;
          }
        }
      })
    }
  },

  //未支付订单去支付
  toast: function (event) {
    var id = event.currentTarget.id
    wx.navigateTo({
      url: that.data.rootRelativePath + 'pages/activity/order/order?id=' + id
    })
  },

  gotoContract:function(e) {
    wx.navigateTo({
      url: '/pages/my/orderinfo/contract?orderid=' + e.currentTarget.dataset.orderid
    })
  },

  /**
   * 会员服务协议
   */
  gotoAgree: function (e) {
    wx.navigateTo({
      url: '/pages/product/agree?id=3'
    })
  }
})