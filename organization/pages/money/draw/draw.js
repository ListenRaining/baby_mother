//提现页面
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:[],      //机构用户信息
    insInfo:[],   //机构信息
    disable:1,
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      var that = this
      wx.getStorage({
          key: 'userinfo',
          success: function (res) {
              console.log('userinfo',res)
              wx.request({
                  url: app.globalData.baseUrl + 'little/institution/getInsInfo',
                  data: {
                      manager_id: res.data.manager_id
                  },
                  success: function (_res) {
                      console.log(_res)
                      if (_res.data.result == 'succ') {
                          that.setData({
                              info:_res.data.info,
                              insInfo:_res.data.insInfo
                          })
                      }else{
                          console.log(_res)
                      }
                  }
              })
          },
      })
  },

  /**
   * 提现
   */
  applyDraw:function() {
    var money = this.data.money
    var title = "确定提现" + money + "元吗？";
    wx.showModal({
      title: title,
      success:function(conf) {
        if (conf.confirm == true) {
          wx.getStorage({
            key: 'userinfo',
            success: function (res) {
              wx.request({
                url: app.globalData.baseUrl + 'little/institution/applyDraw',
                data: {
                  ins_id: res.data.ins_id,
                  money: money
                },
                success: function (_res) {
                  if (_res.data.result == 'succ') {
                    wx.showToast({
                      title: '申请成功',
                      icon: 'success',
                      mask: false,
                    })
                    that.setData({
                      disable: 1
                    })
                  }
                }
              })
            },
          })
        }
      }
    })
  },
})