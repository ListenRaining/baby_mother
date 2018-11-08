//购买成功页
var app = getApp()

Page({

  data: {
    rootRelativePath: '../../',
    is_gift: 0,    //是否为领取的赠送订单
    gift: 0,       //礼品订单支付
    oid: 0         //订单自增id
  },

  onLoad: function (options) {

  },

  //选择班级
  gotoorder: function () {
    var url = '/pages/my/orderlist/orderlist'
    wx.navigateTo({
      url: url,
    })
  },

})