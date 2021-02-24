<template>
  <!--时间线-->
  <div style="display:flex; width:95%" class="timeLineClass">
    <!-- 当日志记录不超过9个，全排列 -->
    <div v-if="timeLineList.length<16" class="container">
      <div style="display:flex;">
        <div
          v-for="(item,index) in timeLineList"
          v-if="index>=0 && index<timeLineList.length-1"
          :key="index"
          style="flex:1;display:flex;flex-direction:column;"
        >
          <div style="display:flex">
            <div class="item" />
            <div
              class="dot"
              :class="{active: index === timeIndex}"
              @mouseover="changeActive(index)"
            />
            <div
              class="line"
              :class="{active: index === timeIndex}"
              :style="{width: timeLineList[index].duration+'px'}"
              @mouseover="changeActive(index)"
            />
            <div
              class="dot"
              :class="{active: index === timeIndex}"
              @mouseover="changeActive(index)"
            />
            <div class="item" />
          </div>
          <div class="item_top">
            <span v-if="timeLineList[index].startTime">{{ timeLineList[index].startTime }}</span>
            <span style="color: #00a0e9"> 到 </span>
            <span v-if="timeLineList[index].endTime">{{ timeLineList[index].endTime }}</span>
          </div>
          <el-tooltip effect="light" placement="top">
            <div slot="content">{{ timeLineList[index].info }}</div>
            <div class="item_bottom">
              <div
                class="itemBot_list"
                :style="{backgroundColor:(timeLineList[index].status =='finish' ? '#65bdaf' :(timeLineList[index].status =='3'?'#eabd60':(timeLineList[index].status =='0'?'#e2e9f9':(timeLineList[index].status =='4'?'#ce3820':''))))}"
              >{{ timeLineList[index].info }}</div>
            </div>
          </el-tooltip>
          <!-- 横时间轴分支 -->
          <div
            v-if="timeLineList[index].timeLineBranch && timeLineList[index].timeLineBranch.length>0"
            class="timeLineBranch"
          >
            <el-timeline>
              <el-timeline-item
                v-for="(itemBranch,indexBranch) in timeLineList[index].timeLineBranch"
                :key="indexBranch"
                :timestamp="itemBranch.timestamp"
              >
                <!-- {{itemBranch.info}} -->
                <div :style="{color:(itemBranch.status =='finish' ? '#65bdaf' :(itemBranch.status =='being'?'#eabd60':(itemBranch.status =='wating'?'#e2e9f9':(itemBranch.status =='timeOut'?'#ce3820':''))))}">{{ itemBranch.info }}</div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;">
          <div style="display:flex">
            <div class="item" />
            <div
              class="dot"
              :class="{active: timeLineList.length-1 === timeIndex}"
              @mouseover="changeActive(timeLineList.length-1)"
            />
            <div style="flex:1;" />
          </div>
          <div class="item_top">
            <span>{{ timeLineList[timeLineList.length-1].timestamp }}</span>
          </div>
          <el-tooltip effect="light" placement="top">
            <div slot="content">{{ timeLineList[timeLineList.length-1].info }}</div>
            <div class="item_bottom">
              <div
                class="itemBot_list"
                :style="{backgroundColor:(timeLineList[timeLineList.length-1].status =='finish' ? '#65bdaf' :(timeLineList[timeLineList.length-1].status =='being'?'#eabd60':(timeLineList[timeLineList.length-1].status =='wating'?'#e2e9f9':(timeLineList[timeLineList.length-1].status =='timeOut'?'#ce3820':''))))}"
              >{{ timeLineList[timeLineList.length-1].info }}</div>
            </div>
          </el-tooltip>
          <!-- 横时间轴分支 -->
          <div
            v-if="timeLineList[timeLineList.length-1].timeLineBranch && timeLineList[timeLineList.length-1].timeLineBranch.length>0"
            class="timeLineBranch"
          >
            <el-timeline>
              <el-timeline-item
                v-for="(itemBranch,indexBranch) in timeLineList[timeLineList.length-1].timeLineBranch"
                :key="indexBranch"
                :timestamp="itemBranch.timestamp"
              >
                <div :style="{color:(itemBranch.status =='finish' ? '#65bdaf' :(itemBranch.status =='being'?'#eabd60':(itemBranch.status =='wating'?'#e2e9f9':(itemBranch.status =='timeOut'?'#ce3820':''))))}">{{ itemBranch.info }}</div>
              </el-timeline-item>
              <!-- <el-timeline-item timestamp="2018/4/12"></el-timeline-item> -->
            </el-timeline>
          </div>
        </div>
      </div>
    </div>
    <!-- 当日志记录超过8个，可以左右滑动 -->
    <div v-else class="container">
      <div style="display:flex;">
        <div style="flex:1;display:flex;flex-direction:column">
          <!-- <div style="flex:1;display:flex;"> -->
          <div style="display:flex;">
            <!-- <div style="flex:1;"></div> -->
            <div class="item" />
            <div
              class="move-button el-icon-arrow-left"
              :class="{active: left_button_active}"
              :disabled="left_button_disabled"
              @click="moveLeft()"
            />
            <div class="item" />
          </div>
          <div class="item_top">
            <span style="color:#000;">左</span>
          </div>
          <!-- <div class="item_bottom">
            <div class="itemBot_end"></div>
          </div>-->
        </div>

        <div
          v-for="(item,index) in timeLineList"
          v-if="index >= point && index <= point_end"
          :key="index"
          style="flex:1;display:flex;flex-direction:column;"
        >
          <div style="display:flex">
            <div class="item" />
            <div
              class="dot"
              :class="{active: index === timeIndex}"
              @mouseover="changeActive(index)"
            />
            <div class="item" />
          </div>
          <div class="item_top">
            <span>{{ timeLineList[index].timestamp }}</span>
          </div>
          <el-tooltip effect="light" placement="top">
            <div slot="content">{{ timeLineList[index].info }}</div>
            <div class="item_bottom">
              <div
                class="itemBot_list"
                :style="{backgroundColor:(timeLineList[index].status =='finish' ? '#65bdaf' :(timeLineList[index].status =='being'?'#eabd60':(timeLineList[index].status =='wating'?'#e2e9f9':(timeLineList[index].status =='timeOut'?'#ce3820':''))))}"
              >{{ timeLineList[index].info }}</div>
            </div>
          </el-tooltip>
          <!-- 横时间轴分支 -->
          <div
            v-if="timeLineList[index].timeLineBranch && timeLineList[index].timeLineBranch.length>0"
            class="timeLineBranch"
          >
            <el-timeline>
              <el-timeline-item
                v-for="(itemBranch,indexBranch) in timeLineList[index].timeLineBranch"
                :key="indexBranch"
                :timestamp="itemBranch.timestamp"
              >
                <div :style="{color:(itemBranch.status =='finish' ? '#65bdaf' :(itemBranch.status =='being'?'#eabd60':(itemBranch.status =='wating'?'#e2e9f9':(itemBranch.status =='timeOut'?'#ce3820':''))))}">{{ itemBranch.info }}</div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;">
          <div style="display:flex">
            <div class="item" />
            <div
              class="move-button el-icon-arrow-right"
              :class="{active: right_button_active}"
              :disabled="right_button_disabled"
              @click="moveRight()"
            />
            <div style="flex:1;" />
          </div>
          <div class="item_top">
            <span style="color:#000;">右</span>
          </div>
          <!-- <div class="item_bottom">
            <div class="itemBot_end"></div>
          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimeLine',
  props: ['timeLineList'],
  data() {
    return {
      timeIndex: this.timeLineList.length - 1, // 默认当前选择的为最近的时间点
      point: this.timeLineList.length - 9, // 时间轴只展示9个,初始为最后9个
      point_end: this.timeLineList.length - 1,
      right_button_active: false,
      left_button_active: true,
      left_button_disabled: false,
      right_button_disabled: true
    }
  },
  methods: {
    changeActive(index) {
      this.timeIndex = index
      console.log('悬浮选择的时间点：', this.timeIndex)
    },
    moveLeft() {
      if (this.point > 0) {
        this.point -= 1
        this.point_end -= 1
        this.timeIndex -= 1
        this.right_button_disabled = false
        this.right_button_active = true
        if (this.point === 0) {
          // 如果移到第一个时间点，设置左按钮不可点击
          this.left_button_disabled = true
          this.left_button_active = false
        }
      }
    },
    moveRight() {
      if (this.point_end < this.timeLineList.length - 1) {
        this.point += 1
        this.point_end += 1
        this.timeIndex += 1
        this.left_button_disabled = false
        this.left_button_active = true
        console.log('————————————', this.timeIndex)
        if (this.point_end === this.timeLineList.length - 1) {
          // 如果移到最后一个时间点，设置右按钮不可点击
          this.right_button_disabled = true
          this.right_button_active = false
        }
      }
    }
  }
}
</script>

