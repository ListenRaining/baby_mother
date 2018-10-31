//用户管理
var app = getApp();

Page({

  data: {
    rootRelativePath: '../../../',
    share_id:0,
    share_type:0,
    tabNum:1,
    userlist:[]
  },

  onLoad: function (options) {

    var that = this;

    //分享给平台内部用户
    if(options.share_id){
      that.setData({
        share_id:options.share_id,
        share_type:options.share_type
      })
    }

    wx.getStorage({
      key: 'userinfo',
      success: function (info) {
        var timestamp = app.createTimeStamp();
        var str = "uid=" + info.data.uid + "&timestamp=" + timestamp;
        var signature = app.createSignatureStr(str);
        wx.request({
          url: app.globalData.baseUrl + 'little/index/getContactsList',
          data: {
            uid: info.data.uid,
            timestamp: timestamp,
            signature: signature
          },
          success: function (res) {
            that.setData({
              userlist:res.data.info,
              newCount:res.data.newCount,
              intentionCount:res.data.intentionCount
            })
          }
        })
      }
    })
  },

  //tab切换
  tabCheck:function(e){
    var that = this;
    var typeid = e.currentTarget.id;
    wx.getStorage({
      key: 'userinfo',
      success: function (info) {
        var timestamp = app.createTimeStamp();
        var str = "uid=" + info.data.uid + "&timestamp=" + timestamp;
        var signature = app.createSignatureStr(str);
        wx.request({
          url: app.globalData.baseUrl + 'little/index/getContactsList',
          data: {
            uid: info.data.uid,
            timestamp: timestamp,
            signature: signature,
            typeid:typeid
          },
          success: function (res) {
            that.setData({
                tabNum:typeid,
                userlist:res.data.info,
                newCount:res.data.newCount,
                intentionCount:res.data.intentionCount
            })
          }
        })
      }
    })
  }
})