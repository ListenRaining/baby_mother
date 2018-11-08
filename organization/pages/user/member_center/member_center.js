//个人资料
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      info:[],     //机构信息
      location:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'userinfo',
      success: function(res) {
        var ins_id = res.data.ins_id
        wx.request({
          url: app.globalData.baseUrl + 'little/institution/institutioninfo',
          data:{
            ins_id: ins_id
          },
          success: function (res) {
            console.log('instInfo:',res)
            if (res.data.result == 'succ') {
              that.setData({
                info:res.data.info,
                location:res.data.info.location
              })
            } else {
              wx.showLoading({
                title: '正在加载...',
                mask: false
              })
            }
          }
        })
      },
      fail:function() {
        wx.showLoading({
          title: '正在加载...',
          mask: false,
        })
      }
    })
  },

  /**
   * 确认定位
   */
  checkLocation:function(){
    var that = this
    wx.getStorage({
      key: 'userinfo',
      success: function(user) {
        var ins_id = user.data.ins_id

        wx.chooseLocation({
          success: function (res) {
            console.log(res)
            var lat = res.latitude
            var lng = res.longitude
            wx.request({
              url: app.globalData.baseUrl + 'little/institution/confirmLocation',
              data: {
                lat: lat,
                lng: lng,
                ins_id: ins_id
              },
              success: function (msg) {
                if (msg.data.result == 'fail') {
                  wx.showModal({
                    title: msg.data.info,
                    showCancel: false
                  })
                } else {
                  that.setData({
                    location:1
                  })
                }
                
              }
            })
          },
        })
      },
    })
  },

  /**
   * 获取会员中心二维码
   */
  getQrcode: function () {
    console.log(this.data.info)
    var ins_id = this.data.info.ins_id
    wx.navigateTo({
      url: '/pages/user/show_code/show_code?ins_id='+ins_id,
    })
  },
})