<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">店铺ID</label>
        <el-select v-model="query.shopId" clearable placeholder="店铺名" style="width: 185px;" class="filter-item" @change="initMassager(query)" @keyup.enter.native="crud.toQuery">
          <el-option
            v-for="item in shops"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <label class="el-form-item-label">按摩师ID</label>
        <el-select v-model="query.massagerId" clearable placeholder="按摩师名" style="width: 185px;" class="filter-item" @change="crud.toQuery" @keyup.enter.native="crud.toQuery">
          <el-option
            v-for="item in workMassagers"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <label class="el-form-item-label">客人ID</label>
        <el-select v-model="query.guestId" clearable placeholder="客人名" style="width: 185px;" class="filter-item"@change="crud.toQuery"  @keyup.enter.native="crud.toQuery">
          <el-option
            v-for="item in guests"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <label class="el-form-item-label">开始时间</label>
        <el-date-picker
          @change="initMassager(query)"
          v-model="query.startTime"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        />
<!--        <label class="el-form-item-label">按摩评分</label>-->
<!--        <el-slider-->
<!--          v-model="query.mark"-->
<!--          range-->
<!--          show-stops-->
<!--          :max="5"-->
<!--        />-->
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form :inline="true" ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="店铺" prop="shopId">
            <el-select v-model="form.shopId" filterable placeholder="请选择">
              <el-option
                v-for="item in shops"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="按摩师" prop="massagerId">
            <el-select v-model="form.massagerId" filterable placeholder="请选择" @change="this.form.remedialId=this.form.massagerId" style="width: 150px;">
              <el-option
                v-for="item in workMassagers"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-select v-model="form.isAssign" filterable placeholder="请选择" style="width: 150px;">
              <el-option
                v-for="item in dict.is_assign"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-divider content-position="left"><i class="el-icon-bell"></i></el-divider>
          <el-form-item label="按摩时长" prop="duration">
            <el-input-number
              v-model="form.duration"
              :step="5" :min="0" :max="150" :rows="3" style="width: 150px;"
              @change="countEndTime(form)"
            />
            <el-tooltip :content="'加时'" placement="top">
              <el-input-number v-model="form.extraTime"  placeholder="加时" :step="5" :min="0" :max="150" :rows="3" style="width: 150px;" @change="countEndTime(form)" />
            </el-tooltip>

          </el-form-item>
          <el-form-item label="预约时间" prop="time">
              <el-time-select
                v-model="form.time"
                default-value="12:30"
                value-format="HH:mm"
                :picker-options="{
                start: '08:30',
                step: '00:05',
                end: '20:30'
              }"
                style="width: 120px;"
                @change="countStartTime($event)"
              />
              <el-date-picker v-model="form.endTime" type="datetime" style="width: 180px;" />
          </el-form-item>
          <el-divider content-position="left"><i class="el-icon-bank-card"></i></el-divider>
          <el-form-item label="现金刷卡">
            <el-tooltip :content="'现金'" placement="top">
              <el-input-number v-model="form.cash"  :precision="2" style="width: 150px;" @change="updateFormIncome(form)"/>
            </el-tooltip>
            <el-tooltip :content="'刷卡'" placement="top">
              <el-input-number v-model="form.card" :precision="2" style="width: 150px;" @change="updateFormIncome(form)"/>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="保险">
            <el-input-number v-model="form.insurance" :precision="2" style="width: 150px;" @change="updateFormIncome(form)"/>
            <el-select v-model="form.remedialId" style="width: 110px;" filterable placeholder="请选择">
              <el-option
                v-for="item in remedialMassagers"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-tooltip :content="'是否是保险'" placement="top">
              <el-switch
                v-model="form.insuranceStatus"
                inactive-color="#F4F4F5"
                active-color="#67C23A"
                active-value="Y"
                inactive-value="N">
              </el-switch>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="总收入">
            <el-input v-model="form.income" :disabled="true" style="width: 150px;" />
          </el-form-item>
          <el-divider content-position="left"><i class="el-icon-s-custom"></i></el-divider>
          <el-form-item label="客人评分">
            <el-select v-model="form.guestId" filterable placeholder="请选择" style="width: 150px;">
              <el-option
                v-for="item in guests"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                style="width: 150px;"
              />
            </el-select>
            <el-select v-model="form.mark" filterable placeholder="请选择" style="width: 150px;">
              <el-option
                v-for="item in dict.mark"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.info" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table show-summary :summary-method="getSummaries" ref="table" v-loading="crud.loading" :data="crud.data"
                :row-class-name="tableRowClassName" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column align="center"  type="selection" width="55" />
        <el-table-column align="center" prop="shopId" label="店铺ID">
          <template slot-scope="scope">
            {{ shopName(scope.row.shopId) }}
          </template>
        </el-table-column>
        <el-table-column align="center" sortable prop="massagerId" label="按摩师ID">
          <template slot-scope="scope">
            {{ massagerName(scope.row.massagerId) }}
          </template>
        </el-table-column>
