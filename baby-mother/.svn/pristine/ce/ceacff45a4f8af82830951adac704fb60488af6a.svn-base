//活动报名成功页
Page({

    data: {
        rootRelativePath: '../../../', 
        out_trade_no:''
    },

    onLoad: function (options) {
        this.setData({
            out_trade_no:options.out_trade_no
        });
    },

    //订单详情
    toast: function(e){
        wx.redirectTo({
            url: '/pages/my/orderinfo/orderinfo?orderid='+this.data.out_trade_no
        })
    }
})