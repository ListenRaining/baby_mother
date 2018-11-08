//活动详情
var app = getApp()

Page({

    data: {
        act_id: 0,         //活动id
        quan:0,            //是否显示优惠码
        is_generalize: 0,  //0:待审核  1:已审核  2:宝妈或推广员  3:未提交、已删除
        is_cityname: '',   //待审核、需要某个城市运营中心审核
        price:0,           //如果有扫二维码进来的价格,显示传过来的价格
        channel_id:0,      //扫二维码进来的渠道id
        info:[],
        uid:0
    },

    onLoad: function (options) {

        var that = this;

        if (options.puid) {
            wx.setStorage({
                key: 'puid',
                data: options.puid
            })
        }

        //如果有扫二维码进来的价格,显示传过来的价格
        if (options.price > 0) {
            that.setData({
                price: options.price
            })
        }

        if(options.channel_id > 0){
            that.setData({
                channel_id:options.channel_id
            })

            //统计渠道扫码数
            wx.request({
                url: app.globalData.baseUrl + 'little/index/statisticsCode',
                data: {
                    channel_id: options.channel_id
                },
                success: function (res) {}
            })
        }

        //优惠券0元活动
        if (options.scene) {
            var scene = decodeURIComponent(options.scene)
            var arrinfo = scene.split(',');

            that.setData({
                act_id: arrinfo[0],
                quan: arrinfo[1],
            })

            //邀请人入缓存
            if (arrinfo[2]) {
                wx.setStorage({
                    key: 'puid',
                    data: arrinfo[2],
                })
            }
        }

        if(options.act_id){
            that.setData({
                act_id:options.act_id
            })
        }

        wx.request({
            url: app.globalData.baseUrl + 'little/index/activityinfo',
            data: {
                act_id: that.data.act_id
            },
            success: function (res) {
                that.setData({
                    info: res.data.info,
                })

                //设置标题
                wx.setNavigationBarTitle({
                    title: res.data.info.name
                })

                //引入解析html类库
                var WxParse = require('../../../utils/wxParse/wxParse.js');
                WxParse.wxParse('contents', 'html', res.data.info.contents, that, 0);
            }
        })

        wx.getStorage({
            key: 'userinfo',
            success: function (user) {
                that.setData({
                    uid: user.data.uid
                })
            }
        })
    },

    //立即报名
    goBuy:function(e) {

        var that = this;

        //如果有扫二维码进来的价格,显示传过来的价格
        var url = '../order/order?act_id=' + that.data.act_id + '&quan=' + that.data.quan + '&price=';
        if (that.data.price > 0){
            url += that.data.price + '&channel_id=' + that.data.channel_id;
        }else{
            url += that.data.info.price + '&channel_id=0';
        }

        if(that.data.uid){
            wx.request({
                url: app.globalData.baseUrl + 'little/index/checkApply',
                data: {
                    act_id: that.data.act_id,
                    uid:that.data.uid
                },
                success: function (res) {
                    if (res.data.result == 'succ') {
                        wx.showModal({
                            title: res.data.info,
                            showCancel: false,
                        })
                        return false;
                    }else{
                        wx.navigateTo({
                            url: url
                        })
                    }
                }
            })
        }else{
            var url = '/pages/activity/order/order?act_id=' + that.data.act_id + '&quan=' + that.data.quan + '&price=';
            if (that.data.price > 0){
                url += that.data.price + '&channel_id=' + that.data.channel_id;
            }else{
                url += that.data.info.price + '&channel_id=0';
            }

            wx.setStorage({
                key: 'gourl',
                data: url
            })

            wx.navigateTo({
                url: '/pages/my/login/login?channel_id='+that.data.channel_id
            })
        }
    },

    //页面分享
    onShareAppMessage: function () {
        return {
            title: '菲蓓尔+：3-6岁儿童活动社交神器',
            path: '/pages/activity/activityinfo/activityinfo?puid='+this.data.uid+'&act_id='+this.data.act_id
        }
    },

    /**
     * 生成分享图
     */
    gotoGene: function (e) {

        var url = '/pages/my/generalize/card?type=1&act_id=' + e.target.dataset.id;

        if(this.data.uid){
            wx.navigateTo({
                url: url
            })
        }else{
            wx.setStorage({
                key: 'gourl',
                data: url
            })

            wx.navigateTo({
                url: '/pages/my/login/login?channel_id='+this.data.channel_id
            })
        }
    },

    //查看机构地址
    location: function (e) {
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
    }
})