<style scoped lang='scss'>
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
    width: 100%;
  }
  .container {
    width: 100%;
    height: 30px;
    margin-left: 0px;
    padding-left: 0px;
    margin-bottom: 5px;
  }
  .dot {
    border: 2px solid #dcdfe6;
    width: 15px;
    height: 15px;
    border-radius: 15px;
    //   background: white;
    background: #499cf0;
    margin: 2px 0px;
    box-sizing: border-box;
  }
  .line {
    border: 2px solid #dcdfe6;
    width: 100px;
    height: 5px;
    border-radius: 15px;
    //   background: white;
    background: #499cf0;
    margin: 6px 0px;
    box-sizing: border-box;
  }
  .item {
    flex: 1;
    border-bottom: 1px solid #dcdfe6;
    margin-bottom: 9px;
    box-sizing: border-box;
    min-width: 100px;
  }
  .item_top {
    //   flex: 1;
    text-align: center;
    height: 15px;
    margin-top: -40px;
    font-size: 14px;
  }
  .item_bottom {
    flex: 1;
    text-align: center;
    height: 15px;
    margin-top: 24px;
    font-size: 12px;
    .itemBot_list {
      padding: 4px 8px;
      border-radius: 5px;
      background-color: #6bb9ba;
      height: 26px;
      width: 100px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
      vertical-align: middle;
    }
    .itemBot_end {
      height: 26px;
      visibility: hidden;
    }
  }
  .move-button {
    border: 2px solid #dcdfe6;
    width: 40px;
    height: 19px;
    border-radius: 19px;
    background: white;
    text-align: center;
    box-sizing: border-box;
  }
  .active {
    background-color: #fff !important;
    //   border: 3px solid #67c23a;
    border: 3px solid #499cf0;
  }
