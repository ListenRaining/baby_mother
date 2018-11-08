// pages/user/matched_teacher/matched_teacher.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item_url:app.globalData.baseUrl,
    list:[],       //数据列表
    starArr: [1, 2, 3, 4, 5]    //星星数量

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var ins_id = options.ins_id
    wx.request({
      url: app.globalData.baseUrl + 'little/institution/insteachers',
      data: {
        ins_id: ins_id,
      },
      success: function(res) {
        console.log('res',res)
        if (res.data.result == 'succ') {
          that.setData({
            list: res.data.info
          })
        } else {
          wx.showLoading({
            title: '正在加载...',
          })
        }
      }
    })
  },

  call: function(e) {
    var mobile = e.currentTarget.dataset.mobile
    wx.showModal({
      title: '是否拨通电话',
      content: mobile,
      success:function(res){
        console.log(res)
        //联系老师
        if (res.confirm == true) {
          wx.makePhoneCall({
            phoneNumber: mobile,
          })
        }
      }
    })
  }

  
})