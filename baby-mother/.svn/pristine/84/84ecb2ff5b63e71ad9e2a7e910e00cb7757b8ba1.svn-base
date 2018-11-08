var app = getApp()

Page({

  data: {
    imagePath: app.globalData.baseUrl,
    name: '',
    avatar: '',
    qrcode: '',
    money: "298",
    maskHidden: false,
    /*
    官网说hidden只是简单的控制显示与隐藏，组件始终会被渲染，
    但是将canvas转化成图片走的居然是fail，hidden为false就是成功的
    所以这里手动控制显示隐藏canvas
    */
    canvasHidden: false//初始时显示canvas
  },

  onLoad: function (options) {
    var that = this;
    var type = options.type
    var act_id = options.act_id

    wx.getStorage({
      key: 'userinfo',
      success: function(res) {
        var uid = res.data.uid
        wx.request({
          url: app.globalData.baseUrl + 'little/index/makeCardQrcode',
          data: {
            act_id: act_id,
            uid: uid,
            type:type
          },
          success: function(_res) {
            if (_res.data.result == 'succ') {
              if (act_id == 6){
                  var picname = 'card2.jpg';
              }else if(act_id == 19) {
                  var picname = 'card19.jpg';
              }else {
                  var picname = 'card6.jpg';
              }
              var imageUrl = that.data.imagePath + 'public/' + picname;
              that.setData({
                  name: res.data.nickName,
                  avatar: res.data.avatarUrl,
                  // money: _res.data.info.money,
                  imagePath: imageUrl,
                  qrcode: _res.data.info.qrcode
              })
            } else {
              wx.showLoading({
                title: '正在加载...',
              })
            }
          }
        })
      },
      fail:function(){
        wx.showLoading({
          title: '正在加载...',
          mask: false,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }
    })    
    // 页面渲染完成
    this.createImg();
  },

  //将姓名绘制到canvas的固定
  setName: function (context) {
    var name = this.data.name;
    context.setFontSize(30);
    context.setFillStyle("#000000");
    context.save();
    // context.translate(100, 230);//必须先将旋转原点平移到文字位置
    // context.rotate(-5 * Math.PI / 180);
    context.fillText(name, 150, 55);//必须为（0,0）原点
    context.restore();
    context.stroke();
  },
  
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  drawImg: function () {
    var that = this;
    const context = wx.createCanvasContext('mycanvas');
    
    //下载背景模板
    wx.downloadFile({
      url: that.data.imagePath,
      success: function (code) {
        console.log('code',code);
        context.drawImage(code.tempFilePath, 0, 0, 640, 1136);
        context.restore();
        context.stroke();
        context.save()

        //画名字
        that.setName(context);

        //画二维码
        wx.downloadFile({
          url: app.globalData.baseUrl + that.data.qrcode, //仅为示例，并非真实的资源
          success: function (code) {
            context.drawImage(code.tempFilePath, 45, 950, 160, 170);
            context.restore();
            context.stroke();
            context.save()

            //画头像
            wx.downloadFile({
              url: that.data.avatar, //仅为示例，并非真实的资源          
              success: function (photo) {
                console.log('photo', photo)
                context.beginPath()
                if (wx.canIUse('canvasContext.clip')) {
                  context.arc(80, 65, 50, 0, 2 * Math.PI);
                  context.clip()
                }
                context.drawImage(photo.tempFilePath, 30, 15, 100, 100);
                context.restore();
                // context.stroke();

                //绘图
                wx.drawCanvas({
                  canvasId: "mycanvas",
                  actions: context.getActions()
                });


                // //将生成好的图片保存到本地
                wx.canvasToTempFilePath({
                  canvasId: 'mycanvas',
                  destWidth: 640,
                  destHeight: 1136,
                  success: function (res) {
                    /*wx.previewImage({
                      urls: [res.tempFilePath],
                    })*/
                    wx.saveImageToPhotosAlbum({
                      filePath: res.tempFilePath,
                      success: function(){
                        wx.showToast({
                          title: '已保存到相册'
                        })
                      }
                    })
                    that.setData({
                      imagePath: res.tempFilePath,
                      canvasHidden: true//生成完图片后将画布隐藏
                    });
                  }
                });
              }
            })
          }
        })
      }
    })
  },

  //点击图片进行预览，长按保存分享图片
  previewImg: function (e) {
    var img = this.data.imagePath;
    wx.previewImage({
      current: img,  //当前显示图片的http链接
      urls: [img]    //需要预览的图片http链接列表
    })
  },

  createImg: function () {
    var that = this;
    wx.showToast({
      title: '正在生成...',
      icon: 'loading',
      duration: 2000
    });
    setTimeout(function () {
      wx.hideToast()
      that.drawImg();
      that.setData({
        maskHidden: true
      });
    }, 2000)

  }
})