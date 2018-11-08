//积分模块
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lastPageIndex: 1,
    info: []
  },
  detail: function () {
    wx.navigateTo({
      url: '../ruler/ruler'
    })
  },

    /**
     * 跳转详情页面
     */
    toDetail:function(e) {
        var id = e.currentTarget.id
        wx.navigateTo({
            url: '/pages/find/UGC_details/UGC_details?id=' + id
        })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 添加打开页面的时间戳
     */
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("当前时间戳为：" + timestamp);
    wx.setStorage({
      key: 'jifentime',
      data: timestamp,
    })

    var that = this
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        that.requestDetails(res.data.uid,that.data.lastPageIndex);
      },
    })
  },

  requestDetails:function(_uid,_p){
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + '/little/operate/scorelist',
      data: {
          uid: _uid,
          p: _p
      },
        method: 'post',
        header: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
      success: function (res) {
        if(res.data.result == 'succ') {
            that.setData({
                info: res.data.info,
                lastPageIndex: _p
            });
        }
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      var p = this.data.lastPageIndex+ 1;
      var that= this;

      wx.getStorage({
          key: 'userinfo',
          success: function (res) {
              that.requestDetails(res.data.uid,p);
          }
      })
  },
})