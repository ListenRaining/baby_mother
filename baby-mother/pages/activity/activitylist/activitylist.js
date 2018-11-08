//活动列表
var app = getApp()

Page({

    data:{
      rootRelativePath:'../../../', 
      list:[],
      length:0,
      uid:0,
      topInfo:[] //推广活动信息
    },

    onLoad:function(options){
        //邀请人id入缓存
        if (options.puid) {
            wx.setStorage({
                key: 'puid',
                data: options.puid,
            })
        }
    },

    onShow:function(){

        var that = this

        //用户uid赋值
        wx.getStorage({
            key: 'userinfo',
            success: function (res) {
                that.setData({
                    uid:res.data.uid
                })
            }
        })

        wx.request({
            url: app.globalData.baseUrl + 'little/index/newactivitylist',
            data: {},
            success: function (res) {
              console.log(res)
                that.setData({
                    list: res.data.info,
                    length: res.data.info.length,
                    topInfo:res.data.topInfo
                })
            }
        })
    },

    //跳到活动详情页
    toast:function(e) {
        var act_id = e.currentTarget.id;
        wx.navigateTo({
            url: '/pages/activity/activityinfo/activityinfo?act_id='+act_id
        })
    },

    //活动推广
    topro: function (e) {
        var top_url = e.currentTarget.dataset.top_url;
        wx.navigateTo({
            url: top_url
        })
    },

    //页面分享
    onShareAppMessage: function () {
        if(this.data.uid){
            return {
                title: '菲蓓尔+：让人人懂音乐',
                path: '/pages/activity/activitylist/activitylist?puid='+this.data.uid
            }    
        }else{
            return {
                title: '菲蓓尔+：让人人懂音乐',
                path: '/pages/activity/activitylist/activitylist'
            }
        }
    }
})