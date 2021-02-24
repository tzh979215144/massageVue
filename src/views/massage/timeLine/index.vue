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
import { getTimeShow } from '@/api/massage/timeShow'
import timeLine from './timeLine'
export default {
  components: { timeLine },
  data() {
    return {
      openAccountProcessLoading: false,
      activities: [],
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
            {
              status: 'finish',
              startTime: '10：30',
              endTime: '11: 20',
              duration: 50,
              info: '普通'
            },
            {
              status: 'finish',
              startTime: '11：30',
              endTime: '12: 30',
              duration: 60,
              info: '普通'
            },
            {
              status: 'finish',
              startTime: '12：40',
              endTime: '13: 20',
              duration: 40,
              info: '老客'
            },
            {
              status: 'being',
              startTime: '14：50',
              endTime: '15: 40',
              duration: 50,
              info: '普通'
            },
            {
              status: 'wating',
              startTime: '15：50',
              endTime: '16: 20',
              duration: 30,
              info: '普通'
            },
            {
              status: 'wating',
              startTime: '16：30',
              endTime: '17: 30',
              duration: 60,
              info: '保险'
            }
          ]
        },
        {
          massager: 'Rong',
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
            {
              status: 'finish',
              startTime: '10：30',
              endTime: '11: 20',
              duration: 50,
              info: '普通'
            },
            {
              status: 'finish',
              startTime: '11：30',
              endTime: '12: 30',
              duration: 60,
              info: '普通'
            },
            {
              status: 'finish',
              startTime: '12：40',
              endTime: '13: 20',
              duration: 40,
              info: '老客'
            },
            {
              status: 'being',
              startTime: '14：50',
              endTime: '15: 40',
              duration: 50,
              info: '普通'
            },
            {
              status: 'wating',
              startTime: '15：50',
              endTime: '16: 20',
              duration: 30,
              info: '普通'
            },
            {
              status: 'wating',
              startTime: '16：30',
              endTime: '17: 30',
              duration: 60,
              info: '保险'
            }
          ]
        }
      ]
    }
  },
  created() {
    this.initMassager()
  },
  methods: {
    initMassager: function() {
      getTimeShow().then(data => {
        console.log(data)
        this.activities = data
        for (var i = 0; i < this.activities.length; i++) {
          for (var j = 0; j < this.activities[i].timeLineList.length; j++) {
            this.activities[i].timeLineList[j].startTime = this.activities[i].timeLineList[j].startTime.slice(11)
            this.activities[i].timeLineList[j].endTime = this.activities[i].timeLineList[j].endTime.slice(11)
          }
        }
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
