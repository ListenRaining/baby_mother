// pages/my/generalize/prolist.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item_url:app.globalData.baseUrl,
    list:[],
    id:0,                    //产品id
    type:0,                  //推广类型1：活动；2：产品
  },

  /**
   * 首加载
   */
  onLoad: function(e) {
    var that = this
    wx.getStorage({
      key: 'userinfo',
      success: function(res) {
        wx.request({
          url: app.globalData.baseUrl + 'little/operate/newproductList',
          data: {
            uid: res.data.uid,
          },
          success: function (_res) {
            console.log(_res)
            if (_res.data.result == 'succ') {
              that.setData({
                list:_res.data.info
              })
            }
          }
        })
      }
    })
  },

  /**
   * 切换产品
   */
  radioChange: function (e) {
    var arr = e.detail.value.split('-');
    var id = arr[0];
    var type = arr[1];

    this.setData({
      id: id,
      type: type
    })
  }
})