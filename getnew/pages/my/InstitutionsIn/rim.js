//申请成为教师
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {

      
      typeIndex1: 0,
      typeIndex2: 0,
      typeIndex3: 0,
      typeIndex4: 0,
 

      ins_tra: ["请输入实际交通状况", "地铁站附近", "公交站附近", "地铁公交都很近", "公共交通距离远",],  //交通状况
      ins_bas: ["请输入周边基础设施", "大型商场附近", "社区广场附近", "写字楼附近","学校附近",],  //基础设施
      ins_com: ["请选择周边社区情况", "超大社区", "4-6个普通社区", "1-3个普通社区", "没有社区",],  //社区
      ins_inh: ["请选择合适人口范围", "5万人以下", "5-10万人", "10万人以上", ],  




    },

   


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
    }
})