//当前城市没有开放教室页
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      rootRelativePath: '../../../', 
      gender:['请选择宝宝性别','男','女'],
      genderIndex:0,
      age:['请选择宝宝年龄','1岁','2岁','3岁','4岁','5岁','6岁'],
      ageIndex:0,
      cityname:'',
      sexColor:"#807c79",
      ageColor:"#807c79",
      disBtn:0,
      uid:0,
      is_post:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
          cityname:options.cityname
      });
  },

  onShow : function(){

    var that = this

    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
          wx.request({
              url: app.globalData.baseUrl + 'little/index/getNoopenInfo',
              data: {
                  uid: res.data.uid,
              },
              success: function (res2) {
                  that.setData({
                      uid: res.data.uid,
                      is_post: res2.data.info,
                  })
              }
          })
      }
    })
  },

  bindGenderChange:function(e){
      // this.setData({
      //     genderIndex: e.detail.value
      // })

      var newColor;
      if (e.detail.value != 0) {
        newColor = "black";
      }
      else {
        newColor = "#807c79";
      }
      this.setData({
        sexColor: newColor,
        genderIndex: e.detail.value,
      })
  },
  bindAgeChange:function(e){

    var newColor;
    if (e.detail.value != 0) {
      newColor = "black";
    }
    else {
      newColor = "#807c79";
    }

      this.setData({
        ageColor: newColor,
          ageIndex: e.detail.value
      })
  },

    //表单提交
    formSubmit: function(e) {

        var that = this

        //信息都为必填项
        if(e.detail.value.baby_name.length==0 || e.detail.value.baby_gender.length==0 || e.detail.value.baby_age.length==0 || e.detail.value.mobile.length==0){
            wx.showToast({
                title: '信息填写不完整'
            })
            return false;
        }

        //手机号格式检测
        var regMobile = /^1\d{10}$/;
        if(!regMobile.test(e.detail.value.mobile)){
            wx.showToast({
                title:'手机号格式不正确！'
            })
            return false;
        }

        wx.request({
            url: app.globalData.baseUrl+'little/index/noopen',
            data:{
                baby_name:e.detail.value.baby_name,
                baby_gender:e.detail.value.baby_gender,
                baby_age:e.detail.value.baby_age,
                mobile:e.detail.value.mobile,
                cityname:e.detail.value.cityname,
                uid:that.data.uid
            },
            method:'post',
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            success:function(res){
                if(res.data.result == 'succ'){
                    that.setData({
                        is_post:1
                    })
                }else{
                    wx.showToast({
                        title:res.data.reason
                    })
                    return false;
                }
            }
        })
    },
})