// components/nav-bar/nav-bar.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true
  },
  properties: {
    title: {
      type: String,
      value: "导航标题"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusHeight: 20
  },
  methods: {
    onLeftClick() {
      this.triggerEvent("leftclick")
    }
  },
  lifetimes: {
    attached() {
      this.setData({ statusHeight: app.globalData.statusHeight })
    }
  }
})
