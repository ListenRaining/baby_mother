//家长评价老师
var app = getApp()

Page({

  data: {
      star: [1, 2, 3, 4, 5],   //图标
      zonghe: 5,               //语言能力
      student_id:0,            //学生id
      lesson_id:0              //课程id
  },

  onLoad: function (options) {
      this.setData({
          student_id: options.student_id,
          lesson_id: options.lesson_id
      })
  },

  /**
   * 综合评价
   */
  support: function (e) {
      var key = e.currentTarget.dataset.key
      this.setData({
          zonghe: key
      })
  },

  //表单提交
  formSubmit: function(e) {
      var that = this;
      wx.request({
          url: app.globalData.baseUrl + 'little/index/parentsEvaluation',
          data: {
              student_id:that.data.student_id,
              lesson_id:that.data.lesson_id,
              belate: e.detail.value.belate,
              vivid: e.detail.value.vivid,
              homework: e.detail.value.homework,
              communicate: e.detail.value.communicate,
              parent_comment:e.detail.value.parent_comment,
              evaluate:that.data.zonghe
          },
          success: function (result) {
              if(result.data.result == 'succ'){
                  wx.showModal({
                      title: '提示',
                      content:'评价成功！',
                      showCancel: false,
                      success: function(res) {
                          if (res.confirm) {
                              wx.redirectTo({
                                  url: '/pages/my/class/classinfo?class_id='+result.data.class_id
                              })
                          }
                      }
                  })
              }else{
                  wx.showModal({
                      title: '提示',
                      content:res.data.reason,
                      showCancel: false
                  })
              }
          }
      })
  }
})