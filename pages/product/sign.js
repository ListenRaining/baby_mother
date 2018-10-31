//产品购买页
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rootRelativePath: '../../',
    name: '',
    username: '',   //宝妈姓名
    idcard: '',//身份证号
    gender: ['请选择宝宝性别', '男', '女'],
    genderIndex: 0,
    birthday: '请输入宝宝出生年月日',
    mobile: '',   //已绑定手机号
    email: '',//邮箱
    mobiles: '',  //输入要绑定的手机号
    code: '',
    second: 60,
    selected1: true,
    selected: false,
    babyinfo: 0,
    member: [],
    memberlist: [],
    showbaby: 0,        //显示宝宝类型
    id: 0,              //产品id
    price: 0,           //产品价格
    uid: 0,             //用户uid
    showbutton: false,  //隐藏支付按钮
    city: [],
    citykey: [],
    city_index: 0,
    agreeval: 0,
    selectCity: 0         //选择的城市
  },

  onLoad: function (e) {
    console.log('onLoad参数', e)
    var that = this

    wx.showLoading({
      title: '正在加载...',
      mask: true,
    })

    //赠送产品标志
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

    //赠送订单的自增id
    var oid = 0;
    if (e.oid) {
      oid = e.oid;
    }

    that.setData({
      
    })

    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        wx.request({
          url: app.globalData.baseUrl + 'little/operate/getSignInfo',
          data: {
            uid: res.data.uid,
            id: e.id
          },
          success: function (e) {

            if(e.data.order_id == ''){
              wx.showModal({
                title: '提示',
                content: '订单错误,请联系客服！',
                showCancel: false,
              })
              //支付按钮置灰
              that.setData({
                showbutton: true
              })
            }

            console.log(e);
            //隐藏loading
            wx.hideLoading();

            that.setData({
              uid: res.data.uid,
              username: e.data.info.username,
              idcard: e.data.info.idcard,
              city: e.data.city,
              citykey: e.data.citykey,
              city_cn: e.data.info.city_cn,
              selectCity: e.data.info.cityid,
              mobile: e.data.info.mobile,
              orderid: e.data.order_id,
              email: e.data.info.email
            })

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
  onShow: function () {
    
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
  changeCity: function (e) {
    console.log(e)
    var that = this
    that.setData({
      city_index: e.detail.value,
      selectCity: that.data.citykey[e.detail.value]
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

    wx.showLoading({
      title: '正在签订...',
      mask: true,
    })

    //保存用户提交的信息
    wx.request({
      url: app.globalData.baseUrl + 'little/operate/setInformation',
      data: {
        uid: that.data.uid,
        mobile: mobile,
        code: e.detail.value.code,
        username: username,
        idcard: idcard,
        email: email,
        city_index: that.data.selectCity,
        orderid: that.data.orderid
      },
      success: function (res) {
        wx.hideLoading();
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
        } else {
          wx.showModal({
            title: '提示',
            content: '签订成功',
            showCancel: false,
            success: function () {
              wx.navigateTo({
                url: '/pages/product/signsuccess',
              })
            }
          })
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
      agreeval: val
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