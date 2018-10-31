//协议
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0
  },

  onLoad: function(e) {

      if(e.id == 3){
          wx.setNavigationBarTitle({
              title: '菲蓓尔魔法乐理用户协议'
          })
      }else{
          wx.setNavigationBarTitle({
              title: '菲蓓尔会员服务协议'
          })
      }

      this.setData({
          id:e.id
      })
  }
})