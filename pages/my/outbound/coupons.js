//个人信息
var app = getApp();

Page({

    data: {
        rootRelativePath: '../../../../',
        info:[],
        coupons:''
    },

    //查询
    formSubmit:function(e){
        var that= this;
        if (e.detail.value.coupons == ''){
            wx.showModal({
                title: '提示',
                content:'请输入券号！',
                showCancel: false,
            })
            return false;
        }

        var timestamp = app.createTimeStamp()
        var str = "coupons=" + e.detail.value.coupons + '&timestamp=' + timestamp;
        var signature = app.createSignatureStr(str);
        wx.request({
            url: app.globalData.baseUrl + 'little/operate/checkCoupons',
            data:{
                coupons:e.detail.value.coupons,
                timestamp: timestamp,
                signature: signature
            },
            success:function(result){
                if(result.data.result == 'succ'){
                    that.setData({
                        info:result.data.info,
                        coupons:e.detail.value.coupons
                    })
                }else{
                    wx.showModal({
                        title: '提示',
                        content:result.data.reason,
                        showCancel: false
                    })
                    return false;
                }
            }
        })
    },

    //验证
    destruction:function(e){
        var that= this;
        if (that.data.coupons == ''){
            wx.showModal({
                title: '提示',
                content:'请输入券号！',
                showCancel: false
            })
            return false;
        }

        var timestamp = app.createTimeStamp();
        var str = "coupons=" + that.data.coupons + '&timestamp=' + timestamp;
        var signature = app.createSignatureStr(str);
        wx.request({
            url: app.globalData.baseUrl + 'little/operate/destructionCoupon',
            data:{
                coupons:that.data.coupons,
                timestamp: timestamp,
                signature: signature
            },
            success:function(result){
                if(result.data.result == 'succ'){
                    that.setData({
                        info:result.data.info,
                    })

                    if(result.data.reason){
                        wx.showModal({
                            title: '提示',
                            content:result.data.reason,
                            showCancel: false
                        })
                        return false;
                    }
                }else{
                    wx.showModal({
                        title: '提示',
                        content:result.data.reason,
                        showCancel: false,
                    })
                    return false;
                }
            }
        })
    }
})