//机构申请
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onLoad: function (options) {
    var that = this;
    //查看机构详情
    if (options.cid) {

      var timestamp = app.createTimeStamp()
      var str = "cid=" + options.cid + '&timestamp=' + timestamp
      var signature = app.createSignatureStr(str);

      wx.request({
        url: app.globalData.baseUrl + 'little/Institution/checkApplyV10',
        data: {
          cid: options.cid,
          timestamp: timestamp,
          signature: signature,
        },
        success: function (res) {
          console.log(res.data.info);
          that.setData({
            info: res.data.info
          })
        }
      })
    }

  },

  onShow:function(e){

  }
   
})