// miniprogram/pages/function_center/device_connet/index.js
import { reqTicket, getClientId } from '../../../utils/api/common-api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    apUrl: '/pages/web_view/index?urlType=apUrl',
    list: [
      {
        name: '自动发现',
        baseUrl: 'plugin://tuya-ap-plugin/auto'
      },
      {
        name: '蓝牙配网',
        baseUrl: 'plugin://tuya-ap-plugin/ble'
      },
      {
        name: '扫码配网',
        baseUrl: 'plugin://tuya-ap-plugin/virtual'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

<<<<<<< HEAD
  // 跳转配网插件
=======
>>>>>>> ffbd87af2df16d0994473b89394364226dc9ab8b
  gotoPluginpage: async function ({ currentTarget }) {
    const { dataset: { baseurl } } = currentTarget
    const [{ ticket }, clientId] = await Promise.all([reqTicket(), getClientId()])

<<<<<<< HEAD
    const home_id = wx.getStorageSync('owner_id')
    wx.navigateTo({
      url: `${baseurl}?ticket=${ticket}&clientId=${clientId}&gid=${home_id}`,
=======
    wx.navigateTo({
      url: `${baseurl}?ticket=${ticket}&clientId=${clientId}`,
>>>>>>> ffbd87af2df16d0994473b89394364226dc9ab8b
    })
  },

  gotoWebview: function({currentTarget}) {
    const { dataset: { baseurl } } = currentTarget
    wx.navigateTo({
      url: baseurl,
    })
  }

})