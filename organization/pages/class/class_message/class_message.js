// pages/class/class_message/class_message.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:[],         //班级详细信息
    student:[]       //学生信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var class_id = options.class_id
    wx.request({
      url: app.globalData.baseUrl + 'little/institution/getclassdetail',
      data:{
        class_id:class_id,
      },
      success: function(res) {
        if (res.data.result == 'succ') {
          that.setData({
            info:res.data.info.class,
            student:res.data.info.student
          })
        }
      }
    })
  },

  
})