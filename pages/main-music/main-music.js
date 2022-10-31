// pages/main-music/main-music.js
import { getMusicBannerList, getSongMenuList } from '../../services/music'
import querySelect from '../../utils/query-select'
import throttle from '../../utils/throttle'
import recommendStore from '../../store/recommendStore'
import rankingStore from '../../store/rankingStore'
import playerStore from '../../store/playerStore'
const SelectorQueryThrottle = throttle(querySelect)//节流操作
const app = getApp()
Page({

  data: {
    searchValue: '',
    banners: [],
    bannerHeight: 130,
    recommendSongs: [],
    screenWidth: 375,
    isRankingData: false,
    hotMenuList: [],
    recMenuList: [],
    rankingInfos: {},

    // 当前正在播放的歌曲信息
    currentSong: {},
    isPlaying: false
  },

  onLoad(options) {
    this.fetchMusicBanner(),
      this.fetchSongMenuList()
    recommendStore.onState("recommendSongInfo", this.handleRecommendSongs)//开启监听
    //发起action
    recommendStore.dispatch('fetchRecommendSongsAction')
    rankingStore.onState("newRanking", this.handleNewRanking)
    rankingStore.onState("originRanking", this.handleOriginRanking)
    rankingStore.onState("upRanking", this.handleUpRanking)
    rankingStore.dispatch('fetchRankingDataAction')

    playerStore.onStates(["currentSong", "isPlaying"], this.handlePlayInfos)
    //屏幕尺寸
    this.setData({ screenWidth: app.globalData.screenWidth })
  },

  async fetchMusicBanner() {
    const res = await getMusicBannerList()
    this.setData({ banners: res.banners })
  },
  // async fetchRecommendSongs() {
  //   const res = await getPlaylistDetail(3778678)
  //   const playlist = res.playlist
  //   const recommendSongs = playlist.tracks.slice(0,6)
  //   this.setData({ recommendSongs })
  // },
  async fetchSongMenuList() {
    getSongMenuList().then(res => {
      this.setData({ hotMenuList: res.playlists })
    })
    getSongMenuList("华语").then(res => {
      this.setData({ recMenuList: res.playlists })
    })
  },

  //事件
  onSearchClick() {
    wx.navigateTo({
      url: '/pages/detail-search/detail-search',
    })
  },
  onBannerImgLoad(e) {
    SelectorQueryThrottle('.banner-image').then(res => {
      this.setData({ bannerHeight: res[0].height })
    })
  },
  onRecommendMoreClick() {
    wx.navigateTo({
      url: '/pages/detail-song/detail-song?type=recommend',
    })
  },
  onSongItemTap(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState("playSongList", this.data.recommendSongs)
    playerStore.setState("playSongIndex", index)
  },
  onPlayOrPauseBtnTap() {
    playerStore.dispatch("changeMusicStatusAction")
  },
  onPlayBarAlbumTap() {
    wx.navigateTo({
      url: '/pages/music-player/music-player',
    })
  },

  //从store中获取数据
  handleRecommendSongs(value) {
    if (!value.tracks) return
    this.setData({ recommendSongs: value.tracks.slice(0, 6) })
  },
  handleNewRanking(value) {
    // console.log("新歌榜:", value);
    if (!value.name) return
    this.setData({ isRankingData: true })
    const newRankingInfos = { ...this.data.rankingInfos, newRanking: value }
    this.setData({ rankingInfos: newRankingInfos })
  },
  handleOriginRanking(value) {
    // console.log("原创榜:", value);
    if (!value.name) return
    this.setData({ isRankingData: true })
    const newRankingInfos = { ...this.data.rankingInfos, originRanking: value }
    this.setData({ rankingInfos: newRankingInfos })
  },
  handleUpRanking(value) {
    // console.log("飙升榜:", value);
    if (!value.name) return
    this.setData({ isRankingData: true })
    const newRankingInfos = { ...this.data.rankingInfos, upRanking: value }
    this.setData({ rankingInfos: newRankingInfos })
  },
  handlePlayInfos({ currentSong, isPlaying }) {
    if (currentSong) {
      this.setData({ currentSong })
    }
    if (isPlaying !== undefined) {
      this.setData({ isPlaying })
    }
  },

  onUnload() {
    //取消监听
    recommendStore.offState("recommendSongs", this.handleRecommendSongs)
    recommendStore.offState("recommendSongs", this.handleNewRanking)
    recommendStore.offState("recommendSongs", this.handleOriginRanking)
    recommendStore.offState("recommendSongs", this.handleUpRanking)
    playerStore.offStates(["currentSong", "isPlaying"], this.handlePlayInfos)
  }
})