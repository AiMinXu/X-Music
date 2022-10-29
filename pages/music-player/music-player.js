// pages/music-player/music-player.js
import { getSongDetail,getSongLyric } from '../../services/player'
Page({

  data: {
    id: 0,
    currentSong:{},
    lrcString:""
  },

  onLoad(options) {
    //获取id
    const id = options.id
    this.setData({ id })
    //根据id获取的数据
    getSongDetail(id).then(res=>{
      console.log(res);
      this.setData({currentSong : res.songs[0]})
    })
    //获取歌词信息
    getSongLyric(id).then(res=>{
      this.setData({lrcString : res.lrc})
    })
  },

})