//宝宝表现
var app = getApp()

Page({

  data: {
    item_url: app.globalData.baseUrl,
    info: [],              //学生信息
    lid: 0,
    sid: 0,
    star: [1, 2, 3, 4, 5], //图标
    lvdong: 1,             //律动表现
    jiezou: 1,             //节奏表现
    yueli: 1,              //乐理掌握
    xingge: 1,             //性格发育
    yuyan: 1,              //语言能力
    teacher_comment: '',   //讲师小结
    baby_say: '',          //童言童语
    lsid: 0,               //评价id
    ltimes: [],            //课程列表
    ids: [],               //课程列表对应的lesson id  
    confirm: 0,            //是否需要确认
  },

  onLoad: function (options) {
    var lid = options.lid;
    var sid = options.sid;
    var cid = options.cid;
    var confirm = options.confirm;
    var that = this;

    //获取评论过的课程列表
    wx.request({
      url: app.globalData.baseUrl + 'little/teacher/getCommentLesson',
      data: {
        lid: lid,
        cid: cid
      },
      success: function (res) {
        if (res.data.result == 'succ') {
          that.setData({
            ltimes: res.data.info.times,
            ids: res.data.info.ids,
            lindex: 0,
            confirm: confirm,
            lid:lid,
            sid:sid,
            cid:cid
          })
        }
      }
    })
    this.getComment(lid,sid);
  },

  /**
   * 切换课程
   */
  changeLesson: function (e) {
    var lid = this.data.ids[e.detail.value]
    this.setData({
        lindex:e.detail.value
    })
    this.getComment(lid, this.data.sid);
  },

  /**
   * 获取评价相关数据
   */
  getComment: function (lid,sid) {
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + 'little/teacher/getStudent',
      data: {
        lid: lid,
        sid: sid,
        show_flag: 1
      },
      success: function (res) {
        if (res.data.result == 'succ') {
          var comment = res.data.info.comment
            that.setData({
              tname: res.data.tinfo.tname,
              content_id: res.data.tinfo.content_id
            })
          if (comment.id) {
            if (comment.comment_time>0) {
              that.setData({
                lid: lid,
                sid: sid,
                ctime: comment.ctime_format,
                lvdong: comment.lvdong,
                jiezou: comment.jiezou,
                yueli: comment.yueli,
                xingge: comment.xingge,
                yuyan: comment.yuyan,
                teacher_comment: comment.teacher_comment,
                baby_say: comment.baby_say,
                lsid: comment.id,
                nocomment: 0
              })
            }else {
              that.setData({
                ctime: '',
                nocomment: 1//请假,没有评价
              })  
            }
          }else {
            that.setData({
              ctime: '',
              nocomment: 2//刚上完课,还未评价
            })
          }
        }
      }
    })
  },

  //确认上课
  comment:function(e){
    var lid = this.data.lid;
    var sid = this.data.sid;
    wx.redirectTo({
      url: '/pages/my/class/comment?student_id=' + sid + '&lesson_id=' + lid
    })
  },

  showAct:function(e) {
    var cid = e.target.dataset.cid
    wx.navigateTo({
      url: '/pages/find/PGC_details/PGC_details?id='+cid,
    })
  }
})