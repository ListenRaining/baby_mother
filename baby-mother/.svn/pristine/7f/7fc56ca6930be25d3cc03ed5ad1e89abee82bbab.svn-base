//人脉
var app = getApp();

Page({

    /**
    * 页面的初始数据
    */
    data: {
        rootRelativePath: '../../../../',
        list:[],
        type:1,
        offline_uid:0
    },

    onLoad: function (options) {
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        console.log("当前时间戳为：" + timestamp);

        wx.setStorage({
            key: 'renmaitime',
            data: timestamp,
        })
    
        if(options.type){
            //查看一级关系的二级关系
            this.getList(options.type,options.uid);
        }else{
            //默认显示潜在人脉
            this.getList(this.data.type,0);
        }
    },
  
    //切换
    switchChoose:function(e) {
        var type = e.currentTarget.dataset.type;
        this.getList(type,0);
    },

    getList:function (type,offline_uid) {
        var that = this
        wx.getStorage({
            key: 'userinfo',
            success: function (res) {
                wx.request({
                    url: app.globalData.baseUrl + '/little/operate/getConnectionList',
                    data: {
                        uid:res.data.uid,
                        type:type,
                        offline_uid:offline_uid
                    },
                    success: function (result) {
                        that.setData({
                            list:result.data.info,
                            type:type,
                            offline_uid:offline_uid
                        });
                    },
                })
            },
        })
    },

    /**
     * 查看一级关系的二级关系
     */
    goOffline: function(e) {
        var uid = e.currentTarget.dataset.uid;
        wx.navigateTo({
            url: '/pages/my/contacts/contacts?type=4&uid='+uid
        })
    },

    /**
    * 下拉刷新
    */
    onPullDownRefresh: function () {
        var that = this
        wx.getStorage({
            key: 'userinfo',
            success: function (res) {
                wx.request({
                    url: app.globalData.baseUrl + '/little/operate/getConnectionList',
                    data: {
                        uid:res.data.uid,
                        type:that.data.type,
                        offline_uid:that.data.offline_uid
                    },
                    success: function (result) {
                        that.setData({
                            list:result.data.info
                        });
                    },
                })
            },
        })
    }
})