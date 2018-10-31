//购买成功页
var app = getApp()

Page({

  data: {
    rootRelativePath: '../../',
    is_gift:0,      //赠送订单标志
    pid:0,          //产品id
    is_activity:0   //活动标示
  },

  onLoad: function (options) {

    var is_gift = 0;
    if (options.is_gift == 1) {
        is_gift = 1;
    }

    var pid = 0;
    if(options.pid){
        pid = options.pid;
    }

    var from = 0;
    if (options.from) {
      from = options.from;
    }

    //活动标示
    var is_activity = 0;
    if (options.is_activity) {
        is_activity = options.is_activity;
    }

    this.setData({
        is_gift:is_gift,
        pid:pid,
        from:from,
        is_activity:is_activity
    })
  },

  //选择班级
  chooseClass: function () {
    if (this.data.pid==3 || this.data.pid == 1) {
      var url = '/pages/my/class/classlist'
    } else {
      var url = '/pages/my/orderlist/orderlist'
    }
    wx.redirectTo({
      url: url,
    })
  },

  /**
   * 赠送好友
   */
  tosend: function() {
    wx.redirectTo({
      url: '/pages/my/send/send',
    })
  },

  /**
   * 复制字段
   */
  copy: function(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.id,
    })
  },

  onUnload:function(e) {
    console.log('页面卸载')
    wx.switchTab({
      url: '/pages/find/index/index',
    })
  },

  onHide:function(){
    console.log('页面卸载')
    wx.switchTab({
      url: '/pages/find/index/index',
    })
  },

  toIndex:function() {
    wx.switchTab({
      url: '/pages/find/index/index',
    })
  }
  
})