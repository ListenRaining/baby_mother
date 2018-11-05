//提交成功页
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        rootRelativePath: '../../',
        status:1,  //1:待审核  2:审核通过  3:审核不通过
        comment:'' //失败原因
    },


  onLoad: function (options) {

    var that = this
    var queryBean = JSON.parse(options.queryBean);
    that.setData({
      queryBean: queryBean
    })
  
    // show = that.data.queryBean
    console.log(that.data.queryBean)
  },


    // onLoad: function (options) {
    //     console.log('options',options);
    //     if(options.status){
    //         this.setData({
    //             status: options.status
    //         })
    //     }

    //     //失败原因
    //     if(options.comment){
    //         this.setData({
    //             comment: options.comment
    //         })
    //     }
    // },

    //重新编辑
    toedit: function () {
        wx.redirectTo({
            url: '/pages/teamwork/teamwork'
        })
    },
})