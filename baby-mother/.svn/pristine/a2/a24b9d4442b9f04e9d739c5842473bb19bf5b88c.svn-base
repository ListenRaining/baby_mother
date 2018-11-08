//经营管理
var app = getApp();
var chartTools = require('../../../utils/chartTools.js');

Page({

    data: {
        baseurl: app.globalData.baseUrl,
        rootRelativePath: '../../../',
        userinfo:[],   //用户信息
        seeds:[],      //种子库
        isShow:false,
        statis_type:1,
        uid:0,

        //要分享的活动/产品相关信息
        share_id:0,
        share_type:0,
        share_name:'',
        share_image:'',
    },

    onShow: function () {
        var that = this;
        wx.getStorage({
            key: 'userinfo',
            success: function (info) {
                var timestamp = app.createTimeStamp();
                var str = "uid=" + info.data.uid + "&timestamp=" + timestamp;
                var signature = app.createSignatureStr(str);
                wx.request({
                    url: app.globalData.baseUrl + 'little/index/getBusiness',
                    data: {
                        uid: info.data.uid,
                        timestamp: timestamp,
                        signature: signature
                    },
                    success: function (res) {
                        console.log('经营管理',res);
                        that.setData({
                            uid:info.data.uid,
                            userinfo:res.data.userinfo,
                            seeds:res.data.seeds
                        })
                    }
                })

                wx.request({
                    url: app.globalData.baseUrl + 'little/index/getBusinessStatis',
                    data: {
                        uid: info.data.uid,
                    },
                    success: function (result) {
                        console.log('数据统计',result);
                        that.statis(result.data.date,[result.data.newUser,result.data.intentionUser,result.data.onelevelUser,result.data.twolevelUser]);
                    }
                })
            }
        })
    },

    //数据统计--7天 30天 半年切换
    doTab:function(e){
        var that = this;
        if(that.data.statis_type != e.currentTarget.id){
            that.setData({
                statis_type:e.currentTarget.id
            })

            wx.request({
                url: app.globalData.baseUrl + 'little/index/getBusinessStatis',
                data: {
                    uid:that.data.uid,
                    type:e.currentTarget.id
                },
                success: function (result) {
                    console.log('数据统计',result);
                    that.statis(result.data.date,[result.data.newUser,result.data.intentionUser,result.data.onelevelUser,result.data.twolevelUser]);
                }
            })
        }
    },

    //加载图表
    statis:function (index_time,dataArr) {
        var titleArr =['新用户','意向用户','一级会员','二级会员'];
        chartTools.lineCharts('0', 'echarts-indexs', index_time, dataArr, titleArr);
    },

    //显示弹层
    doShare:function(e){
        this.setData({
            isShow:true,
            share_id: e.currentTarget.dataset.share_id,
            share_type: e.currentTarget.dataset.share_type,
            share_name: e.currentTarget.dataset.share_name,
            share_image: e.currentTarget.dataset.share_image
        })
    },

    //隐藏弹层
    doClose:function(){
        this.setData({
            isShow: false
        })
    },

    //分享给微信好友
    onShareAppMessage: function (res) {

        //隐藏弹层
        this.setData({
            isShow: false
        })

        if(this.data.share_type == 1){ //产品
            if(this.data.share_id == 1){ //声音的游戏
                var url = '/pages/product/buy?is_gift=1&price=0&id=1&from=1&gift_uid='+this.data.uid
            }else{
                var url = '/pages/product/introduce?id='+this.data.share_id;
            }
        }else{
            //活动
            var url = '/pages/activity/activityinfo/activityinfo?act_id='+this.data.share_id;
        }

        return {
            title: this.data.share_name,
            path: url,
            imageUrl:this.data.share_image
        }
    },

    //分享给平台用户
    goUserList:function(){
        //弹层消失
        this.setData({ isShow:
            false
        })

        wx.navigateTo({
            url: './userList?share_type='+this.data.share_type+'&share_id='+this.data.share_id
        })
    },

    //用户管理
    toUserList:function(){
        wx.navigateTo({
            url: './userList'
        })
    },

    //成长收益
    goEarning:function(){
        wx.navigateTo({
            url: './earnings'
        })
    },

    //显示ToolTip
    touchHandler: function (e) {
        var index = e.target.dataset.id
        chartTools.touchCharts(e,index);
    }
})