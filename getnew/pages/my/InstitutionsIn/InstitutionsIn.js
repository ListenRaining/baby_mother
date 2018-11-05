//活动报名列表
var app = getApp()

Page({

  data: {
    item_url:app.globalData.baseUrl,
    list: [],
    length: 0,
    peson_1:0,
    play_1: 1,
    area_1: 2,
    update:0,

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



  queryItemClick: function (e) {
    var that = this
    //拿到点击的index下标
    var index = e.currentTarget.dataset.index
    //将对象转为string
    var queryBean = JSON.stringify(that.data.queryList[index])
    wx.navigateTo({
      url: '../queryResult/queryResult?queryBean=' + queryBean,
    })
  },

  /**
   * 跳转
   */
  //个人信息
  toPreson: function () {
    var index = 0
    var queryBean = JSON.stringify(index)
    wx.navigateTo({
      url: '/pages/my/InstitutionsIn/person?queryBean=' + queryBean,
    })
  },

  //机构信息
  toOrganization: function () {
    var index = 1
    var queryBean = JSON.stringify(index)
    wx.navigateTo({
      url: '/pages/my/InstitutionsIn/person?queryBean=' + queryBean,
    })
  },

  //周边信息
  toRim: function () {
    var index = 2
    var queryBean = JSON.stringify(index)
    wx.navigateTo({
      url: '/pages/my/InstitutionsIn/person?queryBean=' + queryBean,
    })
  },

  //审核页面
  toAudit: function () {
    
    var index = 0
    var queryBean = JSON.stringify(index)
    wx.navigateTo({
      url: '/pages/my/InstitutionsIn/success?queryBean='+ queryBean,
    })
  },
  
})