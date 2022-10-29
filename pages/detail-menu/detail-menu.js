// pages/detail-menu/detail-menu.js
import { getSongMenuTag, getSongMenuList } from '../../services/music'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songMenus: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchGetAllMenuList()
  },
  //网络请求
  async fetchGetAllMenuList() {
    //获取tags
    const res = await getSongMenuTag()
    const tags = res.tags

    //根据tags获取对应歌单
    const allPromise = []
    for (const tag of tags) {
      const promise = getSongMenuList(tag.name)
      allPromise.push(promise)
    }
    //获取到所有数据后调用一次setData
    Promise.all(allPromise).then(res => {
      // console.log(res);
      this.setData({ songMenus: res })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})