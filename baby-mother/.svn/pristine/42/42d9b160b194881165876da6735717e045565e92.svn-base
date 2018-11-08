//选择班级
var app = getApp()

var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
// 实例化API核心类
var demo = new QQMapWX({
  key: 'A4XBZ-DVL3U-ALDVE-2W7NF-2GZNZ-K6BTC' // 必填
});

Page({

    data: {
        uid: 0,
        list: null,       //数据列表
        class_id:'',      //选择的班级
        class_from:0,     //从哪个模块跳转过来选班级 0:购买产品过程中  1:班级列表 补选正课班级 2:调班级
        type:0,           //班级类型 1:正课  2:体验课
        price:0,          //支付的钱
        is_gift:0,        //1:领取赠送的产品  0:自行购买
        oid:'',           //订单自增id
        showbutton:true,  //显示确认班级按钮
        left_times:0,     //剩余转班次数
        c_info: '',       //选择的班级
        confirm:1,        //确认加入班级   1：确认；2：预约
        showkey:null
    },

    onLoad: function (options) {

        var that = this;

        //上过的最后一节课
        var lesson_id = 0;
        if (options.lesson_id) {
            lesson_id = options.lesson_id
        }

        //转班之前的班级
        var old_class = '';
        if (options.old_class) {
            old_class = options.old_class
        }

        //剩余的转班次数
        var left_times = 0;
        if (options.left_times) {
            left_times = options.left_times
        }

        //页面来源
        var class_from = 0;
        if(options.class_from){
            class_from = options.class_from
        }

        //配置课程类型
        if (options.type) {
            var type = options.type
        } else {
            var type = (options.price >= 0 && options.price < 1000) ? 2 : 1;
        }

        var is_gift = 0;
        if(options.is_gift){
            is_gift = options.is_gift
        }

        var oid = 0;
        if(options.oid){
            oid = options.oid
        }

        //配置支付金额
        that.setData({
            type:type,
            old_class:old_class,
            left_times:left_times,
            class_from:class_from,
            price:options.price,
            id:options.id,
            is_gift:is_gift,
            oid:oid
        })

        //定位
        wx.getLocation({
            success: function (res) {
                var lat = res.latitude;
                var lng = res.longitude;
                //定位城市信息
                demo.reverseGeocoder({
                    location: {
                        latitude: lat,
                        longitude: lng
                    },
                    success: function (res2) {

                        //城市中文
                        var citycn = res2.result.ad_info.city;
                        //var citycn = '徐州市';

                        wx.getStorage({
                            key: 'userinfo',
                            success: function (user) {
                                //拼装验证参数
                                var timestamp = app.createTimeStamp()
                                var str = "type=" + options.type + '&lat=' + lat + '&lng=' + lng + '&timestamp=' + timestamp;
                                var signature = app.createSignatureStr(str);
                                wx.request({
                                    url: app.globalData.baseUrl + 'little/operate/chooseClasslist',
                                    data: {
                                        type: options.type,
                                        lat: lat,
                                        lng: lng,
                                        timestamp: timestamp,
                                        signature: signature,
                                        citycn: citycn,
                                        lesson_id: lesson_id,
                                        old_class: that.data.old_class,
                                        class_from: class_from,
                                        uid:user.data.uid
                                    },
                                    success: function (data) {
                                        if (data.data.result == 'wrongcity') { //当前城市没有开放
                                            wx.navigateTo({
                                                url: '/pages/activity/noopen/noopen?cityname=' + data.data.reason
                                            })
                                        } else if (data.data.result == 'fail') {
                                            wx.showModal({
                                                title: data.data.reason,
                                                showCancel: false,
                                            })
                                            return false;
                                        } else if (data.data.result == 'succ') {
                                            that.setData({
                                                list: data.data.info
                                            })
                                        }
                                    }
                                })
                            }
                        })
                    }
                });
            }
        })
    },

    //勾选班级
    radioChange: function(res) {
        var class_info = res.detail.value.split('?');
        this.setData({
            class_id:class_info[0],
            c_info:class_info[1],
            confirm:class_info[2] == '已爆满' ? 2:1,
            stime:class_info[3],
            showbutton:false
        })
    },

    //取消按钮
    cancel: function() {
        this.setData({
            class_id:'',
            showbutton: true
        })
    },

    //提交
    toast: function (option) {
        var that = this
        //班级列表 补选正课班级
        if (this.data.class_from > 0) {
            var yuyue = option.detail.value.confirm == 2 ? 1 : 0    //是否为预约班级
            var join_str = yuyue == 1 ? '预约' : (that.data.class_from == 2 ? '转入' : '加入');
            var content = yuyue == 1 ? that.data.c_info + '\n当前班级已爆满，可能要在1-2周后上课，确定要' + join_str + '吗？' : that.data.c_info + '\n确定要' + join_str + '吗？';
            wx.showModal({
                title: '选择班级',
                content: content,
                success: function(e) {
                    if (e.confirm == true) {
                        wx.getStorage({
                            key: 'userinfo',
                            success: function (res) {
                                //拼装验证参数
                                var timestamp = app.createTimeStamp()
                                var str = "class_id=" + that.data.class_id + '&uid=' + res.data.uid + '&timestamp=' + timestamp;
                                var signature = app.createSignatureStr(str);
                                wx.request({
                                    url: app.globalData.baseUrl + '/little/index/selectClass',
                                    data: {
                                        class_id: that.data.class_id,
                                        uid: res.data.uid,
                                        timestamp: timestamp,
                                        class_from: that.data.class_from,
                                        stime: that.data.stime,
                                        signature: signature,
                                        yuyue : yuyue
                                    },
                                    success: function(a) {
                                        if (a.data.result == 'succ') {
                                            wx.showModal({
                                                title: '提示',
                                                content: join_str+'班级成功！',
                                                showCancel: false,
                                                success: function (res) {
                                                    if (res.confirm) {
                                                        wx.redirectTo({
                                                            url: '/pages/my/class/classinfo?class_id=' + that.data.class_id,
                                                        })
                                                    }
                                                }
                                            })
                                        } else {
                                            wx.showModal({
                                                title: a.data.reason,
                                                showCancel: false,
                                            })
                                            return false;
                                        }
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
    },

    /*查看位置*/
    location: function(e) {
        var lat = parseFloat(e.currentTarget.dataset.lat)
        var lng = parseFloat(e.currentTarget.dataset.lng)
        var name = e.currentTarget.dataset.name
        var address = e.currentTarget.dataset.address
        wx.openLocation({
            latitude: lat,
            longitude: lng,
            name: name,
            address: address,
        })
    },

    //显示班级列表
    showClass: function(e) {
        var key = e.currentTarget.dataset.key
        this.setData({
            showkey:key,
        })
    }
})