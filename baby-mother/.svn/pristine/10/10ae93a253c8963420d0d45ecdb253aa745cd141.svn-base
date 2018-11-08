//赠送/领取页
var app = getApp();

Page({

    data: {
        item_url:app.globalData.baseUrl,
        oid:0,        //赠送的订单id
        send:0,       //0:赠送  1:领取
        info:[],      //订单信息
        is_login:0,   //是否已登录

        isShow:false,
        share_id:0,
        share_type:0,
        share_name:'',
        share_image:''
    },

    onLoad: function (options) {

        console.log('领取/赠送页面',options);

        var that = this;

        //用于赠送给平台用户
        if(options.send == 0){
            that.setData({
                share_id:options.share_id,
                share_type:options.share_type,
                share_name:options.share_name,
                share_image:options.share_image,
            })
        }

        wx.getStorage({
            key: 'userinfo',
            success: function (user) {
                wx.request({
                    url: app.globalData.baseUrl + 'little/operate/orderinfo',
                    data: {
                        id:options.oid,
                        send:options.send,
                        uid:user.data.uid
                    },
                    success: function(res) {
                        if (res.data.result == 'succ') {
                            that.setData({
                                oid:options.oid,
                                send:options.send,
                                info:res.data.info,
                                is_login:1
                            })
                        }
                    }
                })
            },
            fail:function () {
                wx.request({
                    url: app.globalData.baseUrl + 'little/operate/orderinfo',
                    data: {
                        id:options.oid,
                        send:options.send
                    },
                    success: function(res) {
                        if (res.data.result == 'succ') {
                            that.setData({
                                oid:options.oid,
                                send:options.send,
                                info:res.data.info
                            })
                        }
                    }
                })
            }
        })
    },

    //分享给微信好友
    onShareAppMessage: function (res) {

        //隐藏弹层
        this.setData({
            isShow: false
        })

        return {
            title: this.data.info.nickname+'赠送给您一份礼物',
            path: '/pages/my/send/send_detail?oid='+this.data.oid+'&send=1'
        }
    },

    //分享给平台用户
    goUserList:function(){

        //隐藏弹层
        this.setData({
            isShow: false
        })

        wx.navigateTo({
            url: '/pages/my/business/userList?share_type='+this.data.share_type+'&share_id='+this.data.share_id
        })
    },

    /**
     * 领取礼物(已登录)
     */
    doRecive: function() {
        var url = '/pages/product/buy?is_gift=1&price='+this.data.info.sale+'&id='+this.data.info.id+'&from=1'+'&gift_uid='+this.data.info.uid;
        wx.redirectTo({
            url: url
        })
    },

    /**
    * 领取礼物(未登录，需授权)
    */
    getuser: function(e) {
        if(e.detail.encryptedData){
            wx.setStorage({
                key: 'gourl',
                data: '/pages/my/send/send_detail?oid='+this.data.oid+'&send=1'
            })

            app.getUserInfoNew(e.detail.encryptedData,e.detail.iv);
        }
    },

    //显示弹层
    doShare:function(e){
        this.setData({
            isShow:true
        })
    },

    //隐藏弹层
    doClose:function(){
        this.setData({
            isShow: false
        })
    },
})