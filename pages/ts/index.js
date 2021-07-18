import {
  getDeviceDetails
} from '../../utils/api/device-api';
import {
  getFamilyList
} from '../../utils/api/family-api';
import BleService from '../../libs/ble-server';
import request from '../../utils/request';
import {
  dpIdMap
} from '../../utils/ts_utils/config';

const BleConnectStatus = {
  notConnected: 'notConnected',
  connecting: 'connecting',
  connected: 'connected',
  connectionFailed: 'connectionFailed'
};

// 注入方法
BleService.initFunction(request);

Page({
  /**
   * 页面的初始数据
   */
  data: {
    device_name: '',
    bleInstance: null,
    bleConnectStatus: BleConnectStatus.notConnected,
    dpState: {},
    bleConnect: false,
    dps: {},
    countData: {},
    show: false,
    connected: false,
    state: ''
  },
  jumpTodeviceEditPage() {
    const {
      icon,
      device_id,
      device_name
    } = this.data;
    wx.navigateTo({
      url: `/pages/home_center/device_manage/index?device_id=${device_id}&device_name=${device_name}&device_icon=${icon}`
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const {
      device_id
    } = options
    const {
      name,
      icon
    } = await getDeviceDetails(device_id)
    // 家庭id
    const owner_id = wx.getStorageSync('owner_id')

    // 抽象的蓝牙设备实例
    const instance = BleService.setNewInstance(device_id, owner_id);
    // 功能点实例化
    instance.set('_bleIotData', {
      _ble_dpCodeMap: dpIdMap
    });
    // 监听蓝牙通信
    instance.revicePackage((parseReceiveData) => {
      const {
        type,
        status,
        dpState,
        deviceId
      } = parseReceiveData;
      // wx.showLoading()
      this.setData({
        dpState,
        status,
        type,
        deviceId
      });
      if (type === 'connect' && status === 'fail') {
        if (deviceId) {
          // wx.hideLoading()
          return {
            msg: '连接失败 或 连接后又断开'
          }
        } else {
          // wx.hideLoading()

          return {
            msg: '未发现当前蓝牙设备'
          }
        }
      } else if (type === 'connect' && status === 'connected') {
        // 连接成功
        wx.showToast({
          title: '蓝牙连接成功',
          icon: 'success',
          duration: 2000
        })
        // wx.hideLoading()
      } else if (!(deviceId in parseReceiveData)) {
        // 一般为dp上报事件，可在此处处理数据or走业务逻辑
        console.log('链接！', parseReceiveData);
        this.setData({
          countData: {
            ...dpState
          }
        })
      } else {
        wx.showToast({
          title: '挂了',
        })
      }
    });
    // 指令下发
    this.setData({
      device_name: name,
      icon,
      bleInstance: instance
    });
  },
  onUnload: function() {
    const { device_id } = this.data;
    BleService.destroyInstance(device_id);
  },
  // 下发指令，设置本次跳绳目标为 57 次（该dp点下发前需先下发工作模式给到设备，否则下发失败，详见readme文档）
  sendCount: function () {
    const {
      bleInstance
    } = this.data;
    if (bleInstance) {
      bleInstance.sendDp({
        dpCode: 'target_count',
        dpValue: 57
      });
    }
  },
  onFreeMod() {
    console.log('自由模式');
    const {
      bleInstance
    } = this.data
    if (bleInstance) {
      bleInstance.sendDp({
        dpCode: 'mode',
        dpValue: 'free_jump'
      })
    }
  },
  onCountMod() {
    const {
      bleInstance
    } = this.data
    if (bleInstance) {
     
      this.setData({
        show: true
      })
    }
  },
  onChange(e) {
    console.log(e)
    this.setData({
      property: +e.detail
    })
  },
  onConfirm() {
    const {
      bleInstance,
      property = 20
    } = this.data
    if (bleInstance) {
      bleInstance.sendDp({
        dpCode: 'mode',
        dpValue: 'countdown_number'
      })
      setTimeout(() =>{
        bleInstance.sendDp({
          dpCode: 'target_count',
          dpValue: property
        })
      }, 100)
      
    }
  },
  onClose() {
    this.setData({
      show: false
    })
  },
  // 下发指令，设置本次跳绳模式为 倒计数 模式
  sendMod: function () {
    const {
      bleInstance
    } = this.data;
    console.log(bleInstance, 888);
    if (bleInstance) {
      bleInstance.sendDp({
        dpCode: 'mode',
        dpValue: 'countdown_number'
      });
    }
  },
  // 蓝牙连接
  connect: function () {
    this.data.bleInstance.connectBlue()
  },
  controlSwitch() {
    const {
      state,
      bleInstance
    } = this.data
    if (state === 'start') {
      bleInstance.sendDp({
        dpCode: 'start'
      })
    } else {
      bleInstance.sendDp({
        dpCode: 'pause'
      })
    }
  }
});