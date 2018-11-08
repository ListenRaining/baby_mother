//收益明细详情页
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ins_id:0,
    list:[],
    show:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'userinfo',
      success: function(res) {
        wx.request({
          url: app.globalData.baseUrl + 'little/institution/getwalletAll',
          data: {
              ins_id: res.data.ins_id
          },
          success: function (_res) {
            console.log(_res)
            if (_res.data.result == 'succ') {
              that.setData({
                list: _res.data.info
              })
            }
          }
        })
      },
    })
  },

  showDetail:function(e) {
    console.log(e)
    var show = e.currentTarget.dataset.show
    if (show == this.data.show) {
      show = null
    }
    this.setData({
      'show':show,
    })
  }
})