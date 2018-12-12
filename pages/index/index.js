Page({
  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    scale: 15,
    markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'T.I.T 创意园'
    }]
  },
  // 移动地图中心点到当前位置
  onReady: function () {
    this.mapCtx = wx.createMapContext('mapCase')
  },
  tolocation: function () {
    this.mapCtx.moveToLocation();
  },
  onShow: function () {
    this.tolocation()
  }
})