</style>
<style lang="scss">
  .timeLineClass {
    .timeLineBranch {
      // display: flex;
      // justify-content: center;
      position: relative;
      // min-height: 45px;
      height: 90px;
      overflow-y: auto;
      overflow-x:hidden;
      .el-timeline {
        //   width: 30px; //和 itemBot_list的width一样宽
        position: absolute;
        left: 50%;
        /* padding-top: 1px; */
        /* height: 100%; */
        margin-left: -12px;
      }
      .el-timeline-item {
        padding-bottom: 10px;
      }
    }
    //横轴时间轴 分支左边时间
    .el-timeline-item__timestamp.is-bottom {
      font-size: 12px;
      // white-space: nowrap;
      margin-top: 3px;
      position: absolute;
      left: -100px;
      top: 0px;
      text-align: right;
      min-width: 100px;
      padding: 0 5px;
      // margin-left: -60px;
      // float: left;
    }
    //横轴时间轴 分支右边内容
    .el-timeline-item__content {
      font-size: 12px;
      margin-top: 1px;
      // white-space: nowrap;
      // float: right;
      // margin-right: -40px;
    }

    .el-timeline .el-timeline-item .el-timeline-item__tail {
      position: absolute;
      left: 4px;
      height: 100%;
      border-left: 2px solid #e4e7ed;
      display: block;
    }
    .el-timeline .el-timeline-item:last-child .el-timeline-item__tail {
      display: none;
    }
  }
</style>
