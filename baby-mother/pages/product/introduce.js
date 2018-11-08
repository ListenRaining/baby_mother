//产品详情页
var app = getApp()

Page({

  data: {
    rootRelativePath: '../../',
    item_url: app.globalData.baseUrl,
    id:0,               //产品id
    info:[],
    uid:0,
    userinfo:[],        //用户信息
    status:0,           //体验课领取状态
    double:0,           //默认一个按钮
    bag_k:1,            //默认选一个课包
    bag_c:[],           //选择的课包

    is_activity:0,      //活动标志
    detailinfo:[],      //成团情况
    member:[],          //团员列表
    explainValue:0,     //活动规则

    //活动倒计时
    maxtime: "",
    isHiddenLoading: true,
    isHiddenToast: true,
    dataList: {},
    countDownDay: 0,
    countDownHour: 0,
    countDownMinute: 0,
    countDownSecond: 0
  },

  onLoad: function(options) {

    console.log('转发参数',options);

    var puid = 0;
    var is_activity = 0;

    //扫描二维码带参数
    if (options.scene) {
      var scene = decodeURIComponent(options.scene)
      var arr = scene.split(',');
      console.log('二维码参数',arr);
      puid = arr[0];
      var id = arr[1];
      is_activity=arr[2];

      app.checkPuid(puid)
    }

    //如果有转发邀请
    if (options.puid) {
      puid = options.puid;
      app.checkPuid(puid)
    }

    //产品id
    if (options.id) {
      var id = options.id
    }

    //活动标示
    if(options.is_activity){
        is_activity = options.is_activity;
    }

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var that = this

    //产品详情
    wx.request({
      url: app.globalData.baseUrl + 'little/operate/productDetail',
      data: {
        id: id
      },
      success: function(res) {
        //引入解析html类库
        var WxParse = require('../../utils/wxParse/wxParse.js');
        wx.setNavigationBarTitle({
            title: res.data.info.name + "介绍"
        })

        WxParse.wxParse('detail', 'html', res.data.info.detail, that, 0);
        if (res.data.result == 'succ') {

          //活动到期时间
          var expiretime = res.data.expiretime;

          //活动标示
          if (id == 3 && is_activity == 1 && timestamp<expiretime) {
              var bag_c = res.data.bags[10]
              that.setData({
                  id:id,
                  puid:puid,
                  info:res.data.info,
                  total:res.data.total,
                  bags:res.data.bags,
                  bag_c:bag_c,
                  is_activity:is_activity
              })
          }else{
              var bag_c = res.data.bags[that.data.bag_k]
              that.setData({
                  id:id,
                  puid:puid,
                  info:res.data.info,
                  total:res.data.total,
                  bags:res.data.bags,
                  bag_c:bag_c
              })
          }
        }
      }
    })

    if(id == 3){
        //活动
        wx.getStorage({
            key: 'userinfo',
            success: function (user) {
                wx.request({
                    url: app.globalData.baseUrl + 'little/operate/checkDemoStatusDetail',
                    data: {
                        id:id,
                        puid:puid,
                        is_activity:is_activity,
                        uid:user.data.uid
                    },
                    success: function (res) {
                        that.setData({
                            is_activity:res.data.is_activity,
                            detailinfo:res.data.detailinfo,
                            member:res.data.member
                        })

                        //活动标示
                        if(res.data.is_activity == 1){
                            wx.request({
                                url: app.globalData.baseUrl + 'little/operate/productDetail',
                                data: {
                                    id: id
                                },
                                success: function(res) {
                                    if (res.data.result == 'succ') {
                                        var bag_c = res.data.bags[10]
                                        that.setData({
                                            info:res.data.info,
                                            total:res.data.total,
                                            bags:res.data.bags,
                                            bag_c:bag_c
                                        })
                                    }
                                }
                            })
                        }
                    }
                })
            }
        })
    }
  },

  /**
   * 体验课状态
   */
  onShow:function(){
      var that = this
      wx.getStorage({
          key: 'userinfo',
          success: function (user) {
              wx.request({
                  url: app.globalData.baseUrl + 'little/operate/checkDemoStatus',
                  data: {
                      uid:user.data.uid
                  },
                  success: function (res) {
                      that.setData({
                          uid:user.data.uid,
                          status:res.data.info,
                          userinfo:res.data.userinfo
                      })
                      if (that.data.id==1 && res.data.info==0) {
                          that.setData({
                              double:1
                          })
                      }
                  }
              })
          }
      })
  },

  /**
   * 下单
   */
  gotobuy: function(e) {

    if(this.data.uid == 0){
        wx.setStorage({
            key: 'gourl',
            data: '/pages/product/introduce?id='+this.data.id
        })

        wx.navigateTo({
            url: '/pages/my/login/login'
        })
    }else{
        if (this.data.info.sale>0) {
            var price = this.data.info.sale
        } else {
            var price = this.data.info.price
        }

        if (this.data.id==3) {
            if(this.data.is_activity == 1){
                var price = 9000
            }else{
                var price = this.data.bag_c['price']
            }
        }

        if (this.data.id == 6) {
            var is_gift = 1
        } else {
            var is_gift = 0
        }

        if (this.data.id == 1 && this.data.status==1) {
            //选择班级
            wx.navigateTo({
                url: '/pages/product/class?type=2&class_from=1'
            })
        } else {
            wx.navigateTo({
                url: '/pages/product/buy?price='+price+'&id='+this.data.id+'&is_gift='+is_gift+'&is_activity='+this.data.is_activity+'&activity_puid='+this.data.puid
            })
        }   
    }
  },

  //转发
  onShareAppMessage: function () {
      if(this.data.is_activity == 1){
          if(this.data.puid){
              var puid = this.data.puid
          }else{
              var puid = this.data.uid
          }
          return {
              title: this.data.info.name,
              path: '/pages/product/introduce?puid='+puid+'&id='+this.data.id+'&is_activity='+this.data.is_activity
          }
      }else{
          return {
              title: this.data.info.name,
              path: '/pages/product/introduce?puid='+this.data.uid+'&id='+this.data.id+'&is_activity='+this.data.is_activity
          }
      }
  },

  /**
   * 赠送
   */
  buyGift: function() {

    if(this.data.uid == 0){
      this.setData({
          display:'block'
      })
      return false;
    }

    if (this.data.info.sale > 0) {
      var price = this.data.info.sale
    } else {
      var price = this.data.info.price
    }
    
    wx.navigateTo({
      url: '/pages/product/gift?price=' + price + '&id=' + this.data.id + '&name=' + this.data.info.name,
    })
  },

  gotoGene: function (e) {
      var id = e.target.dataset.id
      wx.navigateTo({
        url: '/pages/my/generalize/card?type=2&act_id='+id,
      })
  },

/**
 * 免费领取
 */
  forFree: function () {
    wx.navigateTo({
      url: '/pages/product/introduce?id=6',
    })
  },

  //切换课程包
  chooseBag: function(e) {
    var bag_k = e.target.dataset.bag
    this.setData({
      bag_k : bag_k,
      bag_c : this.data.bags[bag_k]
    })
  },

    //页面渲染完成后调用
    onReady: function () {
       var that = this;
        wx.request({
            url: app.globalData.baseUrl + 'little/operate/getActivityexpiretime',
            data: {
                id: 3
            },
            success: function(res) {

                var expiretime = res.data.expiretime;

                var totalSecond = expiretime - Date.parse(new Date())/1000;

                var interval = setInterval(function () {
                    // 秒数
                    var second = totalSecond;

                    // 天数位
                    var day = Math.floor(second / 3600 / 24);
                    var dayStr = day.toString();
                    if (dayStr.length == 1) dayStr = '0' + dayStr;

                    // 小时位
                    var hr = Math.floor((second - day * 3600 * 24) / 3600);
                    var hrStr = hr.toString();
                    if (hrStr.length == 1) hrStr = '0' + hrStr;

                    // 分钟位
                    var min = Math.floor((second - day * 3600 *24 - hr * 3600) / 60);
                    var minStr = min.toString();
                    if (minStr.length == 1) minStr = '0' + minStr;

                    // 秒位
                    var sec = second - day * 3600 * 24 - hr * 3600 - min*60;
                    var secStr = sec.toString();
                    if (secStr.length == 1) secStr = '0' + secStr;

                    that.setData({
                        countDownDay: dayStr,
                        countDownHour: hrStr,
                        countDownMinute: minStr,
                        countDownSecond: secStr,
                    });
                    totalSecond--;
                    if (totalSecond < 0) {
                        clearInterval(interval);
                        that.setData({
                            countDownDay: '00',
                            countDownHour: '00',
                            countDownMinute: '00',
                            countDownSecond: '00',
                        });
                    }
                }.bind(this), 1000);
            }
        })
    },

    //活动规则
    show:function(e){
        wx.navigateTo({
            url: '/pages/product/rule'
        })
    }
})