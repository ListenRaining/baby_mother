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
    more:2,
    key: 1,
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
                url: app.globalData.baseUrl + 'little/operate/task',
                data: {
                    uid: info.data.uid
                },
                success: function (res) {
                  console.log(res)
                    if(res.data.result == 'succ') {
                      that.setData({
                          info: res.data.info,
                          cardCount:res.data.info.cardCount,
                          key: res.data.key
                      })
                    }else{
                      that.setData({
                          reason:res.data.reason
                      })
                    }
                }
            })
        },
    })
  },

  getMore:function (e) {
    this.setData({
      more:1000,
    })
  },

  toDo: function(e) {
    console.log(e.currentTarget.dataset.key)
    wx.navigateTo({
      url: '/pages/my/task/homework?k='+e.currentTarget.dataset.key+'&complete='+e.currentTarget.dataset.status,
    })
  }
})