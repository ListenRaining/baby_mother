//产品下单页
var app = getApp()

Page({

  data: {
    rootRelativePath: '../../',

    id: 0,         //产品id
    price: 0,      //产品价格
    uid: 0,        //用户id

    name: '',
    username: '',   //宝妈姓名
    idcard:'',      //身份证号
    gender: ['请选择宝宝性别', '男', '女'],
    genderIndex: 0,
    birthday: '请输入宝宝出生年月日',

    mobiles:'',  //输入要绑定的手机号
    mobile:'',   //已绑定手机号
    email:'',    //邮箱
    code: '',
    second: 60,
    selected1: true,
    selected: false,

    babyinfo: 0,
    member: [],
    memberlist: [],
    showbaby: 0,        //显示宝宝类型

    city : [],
    citykey : [],
    city_index : 0,
    selectCity:0,     //选择的城市

    showbutton: false, //隐藏支付按钮
    agreeval : 0,      //是否勾选用户协议
    is_activity:0,     //活动标志
    activity_puid:0    //活动邀请人uid
  },

  onLoad: function (e) {

    var that = this;

    //赠送产品
    var is_gift = 0;
    if (e.is_gift == 1) {
      is_gift = 1;

      //设置导航标题
      wx.setNavigationBarTitle({
          title: '报名信息'
      })
    }

    //来源为点对点礼品卡
    var from = 0;
    if (e.from == 1) { 
        from = 1;
    }

    //活动标示
    var is_activity = 0;
    if (e.is_activity) {
        is_activity = e.is_activity;
    }

    //活动邀请人uid
    var activity_puid = 0;
    if (e.activity_puid) {
        activity_puid = e.activity_puid;
    }

    //赠送人uid
    var gift_uid = 0;
    if(e.gift_uid){
        gift_uid = e.gift_uid;
    }

    that.setData({
      id: e.id,               //产品id
      price: e.price,         //价格
      is_gift: is_gift,       //0:正常购买  1:领取赠送产品
      gift_uid:gift_uid,      //赠送人
      from:from,              //来源为点对点礼品卡
      is_activity:is_activity,
      activity_puid:activity_puid
    })

    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        wx.request({
          url: app.globalData.baseUrl + 'little/operate/getmemberlist',
          data: {
            uid: res.data.uid,
            id: e.id
          },
          success: function (e) {
            that.setData({
              uid: res.data.uid,
              memberlist: e.data.memberList,
              member: e.data.member,
              showbaby: e.data.showbaby,
              username: e.data.info.username,
              idcard: e.data.info.idcard,
              city:e.data.city,
              citykey: e.data.citykey,
              city_cn: e.data.info.city_cn,
              selectCity: e.data.info.cityid,
              mobile:e.data.info.mobile,
              email:e.data.info.email
            })

            //有宝宝信息
            if (e.data.showbaby == 1) {
              that.setData({
                babyinfo: e.data.member.mid
              })
            }
          }
        })
      },
    })
  },

  //获取邀请人信息
  onShow: function(){
    var that = this
    wx.getStorage({
      key: 'puid',
      success: function (res) {
        //记录邀请关系
        that.setData({
          puid: res.data,
        })
      },
    })
  },

  //298、9800元产品表单提交
  formSubmit: function (e) {

    var that = this;

    //9800也需要勾选协议
    if(that.data.id == 3 && that.data.agreeval == 0) {
        wx.showModal({
            title: '请确认您已阅读并同意《菲蓓尔魔法乐理用户协议》',
            showCancel: false,
        })
        return false;
    }

    if (that.data.showbaby == 0 && e.detail.value.name == '') {
      wx.showModal({
        title: '您还没有填写宝宝姓名',
        showCancel: false,
      })
      return false;
    }

    if (that.data.showbaby == 0 && e.detail.value.gender == 0) {
      wx.showModal({
        title: '您还没有选择宝宝性别',
        showCancel: false,
      })
      return false;
    }

    if (that.data.showbaby == 0 && (e.detail.value.birthday == 0 || e.detail.value.birthday == '请输入宝宝出生年月日')) {
      wx.showModal({
        title: '您还没有选择宝宝出生年月日',
        showCancel: false,
      })
      return false;
    }

    if (that.data.showbaby == 2 && e.detail.value.babyinfo == 0) {
      wx.showModal({
        title: '您还没有选择上课的宝宝',
        showCancel: false,
      })
      return false;
    }

    if (e.detail.value.username == '') {
        wx.showModal({
            title: '您还没有填写宝妈姓名',
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

    if (that.data.selectCity == 0) {
      wx.showModal({
        title: '请选择所在城市',
        showCancel: false,
      })
      return false;
    }

    var timestamp = app.createTimeStamp();
    var str = "uid=" + that.data.uid + "&mobile=" + e.detail.value.mobile + "&timestamp=" + timestamp
    var signature = app.createSignatureStr(str)
    
    //保存个人信息
    wx.request({
      url: app.globalData.baseUrl + 'little/operate/setUserInformation',
      data: {
        uid: that.data.uid,
        mobile: e.detail.value.mobile,
        timestamp: timestamp,
        signature: signature,
        username: e.detail.value.username,
        mid: e.detail.value.babyinfo,
        code: e.detail.value.code,
        name: e.detail.value.name,
        gender: e.detail.value.gender,
        birthday: e.detail.value.birthday,
        showbaby: that.data.showbaby,
        city_index: that.data.selectCity,
        is_gift: that.data.is_gift,
        from: that.data.from,
        pid: that.data.id,
        gift_uid:that.data.gift_uid
      },
      success: function (res) {
        if (res.data.result == 'succ') {
          if (that.data.is_gift == 1) { //赠送产品领取成功
            wx.redirectTo({
              url: '/pages/product/success?is_gift=1&from='+that.data.from+'&pid='+that.data.id
            })
            return false;
          }

          //支付按钮置灰
          that.setData({
              showbutton: true
          })

          //去支付
          that.toPay(parseFloat(that.data.price));

        } else {
          wx.showModal({
              title: '提示',
              content: res.data.reason,
              showCancel:false,
          })
        }
      }
    })
  },

  /**
   * 立即支付
   */
  toPay: function (price) {
    var that = this;
    //如果金额大于0，则调取支付，否则走免费订单
    if (price > 0) {
        wx.getStorage({
            key: 'userinfo',
            success: function (user) {
                //加密
                var timestamp = app.createTimeStamp();
                var str = "product_id=" + that.data.id + "&uid=" + user.data.uid + "&timestamp=" + timestamp;
                var signature = app.createSignatureStr(str);
                wx.request({
                    url: app.globalData.baseUrl + 'little/operate/buyorder',
                    data: {
                        product_id: that.data.id,
                        uid: user.data.uid,
                        timestamp: timestamp,
                        signature: signature,
                        price: price,
                        invite: that.data.invite,   //邀请人手机号
                        is_activity:that.data.is_activity,
                        activity_puid:that.data.activity_puid
                    },
                    success: function (res) {
                        if (res.data.result == 'succ' && price>0) {
                            that.setpay(price, res.data.info)
                        } else {
                            wx.showModal({
                                title: '提示',
                                content: res.data.reason,
                                showCancel: false,
                                success:function(){
                                    that.setData({
                                        showbutton:false
                                    })
                                }
                            })
                            return false;
                        }
                    }
                })
            }
        })
    }
  },

  //调起支付
  setpay: function (price, orderid) {
    var price = parseInt(price * 100);
    if (price <= 0) {
      return false;
    }
    var that = this;
    //缓存获取用户信息
    wx.getStorage({
      key: 'userinfo',
      success: function (info) {
        that.wxpay(info.data.openId, price, orderid, info.data.uid);
      }
    })
  },

  //商户server调用支付统
  wxpay: function (openId, price, orderid, uid) {
    var that = this;
    //拼装参数串用以生成签名
    var appid = 'wx1707b532f7440c4e'; //微信分配的小程序ID
    var mch_id = '1227780702'; //微信支付分配的商户号
    var nonce_str = that.randomString(32); //随机字符串，不长于32位。
    var body = 'fable'; //商品描述
    var total_fee = price; //总金额(单位:分)
    var spbill_create_ip = '118.190.87.0'; //终端IP
    var notify_url = 'https://act.fableedu.com/api/Operate/getPayRes'; //通知地址
    var trade_type = "JSAPI"; //交易类型
    var openid = openId;  //用户微信openid
    var key = '0ExkGk2OgMTqauWZI0havyp4zxzaKYXy'; //秘钥

    var unifiedPayment = 'appid=' + appid + '&body=' + body + '&mch_id=' + mch_id + '&nonce_str=' + nonce_str + '&notify_url=' + notify_url + '&openid=' + openid + '&out_trade_no=' + orderid + '&spbill_create_ip=' + spbill_create_ip + '&total_fee=' + total_fee + '&trade_type=' + trade_type + '&key=' + key

    //引入md5加密js类
    var MD5Util = require(that.data.rootRelativePath + 'utils/md5.js');
    var sign = MD5Util.MD5(unifiedPayment).toUpperCase();

    //封装统一支付xml参数
    var formData = "<xml>"
    formData += "<appid>" + appid + "</appid>"
    formData += "<mch_id>" + mch_id + "</mch_id>"
    formData += "<nonce_str>" + nonce_str + "</nonce_str>"
    formData += "<body>" + body + "</body>"
    formData += "<out_trade_no>" + orderid + "</out_trade_no>"
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
        var prepay_id = res.data.match(/<prepay_id><!\[CDATA\[(\S*)]]><\/prepay_id>/);
        var prepay_id = prepay_id[1];
        that.wxsign(prepay_id, orderid, uid)
        return false;
      },
    })
  },

  //商户server调用再次签名，然后调起微信支付
  wxsign: function (prepay_id, orderid, uid) {
    var that = this;
    var appId = 'wx1707b532f7440c4e'; //微信分配的小程序ID
    var timeStamp = that.createTimeStamp();
    var nonceStr = that.randomString(32);
    var prepay_id = prepay_id;
    var signType = 'MD5';
    var key = '0ExkGk2OgMTqauWZI0havyp4zxzaKYXy';

    //引入md5加密js类
    var MD5Util = require(that.data.rootRelativePath + 'utils/md5.js');

    var unifiedPayment = 'appId=' + appId + '&nonceStr=' + nonceStr + '&package=prepay_id=' + prepay_id + '&signType=' + signType + '&timeStamp=' + timeStamp + '&key=' + key;
    var sign = MD5Util.MD5(unifiedPayment).toUpperCase();
    var package_str = 'prepay_id=' + prepay_id;
    wx.requestPayment({
      'timeStamp': timeStamp,
      'nonceStr': nonceStr,
      'signType': signType,
      'paySign': sign,
      'package': package_str,
      'success': function (res) {

        //支付成功,删除邀请人id
        wx.removeStorage({
          key: 'puid'
        })

        wx.redirectTo({
          url: '/pages/product/success?is_gift=0&pid='+that.data.id+'&is_activity='+that.data.is_activity
        })
      }
    })
  },

  /**
   * 选择上课宝宝 
   */
  listenCheckboxChange: function (e) {
      this.setData({
          babyinfo: e.detail.value
      })
  },

  /**
   * 会员服务协议
   */
  gotoAgree: function (e) {
    wx.navigateTo({
      url: '/pages/product/agree?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * CA授权书
   */
  gotoCA: function (e) {
    wx.navigateTo({
      url: '/pages/product/ca',
    })
  },

  bindGenderChange: function (e) {
    this.setData({
      genderIndex: e.detail.value
    })
  },
  bindBirthdayChange: function (e) {
    this.setData({
      birthday: e.detail.value
    })
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
  codeInputEvent: function (e) {
    this.setData({
      code: e.detail.value
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

  // 时间戳产生函数
  createTimeStamp: function () {
    return parseInt(new Date().getTime() / 1000) + ''
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

  /**
   * 切换城市
   */ 
  changeCity: function(e) {
    console.log(e)
    var that = this
    that.setData({
      city_index:e.detail.value,
      selectCity:that.data.citykey[e.detail.value]
    })
  },

  /**
   * 提交美乐合伙人
   */
  meiyue: function (e) {
    var that = this;

    var username = e.detail.value.username;
    username = username.replace(/\s+/g, "");
    var reg = /^[\u4E00-\u9FA5]{2,4}$/;
    if (!reg.test(username)) {
      wx.showModal({
        title: '请填写真实姓名',
        showCancel: false,
      })
      return false;
    }

    var idcard = e.detail.value.idcard;
    idcard = idcard.replace(/\s+/g, "");
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!reg.test(idcard)) {
      wx.showModal({
        title: '请填写正确的身份证号',
        showCancel: false,
      })
      return false;
    }

    var mobile = e.detail.value.mobile;
    if (mobile == '') {
      wx.showModal({
        title: '您还没有填写手机号',
        showCancel: false,
      })
      return false;
    }

    var email = e.detail.value.email;
    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); 
    if (!reg.test(email)) {
      wx.showModal({
        title: '请填写正确的邮箱地址',
        showCancel: false,
      })
      return false;
    }

    if (that.data.selectCity == 0) {
      wx.showModal({
        title: '请选择所在城市',
        showCancel: false,
      })
      return false;
    }

    if (e.detail.value.invite == '') {
      wx.showModal({
        title: '您还没有填写邀请人手机号',
        showCancel: false,
      })
      return false;
    }

    if (that.data.agreeval == 0) {
      wx.showModal({
        title: '请确认您已同意合作协议和CA证书授权协议',
        showCancel: false,
      })
      return false;
    }

    //邀请人手机号
    if (e.detail.value.invite) {
      that.setData({
        invite: e.detail.value.invite
      })
    }

    //支付按钮置灰
    that.setData({
        showbutton: true
    })

    //保存用户提交的信息
    wx.request({
        url: app.globalData.baseUrl + 'little/operate/setInformationNew',
        data: {
            uid: that.data.uid,
            mobile: mobile,
            code: e.detail.value.code,
            username: username,
            idcard: idcard,
            email: email,
            city_index: that.data.selectCity,
        },
        success: function (res) {
            if (res.data.result == 'fail') {
                wx.showModal({
                    title: '提示',
                    content: res.data.reason,
                    showCancel: false,
                })
                //支付按钮置灰
                that.setData({
                  showbutton: false
                })
            }else{
              //支付
              that.toPay(parseFloat(that.data.price))
            }
        }
    })
  },

  /**
 * 同意协议
 */
  agreexy: function (e) {
    var that = this
    var val = (that.data.agreeval == 0) ? 1 : 0
    that.setData({
      agreeval : val
    })
  }
})


//60秒倒计时
function countdown(that) {
  var second = that.data.second;
  if (second == 0) {
    that.setData({
      selected1: true,
      selected: false,
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