//机构勾选活动后，创建活动
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    item_url: app.globalData.baseUrl,
    info:[],
    act_name:[],
    act_id:[],
    act_list:[],
    Index:0,               //活动方案下标
    siteDesc:"30-50平",    //需求场地大小
    act_date: "",
    purpose_type: [],      //转化目标类型
    ptype_index:0,
    pnum_index:0,
    purpose_num: [],       //转化目标数量
    lat:'',                //坐标
    lng:'',                //坐标
    location: "",          //定位
    actIsFold: false       //查看活动详情
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //接收活动时间参数
    this.setData({
        act_date: options.act_date,
        class_id: options.class_id
    })

    //引入解析html类库
    var WxParse = require('../../../utils/wxParse/wxParse.js');
    var that = this
    wx.getStorage({
      key: 'userinfo',
      success: function(user) {
        wx.request({
          url: app.globalData.baseUrl + 'little/institution/activityinfo',
          data: {
              ins_id:user.data.ins_id,
          },
          success: function(res) {
              var info = res.data.info.act_list[that.data.Index];
              WxParse.wxParse('contents', 'html', info.contents, that, 15);

              that.setData({
                  act_name: res.data.info.act_name,
                  act_id: res.data.info.act_id,
                  act_list: res.data.info.act_list,
                  purpose_type: res.data.info.purpose_type,
                  purpose_num: res.data.info.purpose_num,
                  info:info,
              })
          }
        })
      },
    })
  },

  /**
   * 定位选择场地
   */
  getAddress: function(e) {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        console.log('res',res)
        that.setData({
          lat:res.latitude,
          lng:res.longitude,
          location:res.address
        })
      },
      fail:function(res2){
          console.log(res2);
      }
    })
  },

  /**
   * 表单提交
   */
  formSubmit: function(e) {
    var that = this
    var purpose_type = parseFloat(that.data.ptype_index);
    var purpose_num = parseFloat(that.data.pnum_index);
    wx.getStorage({
      key: 'userinfo',
      success: function(user) {
        wx.request({
          url: app.globalData.baseUrl + 'little/institution/addactivity',
          data: {
            ins_id: user.data.ins_id,
            act_id: that.data.act_id[that.data.Index],
            class_id: that.data.class_id,
            act_date: e.detail.value.date,
            location: that.data.location,
            lat: that.data.lat,
            lng: that.data.lng,
            purpose_type: purpose_type,
            purpose_num: purpose_num,
            apply_comment: e.detail.value.apply_comment,
            limit_num: e.detail.value.limit_num
          },
          success: function (res) {
            if (res.data.result == 'succ') {
              // wx.navigateTo({
              //     url: "/pages/activity/activity_detail/activity_detail?ins_act_id=" + res.data.ins_act_id + "&is_online=" + res.data.is_online
              // })
              wx.switchTab({
                  url: '/pages/activity/activity_manager/activity_manager',
              })
            } else {
              wx.showModal({
                title: res.data.reason,
                showCancel: false
              })
            }
          }
        })
      },
    })
  },

  /**
  * 查看、收起活动方案
  */
  switchs: function (e) {
    var actIsFold = !this.data.actIsFold
    this.setData({
      actIsFold: actIsFold
    })
  },

  /**
   * 选择活动方案
   */
  chooseAct:function(e) {
      //引入解析html类库
      var WxParse = require('../../../utils/wxParse/wxParse.js');
      var that = this
      wx.getStorage({
          key: 'userinfo',
          success: function(user) {
              wx.request({
                  url: app.globalData.baseUrl + 'little/institution/activityinfo',
                  data: {
                      ins_id:user.data.ins_id,
                  },
                  success: function(res) {
                      var info = res.data.info.act_list[e.detail.value];
                      WxParse.wxParse('contents', 'html', info.contents, that, 15);

                      that.setData({
                          Index:e.detail.value,
                          act_name: res.data.info.act_name,
                          act_id: res.data.info.act_id,
                          act_list: res.data.info.act_list,
                          purpose_type: res.data.info.purpose_type,
                          purpose_num: res.data.info.purpose_num,
                          info:info
                      })
                  }
              })
          },
      })
  },

  /**
   * 选择转化目标类型
   */
  chooseType: function (e) {
      this.setData({
          ptype_index: e.detail.value
      })
  },

  /**
   * 选择转化目标数量
   */
  chooseNum: function (e) {
      this.setData({
          pnum_index: e.detail.value
      })
  },
})