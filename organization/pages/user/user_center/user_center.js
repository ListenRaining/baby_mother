// user_center.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    earningsCnt:0,
    myinfo:[],           //个人信息
    manager:[]           //管理员信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'userinfo',
      success: function(res) {
        console.log(res)
        that.setData({
          myinfo:res.data
        })
        
          wx.request({
            url: app.globalData.baseUrl + 'little/institution/getManager',
            data: {
              manager_id: res.data.manager_id
            },
            success: function(_res) {
              console.log(_res.data.info)
              if (_res.data.result == 'succ') {
                that.setData({
                  manager: _res.data.info,
                  earningsCnt: _res.data.info.balance,
                  

                })
              }
            }
          })
        
      },
    })
  },

  /**
   * 跳转页面
   */
  toUrl: function(e) {
      var url = e.currentTarget.dataset.url
      url = url + '?ins_id=' + this.data.myinfo.ins_id
      wx.navigateTo({
          url: url,
      })
  },

  /**
   * 钱包明细
   */
  toWalletDetail: function () {
      wx.navigateTo({
          url: '/pages/money/detail/detail',
      })
  },

  /**
   * 去提现
   */
  toDraw: function() {
      wx.navigateTo({
          url: '/pages/money/draw/draw'
      })
  },
  
})