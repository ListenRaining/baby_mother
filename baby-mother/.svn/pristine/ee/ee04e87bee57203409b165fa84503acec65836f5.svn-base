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
        ins_bw: ["请选择教室闲置时间段","周一至周五全天", "周一至周五下午", "周末全天", "没有闲置时间",],  //闲置
        

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
  bindBwChange: function(e) {
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
    }
})