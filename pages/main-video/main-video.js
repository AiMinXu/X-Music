// pages/main-video/main-video.js
import { getTopMv } from '../../services/video'
Page({
  data: {//数据
    videoList: [],
    offset: 0,
    hasMore: true
  },
  //发送网络请求
  onLoad() {
    this.fetchTopMv()
  },
  //发送网络请求的函数
  async fetchTopMv() {
    //1.获取数据
    const res = await getTopMv(this.data.offset)
    //2.将新数据追加到源数据后面
    const newVideoList = [...this.data.videoList, ...res.data]
    //3.设置全新的数据
    this.setData({ videoList: newVideoList })
    this.data.offset = this.data.videoList.length
    this.data.hasMore = res.hasMore
  },
  //监听上拉下拉功能
  onReachBottom() {
    //判断是否有更多数据
    if (!this.data.hasMore) return
    this.fetchTopMv()
  },
  async onPullDownRefresh() {
    //1.清空之前数据
    this.setData({ videoList: [] })
    this.data.offset = 0
    this.data.hasMore = true
    //重新发送请求
    await this.fetchTopMv()
    //停止刷新
    wx.stopPullDownRefresh()
  },
  //事件监听
  onVideoItemTap(event){
    // const item = event.currentTarget.dataset.item
    // wx.navigateTo({
    //   url: `/pages/detail-video/detail-video?id=${item.id}`,
    // })
  }
})