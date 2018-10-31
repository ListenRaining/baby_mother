//社群
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rootRelativePath: '../../../../',
    memberTypeColorTB:{
        "宝妈合伙人":"#dba852",
        "果仁宝妈": "#de673e",
        "果肉宝妈": "#f79393",
        "果壳宝妈": "#f5d7a1",
    },
    infors:[],
    length:0
  },

  onLoad: function() {
    /**
     * 添加打开页面的时间戳
     */
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("当前时间戳为：" + timestamp);
    wx.setStorage({
      key: 'shequntime',
      data: timestamp,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that = this;
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        var _uid = res.data.uid;
        //拼装验证参数
        var timestamp = app.createTimeStamp()
        var str = "uid=" + _uid + '&timestamp=' + timestamp;
        var signature = app.createSignatureStr(str);
        wx.request({
          url: app.globalData.baseUrl + '/little/operate/getassociation',
          data: {
            uid: _uid,
            timestamp: timestamp,
            signature: signature
          },
          success: function (res) {
            that.setData({
                infors: res.data.info.list,
                length: res.data.info.list.length
            });
          }
        })
      }
    });
  },


  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
    wx.showLoading({
      title: '加载中...',
    })
    var that = this;
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        var _uid = res.data.uid;
        //拼装验证参数
        var timestamp = app.createTimeStamp()
        var str = "uid=" + _uid + '&timestamp=' + timestamp;
        var signature = app.createSignatureStr(str);
        wx.request({
          url: app.globalData.baseUrl + '/little/operate/getassociation',
          data: {
            uid: _uid,
            timestamp: timestamp,
            signature: signature
          },
          success: function (res) {
            wx.hideLoading()
            that.setData({
                infors: res.data.info.list,
                length: res.data.info.list.length
            });
          }
        })
      }
    });
  },

  //去二级社群页
  touch: function (event) {
    wx.navigateTo({
      url: '../community_detail/community_detail?uid='+event.currentTarget.dataset.id+'&name='+event.currentTarget.dataset.name
    })
  },
})