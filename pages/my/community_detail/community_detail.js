//二级社群

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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this
      wx.request({
          url: app.globalData.baseUrl + '/little/operate/getAssociation',
          data: {
              uid: options.uid
          },
          success: function (res) {
              //设置导航标题为活动名称
              wx.setNavigationBarTitle({
                  title: options.name+'的社群'
              })
              that.setData({
                  infors: res.data.info.list,
                  length: res.data.info.list.length
              });
          }
      })
  }
})