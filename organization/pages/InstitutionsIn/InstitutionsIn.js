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
  //个人信息
  toPreson: function () {
    wx.navigateTo({
      url: '/pages/my/InstitutionsIn/person'
    })
  },

  //机构信息
  toOrganization: function () {
    wx.navigateTo({
      url: '/pages/my/InstitutionsIn/organization'
    })
  },

  //周边信息
  toRim: function () {
    wx.navigateTo({
      url: '/pages/my/InstitutionsIn/rim'
    })
  },


 

   
  
})