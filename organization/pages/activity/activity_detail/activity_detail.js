//活动详情
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    item_url: app.globalData.baseUrl,
    is_online:0,       //是否为线上活动，0：线下；1：线上
    info: [],          //活动信息
    list:[],           //报名列表
    ins_act_id:0       //当前活动id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var ins_act_id = options.ins_act_id

    this.setData({
      is_online: options.is_online,
      ins_act_id: ins_act_id
    })

    //活动详情
    wx.request({
      url: app.globalData.baseUrl + 'little/institution/getactdetail',
      data: {
          ins_act_id : ins_act_id
      },
      success: function(res) {
        console.log('活动详情',res)
        if (res.data.result == 'succ') {
          that.setData({
            info: res.data.info
          })
        }
      }
    })

    //报名列表
    this.getApply(ins_act_id,0);
  },

  //获取报名列表
  getApply: function(id, mobile) {
    var that = this
    wx.request({
      url: app.globalData.baseUrl + 'little/institution/getapplylist',
      data: {
        ins_act_id: id,
        mobile: mobile
      },
      success: function(res) {
        console.log(res)
        if (res.data.result == 'succ') {
          that.setData({
            list: res.data.info
          })
        } else {
          wx.showToast({
            title: '加载错误',
          })
        }
      }
    })
  },

  /**
   * 签到
   */
  signUp: function(e) {
    console.log('签到',e)
    var that = this

    wx.request({
      url: app.globalData.baseUrl + 'little/index/signup',
      data: {
        uid : e.currentTarget.dataset.uid,
        id: that.data.ins_act_id
      },
      success: function(res) {
        wx.showToast({
          title: res.data.reason,
        })
        that.getApply(that.data.ins_act_id,0);
      }
    })
  },

  /**
   * 搜索
   */
  formSubmit: function(e) {
      this.getApply(e.detail.value.ins_act_id, e.detail.value.mobile);
  },

  //二维码签到
  signCode: function() {
    wx.navigateTo({
        url: '/pages/activity/show_code/show_code?ins_act_id='+this.data.ins_act_id
    })
  },
})