// pages/class/schedule/schedule.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item_url:app.globalData.baseUrl,
    end:0,  //默认为正在进行（未结课）的班级
    list:[],
    length:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'userinfo',
      success: function(res) {

        //判断用户是否从ERP同步合同数据过来，如果存在实时进入正常合作状态
        wx.request({
          url: app.globalData.baseUrl + 'little/institution/checkUserV10',
          data: {
            unionId: res.data.unionId,
          },
          success: function (result) {

            if (result.data.result == 'fail') {
              wx.redirectTo({
                url: '/pages/teamwork/applicationform',
              })   
            }
          }
        })
      },
      fail: function() {
        app.getUserInfo()        
      }
    })
  },

  onShow: function() {
    //获取日程
    //this.getSchedule(this.data.end)
  },

  /**
   * 切换标签
   */
  switchChoose: function(option) {
    var end = option.currentTarget.dataset.id
    this.getSchedule(end)
  },

  /**
   * 获取数据
   */
  getSchedule : function(end) {
    var that = this
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        console.log('-------缓存-------', res)
        var ins_id = res.data.ins_id
        wx.request({
          url: app.globalData.baseUrl + 'little/institution/getschedule',
          data: {
            ins_id: ins_id,
            end: end
          },
          success: function (data) {
            console.log('------data-------', data)
            if (data.data.result == 'succ') {
              that.setData({
                list: data.data.info,
                end:end,
                length:data.data.total
              })
            } else {
              wx.showToast({
                title: '加载错误',
              })
            }

          }
        })
      },
      fail:function(res){
        // that.getSchedule(end)
      }
    })
  },

  /**
   * 班级详情
   */
  classDetail: function(res) {
    var class_id = res.currentTarget.dataset.id
    var url = '/pages/class/class_message/class_message?class_id=' + class_id;
    wx.navigateTo({
      url: url,
    })
  },


  /**
   * 跳转到创建班级
   */
  gotoCreateclass: function (res) {
    wx.navigateTo({
    url: '/pages/user/time_manager/time_manager',
  })
  }
  

})