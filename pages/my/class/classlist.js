//班级列表
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    item_url:app.globalData.baseUrl,
    list: [],
    length:0,           //是否有班级
    need_formal_class:0 //是否需要选择正课班级
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that = this
    wx.getStorage({
      key: 'userinfo',
      success: function(res) {
        //拼装验证参数
        var timestamp = app.createTimeStamp()
        var str = "uid=" + res.data.uid + '&timestamp=' + timestamp;
        var signature = app.createSignatureStr(str);
        wx.request({
          url: app.globalData.baseUrl + 'little/operate/myClass',
          data: {
            uid: res.data.uid,
            timestamp: timestamp,
            signature: signature
          },
          success: function(_res) {
            console.log('班级列表',_res)
            if (_res.data.result == 'succ') {
              that.setData({
                list:_res.data.info,
                length:_res.data.info.length,
                need_formal_class:_res.data.need_formal_class
              })
            }
          }
        })
      },
    })
  },

  //查看班级详情
  goclassinfo: function(e) {
    var class_id = e.currentTarget.dataset.class_id
    wx.navigateTo({
      url: '/pages/my/class/classinfo?class_id='+class_id
    })
  },

  //选择正课班级
    selectClass:function (e) {
      var type = e.currentTarget.dataset.type
      wx.navigateTo({
          url: '/pages/product/class?type='+type+'&class_from=1'
      })
  }
})