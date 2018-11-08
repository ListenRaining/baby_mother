//班级详情
var app = getApp()

Page({

    data: {
        starArr:[1,2,3],
        class_id:'',         //班级id
        info:[],             //班级详情
        studentinfo:[],      //学生详情
        monthClass:[],       //最近一个月课程
        accept:false,        //是否允许调班
    },

    onLoad: function (options) {
        this.setData({
            class_id:options.class_id
        })
    },

    onShow: function () {
        var that = this;
        wx.getStorage({
            key: 'userinfo',
            success: function (info) {
                //拼装验证参数
                var timestamp = app.createTimeStamp()
                var str = "uid=" + info.data.uid + '&class_id=' + that.data.class_id + '&timestamp=' + timestamp;
                var signature = app.createSignatureStr(str);
                wx.request({
                    url: app.globalData.baseUrl + 'little/index/classInformation',
                    data: {
                        uid:info.data.uid,
                        class_id:that.data.class_id,
                        timestamp: timestamp,
                        signature: signature
                    },
                    success: function (res) {
                        if (res.data.student_info.change_times == 2 || res.data.info.type == 2) {
                            that.setData({
                                accept:true, //可以调班
                                info: res.data.info,
                                studentinfo: res.data.student_info,
                                monthClass: res.data.monthClass
                            })
                        }else{
                            that.setData({
                                info: res.data.info,
                                studentinfo: res.data.student_info,
                                monthClass: res.data.monthClass
                            })   
                        }
                    }
                })
            }
        })
    },

    //查看机构地址
    location: function(e) {
        var lat = parseFloat(e.currentTarget.dataset.lat)
        var lng = parseFloat(e.currentTarget.dataset.lng)
        var name = e.currentTarget.dataset.name
        var address = e.currentTarget.dataset.address
        wx.openLocation({
            latitude: lat,
            longitude: lng,
            name: name,
            address: address
        })
    },

    //宝宝表现
    babyshow:function (e) {
        var student_id = e.currentTarget.dataset.student_id;
        var last_lessonid = e.currentTarget.dataset.lesson_id;
        var class_id = e.currentTarget.dataset.class_id;
        wx.navigateTo({
            url: '/pages/my/class/show?sid=' + student_id + '&lid=' + last_lessonid+'&cid='+class_id,
        })
    },

    //调换班级
    changeClass: function(e) {
        var that = this;
        wx.request({
            url: app.globalData.baseUrl + 'little/operate/checkBeforeChange',
            data: {
                sid:that.data.studentinfo.student_id
            },
            success: function(res) {
                if (res.data.result == 'succ') {
                    var time = 2 - parseFloat(e.detail.value.change_times)
                    wx.navigateTo({
                        url: '/pages/product/class?&old_class='+ that.data.class_id +'&left_times='+ time +'&type=1&class_from=2&lesson_id=' + e.detail.value.lesson_id,
                })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.data.reason,
                        showCancel:false
                    })
                }
            }
        })
    },

    //请假、点评
    handle:function (e) {
        var lesson_status = e.currentTarget.dataset.lesson_status;
        var student_id = e.currentTarget.dataset.student_id;
        var lesson_id = e.currentTarget.dataset.lesson_id;
        var class_id = e.currentTarget.dataset.class_id;

        if(lesson_status == 1 || lesson_status == 2){ //去请假、已请假
            wx.navigateTo({
                url: '/pages/my/class/leave?student_id='+student_id+'&lesson_id='+lesson_id+'&class_id='+class_id
            })
        }

        if(lesson_status == 3){ //家长确认补课时间
            wx.navigateTo({
                url: '/pages/my/class/repairlesson?student_id='+student_id+'&lesson_id='+lesson_id+'&class_id='+class_id
            })
        }
    
        if(lesson_status == 4){ //待补课/待老师评价
            wx.navigateTo({
                url: '/pages/my/class/repairlesson?student_id='+student_id+'&lesson_id='+lesson_id+'&class_id='+class_id
            })
        }
    
        if (lesson_status == 5) { //评价老师
            wx.navigateTo({
                url: '/pages/my/class/show?sid=' + student_id + '&lid=' + lesson_id + '&cid=' + class_id + '&confirm=1'
            })
        }
    },

    //体验课：调整上课时间--待完成
    changelessontime:function (e) {
        var student_id = e.currentTarget.dataset.student_id;
        var class_id = e.currentTarget.dataset.class_id;

        //拼装验证参数
        var timestamp = app.createTimeStamp()
        var str = "student_id=" + student_id + '&class_id=' + class_id + '&timestamp=' + timestamp;
        var signature = app.createSignatureStr(str);

        wx.request({
            url: app.globalData.baseUrl + 'little/operate/changeLessonTime',
            data: {
                student_id:student_id,
                class_id:class_id,
                timestamp: timestamp,
                signature: signature
            },
            success: function(res) {
                wx.showModal({
                    title: '选择班级',
                    content: content,
                    success: function (e) {
                        if (e.confirm == true) {

                        }
                    }
                })
            }
        })
    },

    //等待补课
    warning:function() {
        wx.showModal({
            title: '提示',
            content: '请耐心等待老师安排补课时间！',
            showCancel: false
        })
    },

    buke: function(e) {
        var student_id = e.currentTarget.dataset.student_id;
        var lesson_id = e.currentTarget.dataset.lesson_id;
        var class_id = e.currentTarget.dataset.class_id;
        wx.navigateTo({
            url: '/pages/my/class/repairlesson?student_id=' + student_id + '&lesson_id=' + lesson_id + '&class_id=' + class_id
        })
    }
})