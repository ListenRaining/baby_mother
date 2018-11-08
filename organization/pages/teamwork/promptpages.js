// pages/teamwork/promptpages.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      types: options.types
    })
    if (options.types=='failaudit'){
      this.setData({
        comment: options.comment
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh: function () {

  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /*
    ++++以下是自定义函数部分+++++++++++++++++
  */
  //重新编辑
  redit:function(){
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        wx.request({
          url: app.globalData.baseUrl + 'little/institution/applyV10',
          data: {
            unionId: res.data.unionId,
            typeInfo: 'redit',
          },
          success: function (result) {
            if (result.data.result == 'succ') {
              wx.navigateTo({
                url: '/pages/teamwork/applicationform'
              })
            } else {
              wx.showModal({
                title: '异常',
                showCancel: false
              })
            }
          },
        })
      }
    })
  }


})