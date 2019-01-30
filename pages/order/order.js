var app = getApp();
Page({
  data: {
    orderDetil: {
      facId: ''
    },
    pay: {
      amount: 0,
      usrCouponId: undefined,
      payType: 0,
    }

  },
  onLoad(options) {
    /**
     * 临时使用
     */
    this.setData({
      'orderDetil.facId': options.result
    })
    // 隐藏bar
    wx.hideTabBar({
      aniamtion: true
    })
    var _this = this;
    var token = wx.getStorageSync("token");
    wx.request({
      url: app.hostUrl + '/order/detail',
      header: {
        "token": token
      },
      method: "GET",
      data: {
        "code": options.result
      },
      success(res) {
        if (res.statusCode == 200) {
          _this.setData({
            orderDetil: res.data,
            'pay.amount': res.data.amount
          })
        } else if (res.statusCode == 401) {
          wx.removeStorageSync("token");
          wx.navigateBack({
            delta: getCurrentPages.length - 1
          })
          wx.showToast({
            title: '请重新登陆',
            icon: 'info',
            duration: 2000,
            mask: true
          })
        }
      }
    })
  },
  onHide() {
    wx.showTabBar({
      animation: true
    })
  },
  /**
   * 支付方式改变
   */
  pickerChange(e) {
    this.setData({
      "pay.payType": e.detail.value
    })
  },
  orderPost() {
    var data = this.data;
    var token = wx.getStorageSync("token");
    wx.request({
      url: app.hostUrl + '/order/create',
      method: "POST",
      header: {
        "token": token
      },
      data: {
        "orderAmount": data.orderDetil.amount,
        "BigDecimal": data.pay.amount,
        "usrCouponId": data.pay.usrCouponId,
        "payType": data.pay.payType,
        "facilityId": data.orderDetil.facilityId,
        "serviceStationId": data.orderDetil.serviceStationId,
      },
      success(res) {
        if (res.statusCode == 200) {
          console.log("result200");
          const data = res.data;
          console.log(data)
          wx.requestPayment({
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            success(e) {
              console.log("支付结果")
              console.log(e)
            },
            fail(e) {
              console.log("支付失败")
              console.log(e)
            }
          })
        } else {
          wx.showToast({
            title: '请求错误,请稍后重试',
            icon: 'warn',
            duration: 2000,
            mask: true
          })
        }
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
    })
  }
})