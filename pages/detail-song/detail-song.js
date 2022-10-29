// pages/detail-song/detail-song.js
import recommendStore from '../../store/recommendStore'
import rankingStore from '../../store/rankingStore'
import { getPlaylistDetail } from "../../services/music"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: "ranking",
    key: "newRanking",
    songInfo: {},
    id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //确定获取数据类型
    const type = options.type
    this.setData({ type })
    if (type === "ranking") {
      const key = options.key
      this.data.key = key
      rankingStore.onState(key, this.handleRanking)
    }

    //获取store中榜单数据
    if (type === "ranking") {
      const key = options.key
      this.data.key = key
      rankingStore.onState(key, this.handleRanking)
    } else if (type === "recommend") {
      recommendStore.onState("recommendSongInfo", this.handleRanking)
    } else if (type === "menu") {
      const id = options.id
      this.data.id = id
      this.fetchMenuSongInfo()
    }
  },
  //发送网络请求获取歌单数据
  async fetchMenuSongInfo() {
    const res = await getPlaylistDetail(this.data.id)
    this.setData({ songInfo: res.playlist })
  },

  handleRecommendSongs(value) {
    this.setData({ songs: value })
  },
  handleRanking(value) {
    if (this.data.type === 'recommend') {
      value.name = "推荐歌曲"
    }
    this.setData({ songInfo: value })
    wx.setNavigationBarTitle({
      title: value.name,
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {//取消监听
    if (this.data.type === "ranking") {
      rankingStore.offState(this.data.key, this.handleRanking)
    } else if (this.data.type === "recommend") {
      recommendStore.offState("recommendSongInfo", this.handleRecommendSongs)
    }
  },

})