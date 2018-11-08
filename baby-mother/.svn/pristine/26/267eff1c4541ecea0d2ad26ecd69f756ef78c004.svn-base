//卡券
var app = getApp()

Page({

  data: {
    item_url:app.globalData.baseUrl,
    send:0,
    info:[],   //内容列表
    length:0   //内容数量
  },

  onLoad: function (options) {
    if (options.send) {
      this.setData({
        send:options.send
      })
    }
    this.getSchedule(this.data.send)
  },

  /**
   * 切换标签
   */
  switchChoose: function (option) {
    var send = option.currentTarget.dataset.id
    this.getSchedule(send)
  },

  /**
   * 获取数据列表
   */
  getSchedule: function(send) {
    var that = this
    wx.getStorage({
      key: 'userinfo',
      success: function(res) {
        //拼装验证参数
        var timestamp = app.createTimeStamp()
        var str = "uid=" + res.data.uid + "&send=" + send + '&timestamp=' + timestamp;
        var signature = app.createSignatureStr(str);

        wx.request({
          url: app.globalData.baseUrl + 'little/operate/getsendrecord',
          data:{
            uid:res.data.uid,
            send:send,
            timestamp:timestamp,
            signature:signature
          },
          success: function(_res) {
            if (_res.data.result == 'succ') {
              that.setData({
                send:send,
                info:_res.data.info,
                length:_res.data.length
              })
            }
          }
        })
      },
    })
  },

  /**
   * 去送好友
   */
  tosend: function(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/my/send/send_detail?oid='+id+'&recive='+this.data.send,
    })
  }
})