//下单页
var util = require('../../../utils/util.js')
var app = getApp()

Page({
    data:{
        rootRelativePath: '../../../',
        inputOrder:{},
        jdate:'',
        jtime:'',
        name:'',
        username: '',   //宝妈姓名
        gender: ['请选择宝宝性别', '男', '女'],
        genderIndex: 0,
        birthday: '请输入宝宝出生年月日',
        mobile:'',   //已绑定手机号
        mobiles:'',  //输入要绑定的手机号
        code:'',
        out_trade_no:'',
        second: 60,
        selected1:true,
        selected:false,
        mids:'', //宝宝id串
        institutionInfo:[],
        id:0,         //机构活动id
        act_id:0,     //总部活动id
        ins_name:'',  //机构名称
        uid:0,        //用户uid
        price:0,      //产品价格
        channel_id:0, //扫二维码进来的渠道id
        act_price:0,  //实际支付价格
        quan_price:0, //优惠金额
        money:0,      //优惠前的金额
        go_to_pay:0,
        pay_title:'支付',
        is_select_ins:0,    //总部活动是否勾选了机构参加 0:没有勾选  1:勾选了  没有勾选的话，则不显示选择机构这一行
        is_ins:0,           //是否已选择机构 0:未选择  1:已选择、包括未支付订单
        is_allow_child:0,   //是否允许带孩子参加:1-允许 2-不允许
        quan:0,             //是否显示优惠码
        quan_code:'',       //优惠码
        quan_info: null,    //优惠券信息
        is_showtime:0,      //是否显示场次时间
        banci_id:0          //一个活动、多个机构、不同场次的id
    },

    onLoad: function(options) {
        if(options.id && options.act_id){ //选择完机构后跳转回来
            this.setData({
                id:options.id,
                act_id:options.act_id,
                ins_name:options.ins_name,
                is_ins:1,
                price:options.price,
                act_price:options.act_price,
                money:options.act_price,
                banci_id:options.banci_id
            })
        }else if(options.act_id){  //新版本先选活动
            this.setData({
                act_id:options.act_id,
                quan:options.quan,
                price:options.price,
                act_price:options.price,
                money:options.price,
            })
        }else if(options.id){ //兼容老版本、机构活动id
            this.setData({
                id:options.id
            })
        }

      //如果有扫二维码进来的渠道,付值渠道id
      if (options.channel_id > 0) {
        this.setData({
          channel_id: options.channel_id
        })
      }
        
    },

    onShow: function () {

        var that = this;
        
        //未支付订单信息、用户信息、宝宝信息、活动信息
        wx.getStorage({
            key: 'userinfo',
            success: function (info) {
                if (info.data.uid) {
                  /**
                   * 加密
                   */
                  var timestamp = app.createTimeStamp();
                  var str = "uid=" + info.data.uid + "&id=" + that.data.id + "&timestamp=" + timestamp
                  var signature = app.createSignatureStr(str)
                    wx.request({
                        url: app.globalData.baseUrl + 'little/index/getSomeInfo',
                        data: {
                            uid: info.data.uid,
                            id: that.data.id,
                            timestamp: timestamp,
                            act_id: that.data.act_id,
                            signature: signature
                        },
                        success: function (res) {
                            if (res.data.is_pay_order == 1) { //有未支付订单
                                console.log('未支付订单信息',res.data);
                                that.setData({
                                    mobile: res.data.userinfo.mobile,
                                    username: res.data.userinfo.username,
                                    jianianhua_date: res.data.jianianhua_date,
                                    selected1:false,
                                    out_trade_no:res.data.orderinfo.out_trade_no,
                                    id:res.data.orderinfo.ins_act_id,
                                    act_id:res.data.orderinfo.act_id,
                                    ins_name:res.data.orderinfo.ins_name,
                                    institutionInfo: res.data.otherInfo,
                                    mids:res.data.otherInfo.mids,
                                    act_price:res.data.orderinfo.sale_price, //未支付订单里的支付金额
                                    money:res.data.orderinfo.sale_price,     //未支付订单里的支付金额
                                    uid:info.data.uid,
                                    is_ins:1,
                                    is_select_ins:res.data.otherInfo.is_select_ins,
                                    is_allow_child:res.data.otherInfo.is_allow_child
                                })
                            }else{
                                //选完机构后，恢复之前用户的操作行为
                                wx.getStorage({
                                    key: 'inputOrder',
                                    success: function (orderinfo) {
                                        console.log('恢复用户的操作行为',res.data);
                                        that.setData({
                                            name:orderinfo.data.name,
                                            genderIndex:orderinfo.data.genderIndex,
                                            birthday:orderinfo.data.birthday,
                                            mids:orderinfo.data.mids,
                                            mobile:orderinfo.data.mobile,
                                            mobiles:orderinfo.data.mobiles,
                                            code:orderinfo.data.code,
                                            institutionInfo: res.data.otherInfo,
                                            uid:info.data.uid,
                                            id:res.data.orderinfo.ins_act_id,
                                            act_id:res.data.orderinfo.act_id,
                                            is_select_ins:res.data.otherInfo.is_select_ins,
                                            is_allow_child:res.data.otherInfo.is_allow_child
                                        })
                                    },
                                    fail:function () {
                                        console.log('没有用户操作行为',res.data);
                                        that.setData({
                                            mobile: res.data.userinfo.mobile,
                                            username: res.data.userinfo.username,
                                            jianianhua_date: res.data.jianianhua_date,
                                            institutionInfo: res.data.otherInfo,
                                            mids:res.data.otherInfo.mids,
                                            uid:info.data.uid,
                                            id:res.data.orderinfo.ins_act_id,
                                            act_id:res.data.orderinfo.act_id,
                                            is_select_ins:res.data.otherInfo.is_select_ins,
                                            is_allow_child:res.data.otherInfo.is_allow_child
                                        })
                                    }
                                })
                            }
                        }
                    })
                }else{
                    wx.showModal({
                        title: '您未同意微信授权！',
                        showCancel: false,
                    })
                    return false;
                }
            }
        })
    },

    /**
     * 勾选宝宝
     */
    listenCheckboxChange: function (e) {
        console.log('勾选宝宝:',e.detail.value)
        var temp1 = e.detail.value
        var temp2 = ''

        if (temp1.length != 0) {
            for (var i = 0, len = temp1.length; i < len; i++) {
                if(temp2){
                    temp2 = temp2 + ',' + temp1[i]
                }else{
                    temp2 = temp2 + temp1[i]
                }
            }
            if(this.data.quan_price){
                this.setData({
                    mids: temp2,
                    act_price:this.data.price * temp1.length - parseFloat(this.data.quan_price),
                    money:this.data.price * temp1.length
                })
            }else{
                this.setData({
                    mids: temp2,
                    act_price:this.data.price * temp1.length,
                    money:this.data.price * temp1.length
                })
            }
        } else {
            this.setData({
                mids: ''
            })
        }
    },

    /**
     * 使用优惠券
     */
    useQuan: function(e) {
        console.log('优惠券勾选',e);
        var quan = e.detail.value
        if (quan[0] == 1) {
            this.setData({
                quan:1,
            })
        } else {
            this.setData({
                quan:0,
            })
        }
    },

    /**
     * 获取优惠码
     */
    getQuan: function(e) {
        console.log('输入优惠券',e)
        this.setData({
            quan_code:e.detail.value
        })
    },

    /**
     * 验证优惠码是否有效
     */
    checkQuan: function(e) {
        var quan_code = e.currentTarget.dataset.quan_code
        if(quan_code == ''){
            wx.showModal({
                title: '请输入优惠码！',
                showCancel: false,
            })
            return false;
        }
        var that = this
        /**
         * 加密
         */
        var timestamp = app.createTimeStamp();
        var str = "product_id=" + that.data.act_id + "&quan=" + quan_code + "&timestamp=" + timestamp
        var signature = app.createSignatureStr(str)
        wx.request({
            url: app.globalData.baseUrl + 'little/index/checkquan',
            data: {
                product_id:that.data.act_id,
                quan:quan_code,
                timestamp: timestamp,
                type:1,
                signature: signature
            },
            success: function(res) {
                console.log('验证优惠码',res)

                var act_price = 0;

                //券是有效的
                if (res.data.result == 'succ') {

                    if(that.data.mids) {
                        var midArr = that.data.mids.split(",");
                        act_price = that.data.price * (midArr.length);
                    }else{
                        act_price = that.data.price;
                    }

                    that.setData({
                        act_price: act_price - parseFloat(res.data.info.price),
                        quan_info: res.data.info,
                        quan_price: res.data.info.price,
                        money:act_price
                    })
                } else { //券是无效的

                    if(that.data.mids) {
                        var midArr = that.data.mids.split(",");
                        act_price = that.data.price * (midArr.length);
                    }else{
                        act_price = that.data.price
                    }

                    that.setData({
                        act_price: act_price,
                        quan_info: '',
                        quan_price: 0,
                        money:0
                    })

                    wx.showModal({
                        title: '提示',
                        content: res.data.reason,
                        showCancel: false,
                    })
                }
            }
        })
    },

    //选择场次-日期
    selectJdate:function (e) {

        var that = this;

        var jdate = e.target.dataset.jdate;

        wx.request({
            url: app.globalData.baseUrl + 'little/index/checkSession',
            data: {
                jdate:jdate
            },
            success: function (res) {
                that.setData({
                    jianianhua_time:res.data.jianianhua_time,
                    jdate: jdate,
                    is_showtime:1,
                    jtime:''
                })
            }
        })
    },

    //选择场次-时间
    selectJtime:function (e) {
        var jtime = e.target.dataset.jtime;
        this.setData({
            is_showtime: 1,
            jtime: jtime
        })
    },

    //表单提交
    formSubmit: function(e) {
        if (e.detail.value.babyinfo== 0 && e.detail.value.name == '' && this.data.is_allow_child==1) {
            wx.showModal({
                title: '您还没有填写宝宝姓名',
                showCancel: false,
            })
            return false;
        }
        if (e.detail.value.babyinfo == 0 && e.detail.value.gender == 0 && this.data.is_allow_child==1) {
            wx.showModal({
                title: '您还没有选择宝宝性别',
                showCancel: false,
            })
            return false;
        }
        if (e.detail.value.babyinfo == 0 && (e.detail.value.birthday == 0 || e.detail.value.birthday == '请输入宝宝出生年月日') && this.data.is_allow_child==1) {
            wx.showModal({
                title: '您还没有选择宝宝出生年月日',
                showCancel: false,
            })
            return false;
        }

        if (e.detail.value.babyinfo == 1 && this.data.mids == '' && this.data.is_allow_child==1) {
            wx.showModal({
                title: '您还没有选择参加活动的宝宝',
                showCancel: false,
            })
            return false;
        }
        if (e.detail.value.mobile == '') {
            wx.showModal({
                title: '您还没有填写手机号',
                showCancel: false,
            })
            return false;
        }

        if(this.data.id == 0 && this.data.is_select_ins == 1){
            wx.showModal({
                title: '请先选择机构',
                showCancel: false,
            })
            return false;
        }

        if(this.data.act_id == 19 && (this.data.jdate == '' || this.data.jtime == '' || this.data.jdate == 'undefined' || this.data.jtime == 'undefined')){
            wx.showModal({
                title: '请先选择参与场次',
                showCancel: false,
            })
            return false;
        }

        //手机号格式检测
        var regMobile = /^1\d{10}$/;
        if(!regMobile.test(e.detail.value.mobile)){
            wx.showModal({
                title: '手机号格式不正确！',
                showCancel: false,
            })
            return false;
        }

        //获取邀请人id
        var invite_uid = 0;
        wx.getStorage({
            key: 'puid',
            success: function (puid) {
                invite_uid = puid.data
            }
        })

        var that = this;

        var quan_id = that.data.quan_info ? that.data.quan_info.id : 0;

        /**
         * 加密
         */
        var timestamp = app.createTimeStamp();
        var str = "uid=" + that.data.uid + "&mobile=" + e.detail.value.mobile + "&timestamp=" + timestamp
        var signature = app.createSignatureStr(str)
        //订单提交
        wx.request({
            url: app.globalData.baseUrl + 'little/index/userApply',
            data: {
                uid:that.data.uid,
                mobile: e.detail.value.mobile,
                timestamp: timestamp,                
                ins_act_id: that.data.id,
                act_id: that.data.act_id,
                mids: that.data.mids,
                out_trade_no: that.data.out_trade_no,
                name: e.detail.value.name,
                gender: e.detail.value.gender,
                birthday: e.detail.value.birthday,
                code: e.detail.value.code,
                babyinfo: e.detail.value.babyinfo,
                invite_uid:invite_uid,
                is_allow_child:that.data.is_allow_child,
                ins_act_price:that.data.act_price,
                quan_id: quan_id,
                signature: signature,
                banci_id:that.data.banci_id,
                jdate:that.data.jdate,
                jtime:that.data.jtime,
                channel_id: that.data.channel_id
            },
            success: function (res) {

                if (res.data.result == 'succ') {

                    //提交订单后，删除用户的操作行为
                    wx.removeStorage({
                        key: 'inputOrder',
                    })

                    that.setData({
                        go_to_pay:1,
                        pay_title:'订单处理中...'
                    })

                    if(that.data.act_price > 0){
                        that.setpay(that.data.act_price,res.data.info.out_trade_no);
                    }else{
                        wx.redirectTo({
                            url: '../success/success?out_trade_no='+res.data.info.out_trade_no+'&act_id='+res.data.info.act_id+'&code='+res.data.code
                        })
                    }
                } else {
                    
                    wx.showModal({
                        title: '提示',
                        content: res.data.reason,
                        showCancel: false,
                    })
                    return false;
                }
            }
        })
    },

    //调起支付
    setpay:function(price,out_trade_no){
        var price = parseInt(price*100);
        if(price <= 0){
            return false;
        }

        var that = this;
        //缓存获取用户信息
        wx.getStorage({
            key: 'userinfo',
            success: function (info) {
                that.wxpay(info.data.openId,price,out_trade_no,info.data.uid);
            }
        })
    },

    //商户server调用支付统
    wxpay: function (openId,price,out_trade_no,uid) {
        var that = this;
        //拼装参数串用以生成签名
        var appid = 'wx1707b532f7440c4e'; //微信分配的小程序ID
        var mch_id = '1227780702'; //微信支付分配的商户号
        var nonce_str = that.randomString(32); //随机字符串，不长于32位。
        var body = 'fable'; //商品描述
        var total_fee = price; //总金额(单位:分)
        var spbill_create_ip = '118.190.87.0'; //终端IP
        var notify_url = 'https://act.fableedu.com/api/Operate/getPayActivity'; //通知地址
        var trade_type = "JSAPI"; //交易类型
        var openid = openId;  //用户微信openid
        var key = '0ExkGk2OgMTqauWZI0havyp4zxzaKYXy'; //秘钥

        var unifiedPayment = 'appid=' + appid + '&body=' + body + '&mch_id=' + mch_id + '&nonce_str=' + nonce_str + '&notify_url=' + notify_url + '&openid=' + openid + '&out_trade_no=' + out_trade_no + '&spbill_create_ip=' + spbill_create_ip + '&total_fee=' + total_fee + '&trade_type=' + trade_type + '&key=' + key

        //引入md5加密js类
        var MD5Util = require(that.data.rootRelativePath+ 'utils/md5.js');
        var sign = MD5Util.MD5(unifiedPayment).toUpperCase();

        //封装统一支付xml参数
        var formData = "<xml>"
        formData += "<appid>" + appid + "</appid>"
        formData += "<mch_id>" + mch_id + "</mch_id>"
        formData += "<nonce_str>" + nonce_str + "</nonce_str>"
        formData += "<body>" + body + "</body>"
        formData += "<out_trade_no>" + out_trade_no + "</out_trade_no>"
        formData += "<total_fee>" + total_fee + "</total_fee>"
        formData += "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>"
        formData += "<notify_url>" + notify_url + "</notify_url>"
        formData += "<trade_type>" + trade_type + "</trade_type>"
        formData += "<openid>" + openid + "</openid>"
        formData += "<sign>" + sign + "</sign>"
        formData += "</xml>"

        //统一支付
        wx.request({
            url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
            method: 'POST',
            head: 'application/x-www-form-urlencoded',
            data: formData, // 设置请求的 header
            success: function (res) {
                console.log('prepay_id:',res)
                var prepay_id = res.data.match(/<prepay_id><!\[CDATA\[(\S*)]]><\/prepay_id>/);
                var prepay_id = prepay_id[1];
                that.wxsign(prepay_id,out_trade_no)
                return false;
            },
        })
    },

    //商户server调用再次签名，然后调起微信支付
    wxsign:function (prepay_id,out_trade_no) {
        var that = this;
        var appId = 'wx1707b532f7440c4e'; //微信分配的小程序ID
        var timeStamp = that.createTimeStamp();
        var nonceStr = that.randomString(32);
        var prepay_id =  prepay_id;
        var signType = 'MD5';
        var key = '0ExkGk2OgMTqauWZI0havyp4zxzaKYXy';

        //引入md5加密js类
        var MD5Util = require(that.data.rootRelativePath + 'utils/md5.js');

        var unifiedPayment = 'appId=' + appId + '&nonceStr=' + nonceStr + '&package=prepay_id=' + prepay_id + '&signType=' + signType + '&timeStamp=' + timeStamp + '&key=' + key;
        var sign = MD5Util.MD5(unifiedPayment).toUpperCase();
        var package_str = 'prepay_id='+prepay_id;

        wx.requestPayment({
            'timeStamp': timeStamp,
            'nonceStr': nonceStr,
            'signType': signType,
            'paySign': sign,
            'package': package_str,
            'success':function(res){
                //支付成功,删除邀请人id
                wx.removeStorage({
                    key: 'puid',
                })

                wx.redirectTo({
                    url: '../success/success?out_trade_no='+out_trade_no
                })
            },
            'fail':function(res){
                console.log(res);
            }
        })
    },

    //去添加宝宝
    goAddBaby:function(){
        var that= this;
        wx.navigateTo({
            url: that.data.rootRelativePath+'pages/my/my/babyinfo',
        })
    },

    //发送验证码
    getphone: function (e) {
        var that = this
        var mobiles = this.data.mobiles
        var regMobile = /^1\d{10}$/;
        if (!regMobile.test(mobiles)) {
            wx.showModal({
                title: '手机号格式不正确！',
                showCancel: false,
            })
            return false;
        }

        wx.getStorage({
            key: 'userinfo',
            success: function (info) {
                wx.request({
                    url: app.globalData.baseUrl + 'little/index/sendcode',
                    data: {
                        mobile: mobiles,
                        id: that.data.id,
                        openid: info.data.openId
                    },
                    success: function (res) {
                        if (res.data.result == 'fail') {
                            wx.showModal({
                                title: res.data.reason,
                                showCancel: false,
                            })
                            return false;
                        } else {
                            wx.showToast({
                                title: '验证码已发送'
                            })
                            that.setData({
                                selected1: false,
                                selected: true
                            });
                            countdown(that);
                        }
                    }
                })
            }
        })
    },

    //去选择机构
    selectIns:function () {

        var inputOrder = this.data.inputOrder;
        inputOrder["name"] = this.data.name;
        inputOrder["genderIndex"] = this.data.genderIndex;
        inputOrder["birthday"] = this.data.birthday;
        inputOrder["mids"] = this.data.mids;
        inputOrder["mobile"] = this.data.mobile;
        inputOrder["mobiles"] = this.data.mobiles;
        inputOrder["code"] = this.data.code;

        //将此页面的用户操作行为记录下来
        wx.setStorage({
            key: 'inputOrder',
            data: inputOrder,
        })

        wx.redirectTo({
            url: '/pages/activity/inslist/inslist?act_id='+this.data.act_id+'&source=huodong'+'&price='+this.data.price+'&act_price='+this.data.money
        })
    },

    bindGenderChange: function (e) {
        this.setData({
            genderIndex: e.detail.value
        })
    },
    bindBirthdayChange: function (e) {
        var that = this;
        if(that.data.act_id == 19){
            wx.request({
                url: app.globalData.baseUrl + 'little/index/checkBirthday',
                data: {
                    birthday: e.detail.value
                },
                success: function (res) {
                    if (res.data.result == 'fail') {
                        wx.showModal({
                            title: '提示',
                            content: res.data.reason,
                            showCancel: false,
                        })
                        return false;
                    } else {
                        that.setData({
                            birthday: e.detail.value
                        })
                    }
                }
            })
        }else{
            that.setData({
                birthday: e.detail.value
            })
        }
    },
    mobileInputEvent: function (e) {
        this.setData({
            mobiles: e.detail.value
        })
    },
    nameInputEvent: function (e) {
        this.setData({
            name: e.detail.value
        })
    },
    codeInputEvent:function (e) {
        this.setData({
            code: e.detail.value
        })
    },

    // 时间戳产生函数
    createTimeStamp: function() {
        return parseInt(new Date().getTime() / 1000) + ''
    },

    createDate:function () {
        var d = new Date();
        return d.getFullYear()+""+((d.getMonth()+1)<10?"0":"")+(d.getMonth()+1)+""+(d.getDate()<10?"0":"")+d.getDate();
    },

    /* 随机数 */
    randomString: function (randcount) {
        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = chars.length;
        var pwd = '';
        for (var i = 0; i < randcount; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },
})

//60秒倒计时
function countdown(that) {
    var second = that.data.second;
    if (second == 0) {
        that.setData({
            selected1:true,
            selected:false,
            second: 60,
        });
        return;
    }
    var time = setTimeout(function () {
            that.setData({
                second: second - 1
            });
            countdown(that);
        }
        , 1000)
}