<!--        <el-table-column prop="guestId" label="客人ID">-->
<!--          <template slot-scope="scope">-->
<!--            {{ guestName(scope.row.guestId) }}-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="isAssign" label="是否指定">-->
<!--          <template slot-scope="scope">-->
<!--            {{ dict.label.is_assign[scope.row.isAssign] }}-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column align="center" visEdit="true" prop="duration" label="按摩时长" />
        <el-table-column align="center" prop="extraTime" label="加时时长" >
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.extraTime" style="width: 85px;" size="mini" controls-position="right" :step="5" :min="0" :max="150" :rows="3" @change="andTime(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="remedialId" label="保险刷谁的">
          <template slot-scope="scope">
            <el-select size="mini" v-model="scope.row.remedialId" style="width: 90px;" filterable placeholder="请选择" @change="crud.crudMethod.edit(scope.row)">
              <el-option
                v-for="item in remedialMassagers"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </template>
        </el-table-column>
<!--        <el-table-column prop="mark" label="按摩评分">-->
<!--          <template slot-scope="scope">-->
<!--            {{ dict.label.mark[scope.row.mark] }}-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column align="center" prop="income" label="总金额" >
        </el-table-column>
        <el-table-column align="center" prop="cash" label="现金金额" >
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.cash"  style="width: 100px;" size="mini" controls-position="right" :precision="2" :step="1" :min="0" :max="150" :rows="3" @change="updateTableIncome(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="card" label="卡金额" >
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.card"  style="width: 100px;" size="mini" controls-position="right" :precision="2" :step="1" :min="0" :max="150" :rows="3" @change="updateTableIncome(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="insurance" label="保险金额" >
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.insurance"  style="width: 100px;" size="mini" controls-position="right" :precision="2" :step="1" :min="0" :max="150" :rows="3" @change="updateTableIncome(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column align="center" sortable prop="startTime" label="预约开始时间"
        width="130">
          <template slot-scope="scope">
            <el-time-select
              v-model="scope.row.time"
              size="mini"
              value-format="HH:mm"
              default-value="12:30"
              :picker-options="{
                start: '08:30',
                step: '00:05',
                end: '20:30'
              }"
              style="width: 100%"
              @change="changeStartTime(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="time2" label="预计结束时间" />
        <el-tooltip :content="'是否是保险'" placement="top">
          <el-table-column prop="info" label="备注" width="60"/>

        </el-tooltip>
        <el-table-column align="center" prop="insuranceStatus" label="保险" width="55">
          <template slot-scope="scope">
            <el-tooltip :content="'是否是保险'" placement="top">
              <el-switch
                v-model="scope.row.insuranceStatus"
                @change="crud.crudMethod.edit(scope.row)"
                inactive-color="#F4F4F5"
                active-color="#67C23A"
                active-value="Y"
                inactive-value="N">
              </el-switch>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="checkPer(['admin','massageRecord:edit','massageRecord:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudMassageRecord from '@/api/massage/massageRecord'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getMassagers } from '@/api/massage/massager'
import { getGuests } from '@/api/massage/guest'
import { getShops } from '@/api/massage/shop'
import myDatepicker from 'vue-datepicker/vue-datepicker-es6.vue'
import moment from 'moment'
import {getWorkMassagers} from '@/api/massage/shopMassager'

const defaultForm = { id: null, shopId: 1, massagerId: 16, guestId: 2, isAssign: "0", duration: 30, remedialId: 16, mark: 5, income: 0, cash: 0, card: 0, insurance: 0,extraTime: 0, startTime: new Date(), endTime: null, time:null, time2:null,insuranceStatus:"N",info:null}
export default {
  name: 'MassageRecord',
  components: { pagination, crudOperation, rrOperation, udOperation, myDatepicker },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['is_assign', 'mark'],
  cruds() {
    return CRUD({ title: '记录', url: 'api/massageRecord', idField: 'id', sort: ['startTime,desc','id,desc'], crudMethod: { ...crudMassageRecord }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'massageRecord:add'],
        edit: ['admin', 'massageRecord:edit'],
        del: ['admin', 'massageRecord:del']
      },
      rules: {
        shopId: [
          { required: true, message: '店铺ID不能为空', trigger: 'blur' }
        ],
        massagerId: [
          { required: true, message: '按摩师ID不能为空', trigger: 'blur' }
        ],
        isAssign: [
          { required: true, message: '是否指定不能为空', trigger: 'blur' }
        ],
        duration: [
          { required: true, message: '按摩时长不能为空', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请调整时间', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'shopId', display_name: '店铺ID' },
        { key: 'massagerId', display_name: '按摩师ID' },
        { key: 'guestId', display_name: '客人ID' },
        { key: 'mark', display_name: '按摩评分' },
        {key:'startTime',display_name: '开始时间'}
      ],
      workMassagers: [{
        id:16,
        name:"默认"
      }],
      massagers: [{
        id:16,
        name:"默认"
      }],
      remedialMassagers: [{
        id:16,
        name:"默认"
      }],
      guests: [],
      shops: [],
      filterParam: {
        shopId: 1,
        nowDay: new Date()
      },
      initDate:[
        moment(new Date().setHours(0,0,0)).format('YYYY-MM-DD HH:mm:ss'),
        moment(new Date().setHours(23,59,59)).format('YYYY-MM-DD HH:mm:ss')
      ]
    }
  },
  mounted() {
    this.countEndTime(this.form)
    this.initMassager(this.query)

  },
  created() {
    this.$set(this.query,'startTime',this.initDate)
    this.$set(this.query,'shopId',1)
    this.$set(this.form,'time',new Date().format('HH:mm'))
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    initMassager: function(queryParam) {
      if (queryParam.shopId !== undefined&&queryParam.shopId !==null) {
        this.filterParam.shopId = queryParam.shopId
      }
      if (queryParam.startTime !== undefined&&queryParam.startTime !== null) {
        this.filterParam.nowDay = queryParam.startTime[0]
      }
      let param = this.filterParam
      getWorkMassagers(param).then(data => {
        if (data== undefined||data.length == 0) {
          return;
        }
        this.workMassagers = this.workMassagers.concat(data)

      })
      // 所有按摩师
      getMassagers().then(data => {
        this.massagers = data.content
        this.remedialMassagers = data.content.filter(function (value, index, array) {
          return value.isDiplomate == "1";
        })
      })
      getGuests().then(data => {
        this.guests = data.content
      })
      getShops().then(data => {
        this.shops = data.content
      })
      this.crud.toQuery(queryParam)
    },
    massagerName(id) {
      const result = this.massagers.find(item => item.id == id)
      if (typeof result === 'undefined') {
        return id + '号按摩师不存在'
      }
      return result.name
    },
    guestName(id) {
      const result = this.guests.find(item => item.id == id)
      if (typeof result === 'undefined') {
        return id + '号客人不存在'
      }
      return result.name
    },
    shopName(id) {
      const result = this.shops.find(item => item.id == id)
      if (typeof result === 'undefined') {
        return id + '号店铺不存在'
      }
      return result.name
    },
    countStartTime(event) {
      var nowD = new Date()
      nowD.setHours((event+'').substr(0,2))
      nowD.setMinutes((event+'').substr(3,2))
      // todo 是否有时区问题
      this.form.startTime = moment(nowD).format('YYYY-MM-DD HH:mm:ss')
      var d = new Date()
      d.setTime(Date.parse(this.form.startTime) + 60000 * (this.form.duration+this.form.extraTime))
      this.form.endTime = moment(d).format('YYYY-MM-DD HH:mm:ss')
    },
    countEndTime(data) {
      var d = new Date()
      d.setTime(Date.parse(data.startTime) + 60000 * (data.duration+data.extraTime))
      data.endTime = d
      console.log(data)
    },
    andTime(data) {
      var d = new Date()
      d.setTime(Date.parse(data.startTime) + 60000 * (data.duration+data.extraTime))
      data.endTime = moment(d).format('YYYY-MM-DD HH:mm:ss')
      this.crud.crudMethod.edit(data)
    },
    countTableTime(data) {
      var nowD = new Date()
      nowD.setHours((data.time+'').substr(0,2))
      nowD.setMinutes((data.time+'').substr(3,2))
      // 是否有时区问题
      data.startTime = moment(nowD).format('YYYY-MM-DD HH:mm:ss')
      var d = new Date()
      d.setTime(Date.parse(data.startTime) + 60000 * (data.duration+data.extraTime))
      data.endTime = moment(d).format('YYYY-MM-DD HH:mm:ss')
      return data
    },
    changeStartTime(data) {
      data = this.countTableTime(data)
      this.crud.crudMethod.edit(data)
    },
    // 表格颜色方法
    tableRowClassName({row, rowIndex}) {
      // 周六日 五点整，周四是九点整，其余时间五点半
      let closedTime = new Date()
      var week = "星期" + "日一二三四五六".charAt(closedTime.getDay());

      if (closedTime.getDay() === 0 || closedTime.getDay() === 6) {
        closedTime.setHours(17)
        closedTime.setMinutes(5)
        closedTime.setSeconds(0)
      }else if (closedTime.getDay() === 4) {
        closedTime.setHours(21)
        closedTime.setMinutes(5)
        closedTime.setSeconds(0)
      }else {
        closedTime.setHours(17)
        closedTime.setMinutes(35)
        closedTime.setSeconds(0)
      }
      // 周六日 五点整，周四是九点整，其余时间五点半
      let rowEndTime = row.endTime;

      if (row.isAssign === "1") {
        return 'frequenter-row';
      } else if (row.insuranceStatus === "Y") {
        return 'insurance-row';
      }else if (row.extraTime >= 15) {
        return 'addTime-row'
      }else if(Date.parse(rowEndTime)>closedTime){
        return 'addTime-row'
      }
      return '';
    },
    // 更新表格总收入
    updateTableIncome(data){
      if (data.cash == undefined) {
        data.cash = 0
      }
      if (data.card == undefined) {
        data.card = 0
      }
      if (data.insurance == undefined) {
        data.insurance = 0
      }
      console.log(data.insurance)

      if (data.insurance !== 0) {
        data.insuranceStatus = 'Y'
      }else {
        data.insuranceStatus = 'N'
      }
      //关系：总金额=其余所有相加
      data.income = data.cash+data.insurance+data.card
      // 更新数据
      this.crud.crudMethod.edit(data)
    },
    // 更新表单总收入
    updateFormIncome(data){
      if (data.cash == undefined) {
        data.cash = 0
      }
      if (data.card == undefined) {
        data.card = 0
      }
      if (data.insurance == undefined) {
        data.insurance = 0
      }
      console.log(data.insurance)

      if (data.insurance !== 0) {
        data.insuranceStatus = 'Y'
      }else {
        data.insuranceStatus = 'N'
      }
      //关系：总金额=其余所有相加
      data.income = data.cash+data.insurance+data.card
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价';
          return;
        }
        if (index === 1) {
          sums[index] = '店铺';
          return;
        }
        if (index === 2) {
          sums[index] = '按摩师';
          return;
        }
        if (index === 5) {
          sums[index] = '保险人';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          if (index === 3 || index === 4) {
            sums[index] += ' mins'
          } else {
            sums[index] += ' 元';
          }
        } else {
          sums[index] = '---';
        }
      });

      return sums;
    }
  }
}
</script>
<style>
  .el-table__row{
    text-align: center;
  }
  .el-table .addTime-row {
    background: #fbcd77;
  }

  .el-table .frequenter-row {
    background: #b3d2f1;
  }

  .el-table .insurance-row {
    background: #d0f1be;
  }
</style>
<style scoped>

  /*.el-slider__runway {*/
  /*  width: 27%;*/
  /*  height: 6px;*/
  /*  margin: 16px 0;*/
  /*  background-color: #dfe4ed;*/
  /*  border-radius: 3px;*/
  /*  position: relative;*/
  /*  cursor: pointer;*/
  /*  vertical-align: middle;*/
  /*}*/
</style>

