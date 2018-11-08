// pages/my/OutboundRecords/Out-records.js

var app = getApp()
Page({
  data: {
    //待外访自动bottom颜色
    currentTab:0,
  },

  //下拉刷新
  onPullDownRefresh: function () {
    /*
      wx.showNavigationBarLoading() //在标题栏中显示加载
      //模拟加载
      setTimeout(function () {
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }, 1500);
    */
  },

  onLoad: function () {
    var that = this;
    /**
     * 获取系统宽高自动调整高度
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight:res.windowHeight,
        });
      }
    });
    
  },

  onShow:function(){
    var that=this;
    that.getList(that.data.currentTab);
  },

  /**
     * 切换tab
     */
  bindChange: function (e) {
   var that = this;
    var currentTab = e.target.dataset.current;
    if (currentTab==0){
      that.setData({ 
        currentTab: 0
      });
    }else{
      that.setData({
        currentTab: 1
      });
    }
    //获取外访数据
    that.getList();
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
  onPullDownRefresh: function () {

  },

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
  
  //获取待外访与已完成数据
  getList:function(){
    var that = this;
    wx.getStorage({
      key: 'userinfo',
      success: function (info) {

        var timestamp = app.createTimeStamp()
        var str = "uid=" + info.data.uid + '&timestamp=' + timestamp
        var signature = app.createSignatureStr(str);

        wx.request({
          url: app.globalData.baseUrl + 'little/operate/insOutboundListV10',
          data: {
            uid: info.data.uid,
            timestamp: timestamp,
            signature: signature,
            currentTab: that.data.currentTab
          },
          success: function (result) {
            that.setData({
              info: result.data.info
            })
          }
        })
      },
    })
  },

  

  //跳转机构页
  showOutbound: function (e) {
    console.log(e);
    var id=e.currentTarget.dataset.id;
    var ins_name = e.currentTarget.dataset.ins_name;
    var username = e.currentTarget.dataset.username;
    var mobile = e.currentTarget.dataset.mobile;
    var address = e.currentTarget.dataset.address;
    wx.navigateTo({
      url: '/pages/my/outboundv10/add?id=' + id + '&ins_name=' + ins_name + '&username=' + username + '&mobile=' + mobile + '&address=' + address
    })
  },



})