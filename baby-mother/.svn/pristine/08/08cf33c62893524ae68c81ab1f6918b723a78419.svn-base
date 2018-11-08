//家长确认补课时间
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
                  class_id:class_id,
                  lesson_id:lesson_id,
                  student_id:student_id,
                  info:res.data.info,
                  lessonStudent:res.data.lessonStudent
              })
          }
      })
  },

  //表单提交
  formSubmit: function(e) {

    var that = this

    /**
    * 加密
    */
    var timestamp = app.createTimeStamp();
    var str = "student_id=" + that.data.student_id + "&lesson_id=" + that.data.lesson_id + "&timestamp=" + timestamp
    var signature = app.createSignatureStr(str)
      
    wx.request({
        url: app.globalData.baseUrl + 'little/index/confirmRepair',
        data: {
            student_id:that.data.student_id,
            lesson_id:that.data.lesson_id,
            timestamp:timestamp,
            signature:signature
        },
        success: function (res) {
            if (res.data.result == 'succ') {
                wx.showModal({
                    title: res.data.info,
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