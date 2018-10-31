//机构列表页
var app = getApp()

var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');

//实例化API核心类
var demo = new QQMapWX({
    key: 'A4XBZ-DVL3U-ALDVE-2W7NF-2GZNZ-K6BTC' // 必填
});

Page({

  data: {
      uid:0,
      act_id:0,         //活动id
      product_id:0,     //产品id
      price:0,          //产品价格
      act_price:0,      //支付价格
      source:'',        //从哪个页面调过来的 huodong:活动的购买页  chanpin:产品的购买页
      quan:0,           //是优惠券的活动:0-不是 1-是
      is_gift:0,        //1:领取赠送的产品  0:自行购买
      oid:'',           //订单自增id
      list: [],
      showbutton:true,  //显示确认按钮
      banci_id:''       //选择的班次
  },

  onLoad: function (options) {

      var quan = 0;
      if(options.quan == 1){
          quan = 1;
      }

      var is_gift = 0;
      if(options.is_gift){
          is_gift = options.is_gift
      }

      var oid = 0;
      if(options.oid){
          oid = options.oid
      }

      if(options.source == 'huodong'){ //从活动购买页跳转过来
          this.setData({
              act_id:options.act_id,
              source:options.source,
              quan:quan,
              price:options.price,
              act_price:options.act_price,
          })

          //设置导航标题为活动名称
          if(options.act_id == 23){
              wx.setNavigationBarTitle({
                  title: '选择场次'
              })
          }else{
              //设置导航标题为活动名称
              wx.setNavigationBarTitle({
                  title: '点击选择机构'
              })
          }

      }else if(options.source == 'chanpin'){ //从产品购买页跳转过来
          this.setData({
              product_id:options.product_id,
              source:options.source,
              price:options.price,
              quan:quan,
              is_gift:is_gift,
              oid:oid
          })

          //设置导航标题为活动名称
          wx.setNavigationBarTitle({
              title: '点击选择机构'
          })
      }
  },

  onShow: function () {

      var that = this;

      wx.getStorage({
          key: 'userinfo',
          success: function (res) {
              that.setData({
                  uid:res.data.uid
              })
          }
      })

      //定位
      wx.getLocation({
          success: function (res) {
              var lat = res.latitude
              var lng = res.longitude
              //定位城市信息
              demo.reverseGeocoder({
                  location: {
                      latitude: lat,
                      longitude: lng
                  },
                  success: function (res2) {

                      //城市中文
                      var citycn = res2.result.ad_info.city;

                      wx.request({
                          url: app.globalData.baseUrl + 'little/index/inslist',
                          data: {
                              lat: lat,
                              lng: lng,
                              citycn: citycn,
                              act_id:that.data.act_id
                          },
                          success: function (data) {
                              if (data.data.result == 'wrongcity') { //当前城市没有开放
                                  wx.navigateTo({
                                      url: '../noopen/noopen?cityname=' + data.data.reason
                                  })
                              }else if(data.data.result == 'fail'){
                                  wx.showModal({
                                      title: data.data.reason,
                                      showCancel: false,
                                  })
                                  return false;
                              }else if(data.data.result == 'succ') {
                                  that.setData({
                                      list: data.data.info,
                                      is_banci:data.data.is_banci
                                  })
                              }
                          }
                      })
                  }
              })
          }
      })
  },

    //勾选班次按钮
    radioChange: function(res) {
        this.setData({
            banci_id:res.detail.value,
            showbutton:false
        })
    },

    //取消按钮
    cancel: function() {
        this.setData({
            banci_id:'',
            showbutton: true
        })
    },

    //选择机构的班次
    beConfirm:function (e) {
        var banci_id = this.data.banci_id;
        if(banci_id == ''){
            wx.showModal({
                title: '请勾选活动时间！',
                showCancel: false,
            })
            return false;
        }

        //0:机构活动id  1:机构名称  2:场次id
        var banciList = banci_id.split("--");

        wx.redirectTo({
            url: '/pages/activity/order/order?id='+banciList[0]+'&act_id='+this.data.act_id+'&ins_name='+banciList[1]+'&quan='+this.data.quan+'&price='+this.data.price+'&act_price='+this.data.act_price+'&banci_id='+banciList[2]
        })
    },

  //选择机构
  toast: function (e) {

      var ins_name = e.currentTarget.dataset.ins_name; //机构名称

      if(this.data.source == 'huodong'){
          var id = e.currentTarget.dataset.id; //机构活动id
          wx.redirectTo({
              url: '/pages/activity/order/order?id='+id+'&act_id='+this.data.act_id+'&ins_name='+ins_name+'&quan='+this.data.quan+'&price='+this.data.price+'&act_price='+this.data.act_price
          })
      }else if(this.data.source == 'chanpin'){
          var ins_id = e.currentTarget.dataset.ins_id; //机构id
          wx.redirectTo({
              url: '/pages/product/buy?select_ins_id='+ins_id+'&select_ins_name='+ins_name+'&id='+this.data.product_id+'&price='+this.data.price+'&is_gift='+this.data.is_gift+'&oid='+this.data.oid
          })
      }
  }
})