//活动管理
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    item_url: app.globalData.baseUrl,
    end:0,            //是否结束
    list:[],          //活动列表
    length:0          //是否有数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAct(this.data.end)
  },

  /**
   * 获取活动信息
   */
  getAct: function (end) {
    var that = this
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        var ins_id = res.data.ins_id
        wx.request({
          url: app.globalData.baseUrl + 'little/institution/insactlist',
          data: {
            ins_id: ins_id,
            end: end
          },
          success: function (data) {
            console.log(data)
            if (data.data.result == 'succ') {
              that.setData({
                list: data.data.info,
                length: data.data.info.length,
                end:end
              })
            } else {
              wx.showToast({
                title: '加载失败',
              })
            }
          }
        })
      },
    })
  },

  /**
   * 切换标签
   */
  switchChoose: function(options) {
    var end = options.currentTarget.dataset.end
    this.getAct(end)
  },

  /**
   * 活动详情
   */
  toActDetail: function(options) {
    var ins_act_id = options.currentTarget.dataset.ins_act_id
    var is_online = options.currentTarget.dataset.is_online
    var url = "/pages/activity/activity_detail/activity_detail?ins_act_id=" + ins_act_id + "&is_online=" + is_online

    wx.navigateTo({
      url: url,
    })
  }
})