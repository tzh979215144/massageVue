<template>
  <div v-loading="openAccountProcessLoading" class="processInfo">
    <div class="timeLineTitle">
      <div class="timeLineItem">
        <div class="finish timeLineStatus" />
        <div>已完成</div>
      </div>
      <div class="timeLineItem">
        <div class="being timeLineStatus" />
        <div>进行中</div>
      </div>
      <div class="timeLineItem">
        <div class="wating timeLineStatus" />
        <div>待开始</div>
      </div>
      <div class="timeLineItem">
        <div class="timeOut timeLineStatus" />
        <div>超时警告</div>
      </div>
    </div>
    <label class="el-form-item-label">店铺</label>
    <el-select v-model="filterParam.shopId" @change="initMassager(filterParam)" filterable placeholder="请选择">
      <el-option
        v-for="item in shops"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
    <label class="el-form-item-label">时间</label>
    <el-date-picker
      v-model="filterParam.nowDay"
      @change="initMassager(filterParam)"
    />
    <el-button type="success" plain round icon="el-icon-check" size="mini" @click="initMassager(filterParam)">更新</el-button>
    <br />
    <el-timeline id="timeLineDate" style="margin-left: 100px; margin-top: 10px;">
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        icon="el-icon-s-custom"
        type="primary"
        size="large"
        :timestamp="activity.massager"
        placement="top"
      >
        <!-- <div>1111</div> -->
        <div style="display:flex;">
          <timeLine :time-line-list="activity.timeLineList" />
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
// import { businessProcess } from '@/api/dataGovern'
// import CommonTitle from '@/components/dataGovern/common/commonTitle'
import { getShops } from '@/api/massage/shop'
import { getTimeShow } from '@/api/massage/timeShow'
import timeLine from './timeLine'
export default {
  components: { timeLine },
  data() {
    return {
      filterParam: {
        shopId: 1,
        nowDay: new Date()
      },
      openAccountProcessLoading: false,
      activities: [],
      shops: [],

      activitiess: [
        {
          massager: 'Amy',
          timeLineList: [
            {
              status: '',
              startTime: '09：00',
              endTime: '10: 20',
              duration: 80,
              info: '保险',
              timeLineBranch: [
                { timestamp: '10:00', status: 'being', info: '开始' },
                { timestamp: '11:00', status: 'wating', info: '要求加时20分钟' }
              ]
            },
          ]
        },
      ]
    }
  },
  created() {
    this.initMassager(this.filterParam)
  },
  methods: {
    shopName(id) {
      const result = this.shops.find(item => item.id == id)
      if (typeof result === 'undefined') {
        return id + '号店铺不存在'
      }
      return result.name
    },
    initMassager: function(filterParam) {
      getShops().then(data => {
        this.shops = data.content
      })
      getTimeShow(filterParam).then(data => {
        console.log(filterParam)
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].timeLineList.length; j++) {
            data[i].timeLineList[j].startTime = (''+data[i].timeLineList[j].startTime).substr(11)
            data[i].timeLineList[j].endTime = (''+data[i].timeLineList[j].endTime).substr(11)
          }
        }
        this.activities = data
      })
    }
  }
}
</script>
<style scoped lang="scss">
  h1,
  h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
    width: 100%;
  }
  a {
    color: #42b983;
  }
  // .main-wrapper{
  //     background-color: #fff;
  // }
  .processInfo {
    background-color: #fff;
  }
  .timeLineTitle {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */

    .timeLineItem {
      display: flex;
      padding: 20px;
      font-size: 12px;
      justify-content: center; /* 水平居中 */
      align-items: center; /* 垂直居中 */
    }
    .timeLineStatus {
      width: 12px;
      height: 10px;
      margin: 10px;
      border-radius: 2px;
    }
    .finish {
      background-color: #65bdaf;
    }
    .being {
      background-color: #eabd60;
    }
    .wating {
      background-color: #e2e9f9;
    }
    .timeOut {
      background-color: #ce3820;
    }
  }
</style>
<style lang="scss">
  .processInfo {
    overflow: auto;
    height: 100%;
    .el-timeline-item {
      padding-bottom: 120px;
    }
    .el-timeline-item__timestamp.is-top {
      position: absolute;
      left: -50px;
      color: #205081;
      /* font-weight: bold; */
      font-family: zcool-gdh;
      font-size: 12px;
    }
    .el-timeline-item__wrapper {
      padding: 0px 15px;
    }
    //   .timeLineDate .el-timeline-item:last-child .el-timeline-item__tail{
    //       display: none;

    //   }
  }
</style>
