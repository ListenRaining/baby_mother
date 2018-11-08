//赠送产品购买页
var app = getApp()

Page({

  data: {
    rootRelativePath: '../../',
    uid:0,            //用户id
    product_id:0,     //产品id
    count: 1,        //购买数量
    price: 0,         //产品价格
    total_price:0,    //产品总价
    name:'',          //产品名称
  },

  onLoad: function (options) {
    var that = this
    that.setData({
      product_id: options.id,
      price: options.price,
      total_price: options.price * this.data.count + '.00',
      name:options.name
    })
    wx.getStorage({
      key: 'userinfo',
      success: function(res) {
        console.log(res)
        that.setData({
          uid:res.data.uid
        })
      }
    })
  },

  /**
   * 购买数量
   */
  changeCount: function(e) {
    console.log(e)
    var count = parseInt(e.detail.value) ? parseInt(e.detail.value) : 0
    var total_price = parseInt(e.detail.value) ? parseFloat(this.data.price * count) + '.00' : '0.00'
    this.setData({
      count:count,
      total_price: total_price,
    })
  },

  /**
   * 减一
   */
  countdesc: function(e) {
    var count = this.data.count-1
    if (count <= 1) {
      count = 1
    } 
    this.setData({
      count: count,
      total_price: parseFloat(this.data.price * count) + '.00'
    })
  },

/**
 * 加一
 */
  countasc: function(e) {
    var count = this.data.count + 1
    this.setData({
      count: count,
      total_price: parseFloat(this.data.price * count) + '.00'
    })
  },

  /**
   * 支付
   */
  pay: function() {
    //直接支付
    var total = this.data.price * this.data.count;
    console.log(total)
    //var total = 0.1
    this.toPay(parseFloat(total))
  },

  /**
     * 立即支付
     */
  toPay: function (price) {

    var that = this

    //获取邀请人id
    var invite_uid = 0;
    wx.getStorage({
      key: 'puid',
      success: function (puid) {
        invite_uid = puid.data
      }
    })

    wx.request({
      url: app.globalData.baseUrl + 'little/operate/giftorder',
      data: {
        product_id: that.data.product_id,
        uid: that.data.uid,
        price: price,
      },
      success: function (res) {
        if (res.data.result == 'succ') {
          that.setpay(price, res.data.info)
        } else {
          wx.showModal({
            title: '提示',
            content: '支付失败',
            showCancel: false,
          })
          return false;
        }
      }
    })

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
        console.log('支付成功', res)
        //支付成功
        wx.request({
          url: app.globalData.baseUrl + 'little/operate/giftsucc',
          data: {
            orderid: orderid,
            uid: uid,
          },
          success: function (e) {
            wx.navigateTo({
              url: '/pages/product/success?gift=1',
            })
          }
        })
      },
      'fail': function (res) {
        console.log('支付失败', res);
      }
    })
  },

  /**
   * 会员服务协议
   */
  gotoAgree: function () {
    wx.navigateTo({
      url: '/pages/product/agree',
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
})