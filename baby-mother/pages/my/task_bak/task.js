//任务
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:[],
    cardCount:0,  //音乐能量卡数量
    is_result:0,
    reason:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that = this
    wx.getStorage({
        key: 'userinfo',
        success: function (info) {
            wx.request({
                url: app.globalData.baseUrl + 'little/operate/tasklist',
                data: {
                    uid: info.data.uid
                },
                success: function (res) {
                    if(res.data.result == 'succ') {
                        that.setData({
                            info: res.data.info,
                            cardCount:res.data.info.cardCount,
                            is_result:1
                        })
                    }else{
                        that.setData({
                            is_result:2,
                            reason:res.data.reason
                        })
                    }
                }
            })
        },
    })
  },

  goSend:function (e) {
      var addType = e.currentTarget.dataset.addType;
      var mission_index = e.currentTarget.dataset.mission_index;
      wx.navigateTo({
          url: '/pages/find/publish_article/publish_article?add='+addType+'&mission_index='+mission_index,
      })
  }
})