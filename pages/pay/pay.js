Page({
  data:{
    result:''
  },
  onLoad(options){
    this.setData({
      result: options.result
    })
  },
  go:function(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }
})