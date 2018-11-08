//推广业务介绍
var app = getApp()

Page({

  data: {
      uid:0,            //用户id
      is_generalize:3,  //0:待审核  1:已审核  2:宝妈或推广员  3:未提交、已删除
      is_cityname:''
  },

  onLoad: function (options) {

      if (options.puid) {
          wx.setStorage({
              key: 'puid',
              data: options.puid,
          })
      }
  },

  /**
   * 获取用户信息
   */
  onShow:function(){
      var that = this
      wx.getStorage({
          key: 'userinfo',
          success: function (user) {
              wx.request({
                  url: app.globalData.baseUrl + 'little/operate/checkGeneralize',
                  data: {
                      uid:user.data.uid
                  },
                  success: function (res) {
                      that.setData({
                          uid:user.data.uid,
                          is_generalize:res.data.is_generalize,
                          is_cityname:res.data.is_cityname
                      })
                  }
              })
          }
      })
  },

  gotoGene: function () {
    if(this.data.is_generalize == 0){ //待审核
        wx.navigateTo({
            url: '/pages/my/generalize/success?cityname='+this.data.is_cityname
        })
    }else if(this.data.is_generalize == 1 || this.data.is_generalize == 2){ //已审核、宝妈或推广员
        wx.navigateTo({
            url: '/pages/my/generalize/prolist',
        })
    }else{
        wx.navigateTo({
            url: '/pages/my/generalize/generalize'
        })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      var url = '/pages/my/generalize/introduce?puid='+this.data.uid;
      return {
          title: '推广员计划',
          path: url
      }
  }
})