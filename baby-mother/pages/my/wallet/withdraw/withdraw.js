//提现页面
var app = getApp();

Page({

    /**
    * 页面的初始数据
    */
    data: {
        rootRelativePath: '../../../../',
        uid:0,
        unionid:'',
        userinfo:[],
        do_withdrawal:'',    //文本框的提现金额
        pay_taxes:0,         //个人所得税
        formula:'',          //个人所得税计算公式
        error_msg:'',        //温馨提示
        is_type:0            //1:全部提现  2:手动输入提现金额
    },

    onLoad: function (options){
        var that = this;
        wx.getStorage({
            key: 'userinfo',
            success: function(res) {
              //拼装验证参数
              var timestamp = app.createTimeStamp()
              var str = "uid=" + res.data.uid + '&timestamp=' + timestamp;
              var signature = app.createSignatureStr(str);
                wx.request({
                    url: app.globalData.baseUrl + 'little/operate/withdrawInfo',
                    data: {
                        uid:res.data.uid,
                        timestamp: timestamp,
                        signature: signature
                    },
                    success: function (res2) {
                        if(res2.data.result == 'succ'){
                            that.setData({
                                uid: res.data.uid,
                                unionid: res.data.unionId,
                                userinfo:res2.data.info
                            })
                        }else{
                            wx.showModal({
                                title: res2.data.reason,
                                showCancel: false,
                            })
                            return false;
                        }
                    }
                })
            },
        })
    },

    /**
     * 全部提现
     */
    allDo:function(e) {
      var do_withdrawal = e.currentTarget.dataset.balance;
      var pay_taxes = e.currentTarget.dataset.pay_taxes;
      do_withdrawal = (do_withdrawal > 0) ? do_withdrawal : 0;
        this.setData({
          do_withdrawal: do_withdrawal,               //全部提现--到账金额
          pay_taxes: pay_taxes,                       //个人所得税
          formula:e.currentTarget.dataset.formula,    //个人所得税计算公式
          is_type:1
        })
    },

    /**
     * 自行输入提现金额
     */
    mobileInputEvent: function (e) {

        var that = this

        if(e.detail.value == ''){
            that.setData({
                do_withdrawal:'',
                pay_taxes:'',
                error_msg:'',
                formula:'',
                is_type:2
            })
        }else{
            //自行输入的提现金额
            var input_withdrawal = parseInt(e.detail.value);

            if(input_withdrawal > that.data.userinfo.balance){
                that.setData({
                    do_withdrawal:input_withdrawal,
                    error_msg:'超出账户余额',
                    formula:'',
                    is_type:2
                })
            }else{
                wx.request({
                    url: app.globalData.baseUrl + 'little/operate/formula',
                    data: {
                        input_withdrawal:input_withdrawal
                    },
                    success: function (res2) {
                        if(res2.data.result == 'succ'){
                            that.setData({
                                do_withdrawal:input_withdrawal,
                                pay_taxes:res2.data.pay_taxes,
                                formula:res2.data.formula,
                                error_msg:'',
                                is_type:2
                            })
                        }else{
                            wx.showModal({
                                title: res2.data.reason,
                                showCancel: false,
                            })
                            that.setData({
                                do_withdrawal:input_withdrawal,
                                error_msg:'',
                                is_type:2
                            })
                        }
                    }
                })
            }
        }
    },

    /**
     * 提交提现
     */
    submit: function (_e) {

        var that = this;

        //输入的提现金额
        var money = _e.detail.value.money;
        //个人所得税
        var pay_taxes = _e.detail.value.pay_taxes;

        var errMsg = null;

        if (money == null || money.length == 0 || money == 0){
            errMsg = "请输入提现金额";
        }else if (money < 1){
            errMsg = "提现金额需大于1元";
        }else if (money > that.data.userinfo.balance){
            errMsg = "超出账户余额";
        }

        if(errMsg){
            wx.showModal({
                title: errMsg,
                showCancel: false,
            })
            return false;
        }else{

            if(money - pay_taxes > 20000){
                wx.showModal({
                    title: '提示',
                    content: '单笔单日限额2W，请分次提现',
                    showCancel: false,
                })
                return false;
            }

            var content = '扣除个人所得税'+pay_taxes+'元，您本次可以提现'+(money - pay_taxes)+'元，确认提取吗？';

            wx.showModal({
                title: '提示',
                content: content,
                success: function (res) {
                    if (res.confirm) {
                      //拼装验证参数
                      var timestamp = app.createTimeStamp()
                      var str = "uid=" + that.data.uid + '&unionid=' + that.data.unionid + '&amount=' + money + '&pay_taxes=' + pay_taxes +'&timestamp=' + timestamp;
                      var signature = app.createSignatureStr(str);
                        wx.request({
                            url: app.globalData.baseUrl + 'little/operate/dowithdraw',
                            data: {
                                uid: that.data.uid,
                                unionid: that.data.unionid,
                                amount: money,
                                pay_taxes: pay_taxes,
                                timestamp: timestamp,
                                signature: signature
                            },
                            success: function (_data) {
                                if (_data.data.result == "succ") {
                                    wx.redirectTo({
                                        url: that.data.rootRelativePath + "pages/my/wallet/result/result"
                                    })
                                } else {
                                    wx.showModal({
                                        title: _data.data.reason,
                                        showCancel: false,
                                    })
                                    return false;
                                }
                            }
                        });
                    }
                }
            })
        }
    }
})