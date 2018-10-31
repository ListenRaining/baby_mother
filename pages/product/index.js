//产品列表页
var app = getApp()

Page({

  data: {
    item_url:app.globalData.baseUrl,
    uid:0,
    list:[]
  },

  onLoad: function (options) {
    if (options.scene) {
      var scene = decodeURIComponent(options.scene)
      var arr = scene.split(',');
      var puid = arr[0];
      wx.setStorage({
        key: 'puid',
        data: puid,
      })
    }

    if (options.puid) {
      wx.setStorage({
        key: 'puid',
        data: options.puid
      })
    }

    var that = this;
    wx.request({
      url: app.globalData.baseUrl + 'little/operate/product_list',
      data: {},
      success: function(res) {
        if (res.data.result == 'succ') {
          that.setData({
            list:res.data.info
          })
        }
      }
    })
  },

  onShow:function(){
      var that = this;
      wx.getStorage({
          key: 'userinfo',
          success: function (res) {
              that.setData({
                  uid:res.data.uid
              })
          }
      })
  },

  gotoIntr: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/product/introduce?id=' + id,
    })
  }
})