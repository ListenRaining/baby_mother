//请假页面
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:[],                //课程详情
    class_id:'',            //班级id
    lesson_id:0,            //课程id
    student_id:0,           //学生id
    is_allow:0,             //是否可以请假: 0-可以  1-不可以
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this
      var class_id   = options.class_id;   //班级id
      var lesson_id  = options.lesson_id;  //课程id
      var student_id = options.student_id; //学生id

      wx.request({
          url: app.globalData.baseUrl + 'little/index/getClassInfo',
          data: {
              lesson_id:lesson_id,
              student_id:student_id
          },
          success: function (res) {
              console.log('课程详情',res);
              that.setData({
                  info:res.data.info,
                  class_id:class_id,
                  lesson_id:lesson_id,
                  student_id:student_id,
                  lessonStudent:res.data.lessonStudent,
                  is_allow:res.data.is_allow
              })
              if(res.data.is_allow == 1){
                  wx.showModal({
                      title: '本次课程已开课，不可请假！',
                      showCancel: false
                  })
              }
          }
      })
  },

  //表单提交
  formSubmit: function(e) {
    if (e.detail.value.introduce == '') {
        wx.showModal({
            title: '请填写请假理由',
            showCancel: false,
        })
        return false;
    }

    var that = this
    wx.request({
        url: app.globalData.baseUrl + 'little/index/addIntroduce',
        data: {
            student_id:that.data.student_id,
            lesson_id:that.data.lesson_id,
            introduce:e.detail.value.introduce
        },
        success: function (res) {
            if (res.data.result == 'succ') {
                wx.showModal({
                    title: '请假成功！',
                    showCancel: false,
                    success: function (res) {
                        wx.redirectTo({
                            url: '/pages/my/class/classinfo?class_id='+that.data.class_id
                        })
                    }
                })
            }else{
                wx.showModal({
                    title: res.data.reason,
                    showCancel: false,
                })
                return false;
            }
        }
    })
  }
})