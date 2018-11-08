//二维码签到
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcode:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: app.globalData.baseUrl + 'little/operate/getsignqrcode',
      data: {
        ins_act_id: options.ins_act_id
      },
      success: function (res) {
        console.log(res)
        that.setData({
          qrcode: app.globalData.baseUrl + res.data.info
        })
      }
    })
  }
})