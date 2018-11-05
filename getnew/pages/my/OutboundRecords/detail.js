//外访机构详情
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      item_url:app.globalData.baseUrl,
      id:0,
      info:[]
  },

  onLoad: function (options) {
    var that = this
    wx.request({
      url: app.globalData.baseUrl + 'little/operate/getoutboundInfo',
      data: {
          id:options.id
      },
      success:function(res) {
          that.setData({
              id:options.id,
              info:res.data.info
          });
      },
    })
  }
})