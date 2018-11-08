//机构申请--首页
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        wx.request({
          url: app.globalData.baseUrl + 'little/institution/checkApplyV10',
          data: {
            unionId: res.data.unionId,
          },
          success: function (result) {
            var status = result.data.info.status;
            if (status == "1") {
              //如果状态是1表示-等待初审
              wx.navigateTo({
                url: '/pages/teamwork/promptpages?types=submitapplications'
              })
            } else if (status == "2") {
              //如果状态是2表示-初审通过
              wx.navigateTo({
                url: '/pages/teamwork/promptpages?types=success'
              })
            } else if (status == "3") {
              //如果状态是3表示-初审不通过 
              wx.navigateTo({
                url: '/pages/teamwork/promptpages?types=failaudit&comment='+ result.data.info.comment
              })
            } else if (status == "4") {
              //如果状态是4表示-等外访签约合同
              wx.navigateTo({
                url: '/pages/teamwork/promptpages?types=signcontract'
              })
            }else{
              //个人信息
              if (result.data.info.username) {
                that.setData({
                  sign_personal: '1'
                })
              } else {
                that.setData({
                  sign_personal: '3'
                })
              }
              //机构信息
              if (result.data.info.ins_name && result.data.info.type != 0 && result.data.info.province != 0 && result.data.info.city != 0 && result.data.info.area != 0 && result.data.info.address && result.data.info.ins_high && result.data.info.ins_area && result.data.info.site_properties && result.data.info.leasehold && result.data.info.invoice_type >0 && result.data.info.operateyear && result.data.info.edu_num && result.data.info.agestr && result.data.info.students && result.data.info.classroom_num && result.data.info.room_floor && result.data.info.room_long && result.data.info.room_wide && result.data.info.ins_wall && result.data.info.network && result.data.info.broadband && result.data.info.idle_time) {
                that.setData({
                  sign_organization: '1'
                })
              } else if (result.data.info.ins_name || result.data.info.type != 0 || result.data.info.province != 0  ||  result.data.info.city != 0 || result.data.info.area != 0 || result.data.info.address || result.data.info.ins_high || result.data.info.ins_area || result.data.info.site_properties || result.data.info.leasehold || result.data.info.invoice_type !=0 || result.data.info.operateyear || result.data.info.edu_num || result.data.info.agestr || result.data.info.students || result.data.info.classroom_num || result.data.info.room_floor || result.data.info.room_long || result.data.info.room_wide || result.data.info.ins_wall || result.data.info.network || result.data.info.broadband || result.data.info.idle_time) {
                that.setData({
                  sign_organization: '2'
                })
              } else {
                that.setData({
                  sign_organization: '3'
                })
              }
              //周边信息
              if (result.data.info.transport && result.data.info.infrastructure && result.data.info.community && result.data.info.inhabitant && result.data.info.peer_group && result.data.info.kindergarten) {

                that.setData({
                  sign_periphery: '1'
                })
              } else if (result.data.info.transport || result.data.info.infrastructure || result.data.info.community || result.data.info.inhabitant || result.data.info.peer_group || result.data.info.kindergarten) {

                that.setData({
                  sign_periphery: '2'
                })
              } else {
                that.setData({
                  sign_periphery: '3'
                })
              }  
            }
          }
        })
      },
    })
  },

  /**
   ++++++++++以下是自定义方法/函数部分++++++++++++++++++
   */
   //查看完善信息
   checkComplete: function (e) {
    wx.navigateTo({
      url: '/pages/teamwork/information?types=' + e.currentTarget.dataset.types
    })
  },


  //提交信息
  formSubmit: function (e) {
     //如果个人、机构、周边等信息都完善可以提交否则提示完善信息
    if (this.data.sign_personal == '1' && this.data.sign_organization == '1' && this.data.sign_periphery == '1') {
      wx.getStorage({
        key: 'userinfo',
        success: function (res) {
          wx.request({
            url: app.globalData.baseUrl + 'little/institution/applyV10',
            data: {
              unionId: res.data.unionId,
              typeInfo: 'fullsubmit',
            },
            success: function (result) {
              //console.log(result);
              if (result.data.result == 'succ') {
                wx.showModal({
                  title: '提交成功',
                  showCancel: false,
                  success:function () {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '/pages/teamwork/applicationform'
                      })
                    }
                  }
                })
              } else {
                wx.showModal({
                  title: '提交失败',
                  showCancel: false
                })
              }
            },
          })
        }
      })
    } else {
      wx.showModal({
        title: '请完善信息后再提交',
        showCancel: false
      })
    }
  }
})