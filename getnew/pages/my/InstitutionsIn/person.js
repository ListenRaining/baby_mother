//机构申请
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

   

    typeIndex: 0,
    typeIndex1: 0,
    typeIndex2: 0,
    typeIndex3: 0,
    typeIndex4: 0,
    typeIndex5: 0,
    typeIndex6: 0,
    typeIndex7: 0,
    typeIndex8: 0,
    typeIndex9: 0,
    typeIndex10: 0,
    typeIndex11: 0,
    ins_type: ["请选择机构类型", "艺术培训机构", "亲子早教机构", "综合培训中心", "其他",],  //机构类型
    region: ['北京市', '北京市', '朝阳区'],                                              //地区选择
    customItem: '全部',
    ins_area: ["请选择机构总面积", "100㎡以下", "100-200㎡", "200-300㎡", "300㎡以上",],  //机构面积
    ins_invoice: ["请选择发票类型", "增值税专用发票", "增值税普通发票",],  //发票类型
    ins_age: ["请选择经营年限", "1年以内", "1-3年", "3-5年", "5年以上",],  //经营年限
    ins_edu: ["请选择教务或市场人数", "3人以下", "3-5人", "5-10人", "10人以上",],  //教务
    ins_enrollment: ["请选择生源年龄段", "0-3岁", "3-6岁", "6-12岁", "12岁以上",],  //年龄段
    ins_num: ["请选择学员人数", "50人以下", "50-100人", "100-200人", "200人以上",],  //人数
    ins_room: ["请选择教室数量", "3间以下", "4间", "5间", "5间以上",],  //教室数量
    ins_wall: ["请选择承重墙类型", "实体墙", "隔断墙有龙骨", "隔断墙无龙骨",],  //承重墙
    ins_net: ["请选择网络类型", "有线网络", "无线网络", "有线无线都有", "没有网络",],  //网络
    ins_bw: ["请选择教室闲置时间段", "周一至周五全天", "周一至周五下午", "周末全天", "没有闲置时间",],  //闲置


    


  //  周边

    typeIndex1: 0,
    typeIndex2: 0,
    typeIndex3: 0,
    typeIndex4: 0,


    ins_tra: ["请输入实际交通状况", "地铁站附近", "公交站附近", "地铁公交都很近", "公共交通距离远",],  //交通状况
    ins_bas: ["请输入周边基础设施", "大型商场附近", "社区广场附近", "写字楼附近", "学校附近",],  //基础设施
    ins_com: ["请选择周边社区情况", "超大社区", "4-6个普通社区", "1-3个普通社区", "没有社区",],  //社区
    ins_inh: ["请选择合适人口范围", "5万人以下", "5-10万人", "10万人以上",],

  
    dateValue: '请选择宝宝出生年月',

    clickFlag: false,

    typeIndex5: 0,
  


  },

  
  onLoad: function (options) {

    var that = this
    var queryBean = JSON.parse(options.queryBean);
    that.setData({
      queryBean: queryBean
    })
    if (queryBean==0){

      wx.setNavigationBarTitle({
        title: "个人信息"//页面标题为路由参数
      })
    }else if(queryBean==1){
      wx.setNavigationBarTitle({
        title: "机构信息"//页面标题为路由参数
      })
    }
    else if (queryBean == 2) {
      wx.setNavigationBarTitle({
        title: "周边信息"//页面标题为路由参数
      })

    }
    // show = that.data.queryBean
    app.globalData.typeNumber = that.data.queryBean
    console.log(app.globalData.typeNumber)

   
    

  },
    


  onUnload: function () {//如果页面被卸载时被执行
    console.log(app.globalData.typeNumber)
    if (app.globalData.typeNumber==1){
      
      var ins_type = ["请选择机构类型", "艺术培训机构", "亲子早教机构", "综合培训中心", "其他",] //机构

      console.log(this.data.ins_name)
      console.log(ins_type[this.data.typeIndex1])


      var ins_type = ["请选择机构类型", "艺术培训机构", "亲子早教机构", "综合培训中心", "其他",] //机构类型
      var region = ['北京市', '北京市', '朝阳区']                                             //地区选择
      var ins_area = ["请选择机构总面积", "100㎡以下", "100-200㎡", "200-300㎡", "300㎡以上",]  //机构面积
      var ins_invoice = ["请选择发票类型", "增值税专用发票", "增值税普通发票",]  //发票类型
      var ins_age = ["请选择经营年限", "1年以内", "1-3年", "3-5年", "5年以上",]  //经营年限
      var site_propertiesSelect = ["请选择场地性质", "自有", "租赁"] //场地类型
      var ins_edu = ["请选择教务或市场人数", "3人以下", "3-5人", "5-10人", "10人以上",]  //教务
      var ins_enrollment = ["请选择生源年龄段", "0-3岁", "3-6岁", "6-12岁", "12岁以上",]  //年龄段
      var ins_num = ["请选择学员人数", "50人以下", "50-100人", "100-200人", "200人以上",] //人数
      var ins_room = ["请选择教室数量", "3间以下", "4间", "5间", "5间以上",],  //教室数量
      var ins_room = ["请选择教室数量", "3间以下", "4间", "5间", "5间以上",],  //教室数量
      var ins_room = ["请选择教室数量", "3间以下", "4间", "5间", "5间以上",],  //教室数量
      var ins_wall = ["请选择承重墙类型", "实体墙", "隔断墙有龙骨", "隔断墙无龙骨",],  //承重墙
      var ins_net = ["请选择网络类型", "有线网络", "无线网络", "有线无线都有", "没有网络",]  //网络
      var ins_bw = ["请选择教室闲置时间段", "周一至周五全天", "周一至周五下午", "周末全天", "没有闲置时间",]  //闲置


      consolthis.log(this.data.ins_name)
      console.log(this.data.typeName)



      var save_ins_name = this.data.ins_name //机构名称
      var save_types = this.data.types   //机构类型
      var save_province = this.data.province //所在地区
      var save_address = this.data.address //详细地址
      var save_ins_high = this.data.ins_high //机构层高
      var save_ins_area = this.data.ins_area //总面积
      var save_site_properties = this.data.site_properties //场地性质
      var save_leasehold = this.data.leasehold//租赁期
      var save_invoice_type = this.data.invoice_type//发票类型
      var save_operateyear = this.data.operateyear//经营年限
      //---------------------------
      var save_edu_num = this.data.edu_num //教务人数
      //---------------------------
      var save_agestr = this.data.agestr //年龄段
      var save_students = this.data.students //学员人数
      //---------------------------
      var save_classroom_num = this.data.classroom_num //教室数量
      var save_room_floor = this.data.room_floor//所在楼层
      var save_room_long = this.data.room_long //教室长
      var save_room_wide = this.data.room_wide//教室宽
      var save_ins_wall = this.data.ins_wall//承重墙
      var save_network = this.data.network//网络
      var save_broadband = this.data.broadband//带宽
      var save_idle_time = this.thisidle_time//闲置时间

      

      this.gotoHomePage();


    }
       
  },
  
  modalcnt: function () {
    wx.showModal({
      title: '提示!',
      content: '保存信息后再退出？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


  gotoHomePage: function () {//自定义页面跳转方法
    let that = this;
    //------------------
    if (that.data.clickFlag) {
      return;
    } else {
      that.setData({ clickFlag: true });
    }
    //------------------
    // wx.switchTab({
    //   url: '../home/home',
    // })

    this.modalcnt(); 
  },
  /**
   * 机构所在城市
   */
  bindCityChange: function (e) {
    this.setData({
      typeIndex: e.detail.value

    })
  },

  /**
 * 机构类型
 */
  bindTypeChange: function (e) {
    console.log(e)
    this.setData({
      typeIndex1: e.detail.value

    })
  },
  /**
    *地区选择
    */
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  /**
   * 机构面积
   */
  bindAreaChange: function (e) {
    this.setData({
      typeIndex2: e.detail.value
    })
  },

  /**
  * 发票类型
  */
  bindInvoiceChange: function (e) {
    this.setData({
      typeIndex3: e.detail.value
    })
  },
  /**
* 年限
*/
  bindAgeChange: function (e) {
    this.setData({
      typeIndex4: e.detail.value
    })
  },
  /**
* 教务
*/
  bindEduChange: function (e) {
    this.setData({
      typeIndex5: e.detail.value
    })
  },

  /**
* 年龄段
*/
  bindEnrChange: function (e) {
    this.setData({
      typeIndex6: e.detail.value
    })
  },
  /**
* 人数
*/
  bindNumChange: function (e) {
    this.setData({
      typeIndex7: e.detail.value
    })
  },
  /**
* 教室数量
*/
  bindRoomChange: function (e) {
    this.setData({
      typeIndex8: e.detail.value
    })
  },
  /**
* 承重墙
*/
  bindWallChange: function (e) {
    this.setData({
      typeIndex9: e.detail.value
    })
  },
  /**
* 网络
*/
  bindNetChange: function (e) {
    this.setData({
      typeIndex10: e.detail.value
    })
  },

  /**
* 闲置
*/
  bindBwChange: function (e) {
    this.setData({
      typeIndex11: e.detail.value
    })
  },
  /**
   * 机构面积
   */
  bindProportionChange: function (e) {
    this.setData({
      proportionIndex: e.detail.value
    })
  },




// 周边。。。。。。。。。。。。。

  /**
    * 交通状况
    */
  bindTraChange: function (e) {
    this.setData({
      typeIndex1: e.detail.value

    })
  },
  /**
    *基础设施
    */
  bindBasChange: function (e) {
    this.setData({
      typeIndex2: e.detail.value
    })
  },
  /**
   * 社区
   */
  bindComChange: function (e) {
    this.setData({
      typeIndex3: e.detail.value
    })
  },

  /**
  * 常住人口
  */
  bindInhChange: function (e) {
    this.setData({
      typeIndex4: e.detail.value
    })
  },

  /**
   * 机构面积
   */
  bindProportionChange: function (e) {
    this.setData({
      proportionIndex: e.detail.value
    })
  },
  //周边信息
  toName: function(e) {
    var that = this
    console.log(111)
    
    var formId = e.detail.formId
   
  },

  // 机构名称值
  getName: function (e) {
    var val = e.detail.value;
   
   this.setData({
     ins_name:val
   })
    
  },
  // 机构名称值
  getType: function (e) {
    var val = e.detail.value;

    this.setData({
      ins_type: val
    })

  },
  

})