//签到页
var app = getApp()

Page({
  
  data: {
    code: 0,
    msg: '',
    id: 0
  },

  onLoad: function (options) {
    var id = options.id
    var that = this;
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        wx.request({
          url: app.globalData.baseUrl + 'little/index/signup',
          data: {
            id: id,
            uid: res.data.uid
          },
          success: function (data) {
            that.setData({
              msg: data.data.reason,
              code: data.data.code,
              id: data.data.id
            })
          }
        })
      }
    })
  },

  toast: function (event) {
    wx.switchTab({
      url: '../index/index',
    })
  },

  go2order: function (event) {
    var id = event.currentTarget.id
    wx.redirectTo({
      url: '../matchinfo/matchinfo?id='+id
    })
  }
})