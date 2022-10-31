// pages/music-player/music-player.js
// import { getSongDetail, getSongLyric } from '../../services/player'
// import { parseLyric } from "../../utils/parse-lyric"
import { throttle } from 'underscore'
import playerStore, { audioContext } from '../../store/playerStore'
// const audioContext = wx.createInnerAudioContext()//创建播放器
const app = getApp()
const modeNames = ["order", "repeat", "random"]
Page({

  data: {
    stateKeys: ["id", "currentSong", "durationTime", "currentTime", "lyricInfos", "currentLyricText", "currentLyricIndex", "isPlaying", "playModeIndex"],

    id: 0,
    currentSong: {},
    currentTime: 0,
    durationTime: 0,
    lyricInfos: [],
    currentLyricText: "",
    currentLyricIndex: -1,

    isPlaying: true,

    playSongIndex: 0,
    playSongList: [],
    isFirstPlay: true,

    playModeName: "order",

    pageTitles: ["歌曲", "歌词"],
    currentPage: 0,
    contentHeight: 0,
    sliderValue: 0,
    isSliderChanging: false,
    isWaiting: false,

    lyricScrollTop: 0
  },

  onLoad(options) {
    //获取设备信息
    this.setData({
      statusHeight: app.globalData.statusHeight,
      contentHeight: app.globalData.contentHeight
    })

    //获取id
    const id = options.id
    // this.setData({ id })
    // 2.根据id播放歌曲
    if (id) {
      playerStore.dispatch("playMusicWithSongIdAction", id)
    }
    // 3.获取store共享数据
    playerStore.onStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
    playerStore.onStates(this.data.stateKeys, this.getPlayerInfosHandler)
    // //根据id获取的数据
    // getSongDetail(id).then(res => {
    //   // console.log(res);
    //   this.setData({ currentSong: res.songs[0], durationTime: res.songs[0].dt })
    // })
    // //获取歌词信息
    // getSongLyric(id).then(res => {
    //   const lrcString = res.lrc.lyric
    //   const lyricInfos = parseLyric(lrcString)
    //   this.setData({ lyricInfos })
    // })
    // //播放当前歌曲
    // audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    // audioContext.autoplay = true//自动播放
    // //监听播放进度
    // const throttleUpdateProgress = throttle(this.updateProgress, 500, {
    //   leading: false,
    //   trailing: false
    // })
    // audioContext.onTimeUpdate(() => {
    //   //更新歌曲播放进度
    //   if (!this.data.isSliderChanging && !this.data.isWaiting) {//使用节流操作进行优化及结局bug
    //     throttleUpdateProgress()
    //   }
    //   //匹配歌词
    //   if (!this.data.lyricInfos.length) return
    //   let index = this.data.lyricInfos.length - 1
    //   for (let i = 0; i < this.data.lyricInfos.length; i++) {
    //     const info = this.data.lyricInfos[i]
    //     if (info.time > audioContext.currentTime * 1000) {
    //       index = i - 1
    //       break
    //     }
    //   }
    //   if (index === this.data.currentLyricIndex) return //优化当记录的index和匹配的index相同时则不执行不执行
    //   //获取歌词索引及文本
    //   //改变歌词滚动页面的位置
    //   const currentLyricText = this.data.lyricInfos[index].text
    //   this.setData({ currentLyricText, currentLyricIndex: index, lyricScrollTop: 35 * index })
    // })
    // audioContext.onWaiting(() => {
    //   audioContext.pause()
    // })
    // audioContext.onCanplay(() => {
    //   audioContext.play()
    // })
    // //5.获取store共享数据
    // playerStore.onStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandle)
  },

  updateProgress: throttle(function(currentTime) {
    if (this.data.isSliderChanging) return
    // 1.记录当前的时间 2.修改sliderValue
    const sliderValue = currentTime / this.data.durationTime * 100
    this.setData({ currentTime, sliderValue })
  }, 800, { leading: false, trailing: false }),

  //事件监听
  onNavBackTap() {
    wx.navigateBack()
  },
  onSwiperChange(event) {
    this.setData({ currentPage: event.detail.current })
  },
  onNavTabItemTap(event) {
    const index = event.currentTarget.dataset.index
    this.setData({ currentPage: index })
  },
  onSliderChange(event) {
    this.data.isWaiting = true
    setTimeout(() => {
      this.data.isWaiting = false
    }, 1000)
    //获取点击滑块对应的值
    const value = event.detail.value
    //计算播放的位置
    const currentTime = value / 100 * this.data.durationTime
    //设置播放器
    audioContext.seek(currentTime / 1000)//跳转时间
    this.setData({ currentTime, isSliderChanging: false, sliderValue: value })
    //监听当前有没有在等待---等待过程中先暂停让其缓存---等到可以播放时再进行播放
    // audioContext.onWaiting(() => {
    //   audioContext.pause()
    // })
    // audioContext.onCanplay(() => {
    //   audioContext.play()
    // })
  },
  onSliderChanging: throttle(function (event) {
    // 1.获取滑动到的位置的value
    const value = event.detail.value

    // 2.根据当前的值, 计算出对应的时间
    const currentTime = value / 100 * this.data.durationTime
    this.setData({ currentTime })

    // 3.当前正在滑动
    this.data.isSliderChanging = true
  }, 100),

  onPlayOrPauseTap() {
    playerStore.dispatch("changeMusicStatusAction")
  },
  onPrevBtnTap() {
    playerStore.dispatch("playNewMusicAction", false)
  },
  onNextBtnTap() {
    playerStore.dispatch("playNewMusicAction")
  },
  onModeBtnTap() {
    playerStore.dispatch("changePlayModeAction")
  },
  //播放暂停
  // onPlayOrPauseTap() {
  //   if (!audioContext.paused) {
  //     audioContext.pause()
  //     this.setData({ isPlaying: false })
  //   } else {
  //     audioContext.play()
  //     this.setData({ isPlaying: true })
  //   }
  // },

  //store共享数据
  getPlaySongInfosHandler({ playSongList, playSongIndex }) {
    if (playSongList) {
      this.setData({ playSongList })
    }
    if (playSongIndex !== undefined) {
      this.setData({ playSongIndex })
    }
  },
  getPlayerInfosHandler({
    id, currentSong, durationTime, currentTime,
    lyricInfos, currentLyricText, currentLyricIndex,
    isPlaying, playModeIndex
  }) {
    if (id !== undefined) {
      this.setData({ id })
    }
    if (currentSong) {
      this.setData({ currentSong })
    }
    if (durationTime !== undefined) {
      this.setData({ durationTime })
    }
    if (currentTime !== undefined) {
      // 根据当前时间改变进度
      this.updateProgress(currentTime)
    }
    if (lyricInfos) {
      this.setData({ lyricInfos })
    }
    if (currentLyricText) {
      this.setData({ currentLyricText })
    }
    if (currentLyricIndex !== undefined) {
      // 修改lyricScrollTop
      this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
    }
    if (isPlaying !== undefined) {
      this.setData({ isPlaying })
    }
    if (playModeIndex !== undefined) {
      this.setData({ playModeName: modeNames[playModeIndex] })
    }
  },
  onUnload() {
    playerStore.offStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
    playerStore.offStates(this.data.stateKeys, this.getPlayerInfosHandler)
  }
})