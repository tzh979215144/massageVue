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
            v-for="item in massagers"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <label class="el-form-item-label">客人ID</label>
        <el-select v-model="query.guestId" clearable placeholder="客人名" style="width: 185px;" class="filter-item" @change="crud.toQuery" @keyup.enter.native="crud.toQuery">
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
        <label class="el-form-item-label">预约状态</label>
        <el-select v-model="query.status" clearable value="0" style="width: 185px;" class="filter-item" @change="crud.toQuery" @keyup.enter.native="crud.toQuery" >
          <el-option
            v-for="item in dict.appointment_status"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <el-button :loading="crud.status.cu === 2" type="success" plain round icon="el-icon-check" size="mini" @click="arrivedShopAll(crud.data)">一键已到店</el-button>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="true" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
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
            <el-select v-model="form.massagerId" filterable placeholder="请选择">
              <el-option
                v-for="item in massagers"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="客人">
            <el-select v-model="form.guestId" filterable placeholder="请选择">
              <el-option
                v-for="item in guests"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否指定按摩师">
            <el-select v-model="form.isAssign" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.is_assign"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="按摩时长（按分钟算）" prop="duration">
            <el-input-number
              v-model="form.duration"
              :step="5" :min="0" :max="150" :rows="3" style="width: 195px;"
              @change="countEndTime($event,'duration')"
            />
          </el-form-item>
          <el-form-item label="加时时长">
            <el-input-number v-model="form.extraTime"  :step="5" :min="0" :max="150" :rows="3" style="width: 195px;" @change="countEndTime($event,'extraTime')" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.info" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="预约开始时间">
            <el-time-select
              v-model="form.time"
              default-value="12:30"
              value-format="HH:mm:ss"
              :picker-options="{
                start: '08:30',
                step: '00:05',
                end: '20:30'
              }"
              style="width: 370px;"
              @change="countStartTime($event)"
            />
          </el-form-item>
          <el-form-item label="预计结束时间">
            <el-date-picker v-model="form.endTime" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="保险">
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
          <el-form-item label="预约状态">
            <el-select v-model="form.status" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.appointment_status"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small"
                :row-class-name="tableRowClassName" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="shopId" label="店铺">
          <template slot-scope="scope">
            {{ shopName(scope.row.shopId) }}
          </template>
        </el-table-column>
        <el-table-column prop="massagerId" label="按摩师">
          <template slot-scope="scope">
            {{ massagerName(scope.row.massagerId) }}
          </template>
        </el-table-column>
        <el-table-column prop="guestId" label="客人">
          <template slot-scope="scope">
            {{ guestName(scope.row.guestId) }}
          </template>
        </el-table-column>
        <el-table-column prop="isAssign" label="是否指定按摩师">
          <template slot-scope="scope">
            <el-select v-model="scope.row.isAssign" filterable @change="crud.crudMethod.edit(scope.row)">
              <el-option
                v-for="item in dict.is_assign"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="按摩时长" />
        <el-table-column prop="extraTime" label="加时时长" >
          <template slot-scope="scope">
              <el-input-number v-model="scope.row.extraTime" style="width: 85px;" controls-position="right" :step="5" :min="0" :max="150" :rows="3" @change="andTime(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="预约开始时间" >
          <template slot-scope="scope">
            <el-time-select
              v-model="scope.row.time"
              value-format="HH:mm"
              default-value="12:30"
              :picker-options="{
                start: '08:30',
                step: '00:05',
                end: '20:30'
              }"
              style="width:100%"
              @change="changeStartTime(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="预计结束时间" />
        <el-table-column prop="status" label="预约状态">
          <template slot-scope="scope">
            <el-select v-model="scope.row.status" filterable @change="crud.crudMethod.edit(scope.row)" style="background: grey">
              <el-option
                v-for="item in dict.appointment_status"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="info" label="备注" >
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.info" placement="top" effect="light">
              <el-input v-model="scope.row.info" style="width: 85px;" :step="5" :min="0" :max="150" :rows="3" @change="crud.crudMethod.edit(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="insuranceStatus" label="保险" width="55">
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
        <el-table-column v-if="checkPer(['admin','massageBooking:edit','massageBooking:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
            <el-button :loading="crud.status.cu === 2" type="success" plain round icon="el-icon-check" size="mini" @click="arrivedShop(scope.row)">已到店</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudMassageBooking from '@/api/massage/massageBooking'
import { confirm } from '@/api/massage/massageBooking'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getMassagers } from '@/api/massage/massager'
import { getGuests } from '@/api/massage/guest'
import { getShops } from '@/api/massage/shop'
import { addFromBooking } from '@/api/massage/massageRecord'
import moment from 'moment'
import {getWorkMassagers} from '@/api/massage/shopMassager'

const defaultForm = { id: null, shopId: 1, massagerId: 16, guestId: 2, isAssign: "0", duration: 30, extraTime: 0,startTime: new Date(), endTime: null, status: "0", time:null, insuranceStatus:"N",info:null}
export default {
  name: 'MassageBooking',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['is_assign', 'appointment_status'],
  cruds() {
    return CRUD({ title: 'appointment', url: 'api/massageBooking', idField: 'id', sort: 'id,desc', crudMethod: { ...crudMassageBooking }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'massageBooking:add'],
        edit: ['admin', 'massageBooking:edit'],
        del: ['admin', 'massageBooking:del']
      },
      rules: {
        shopId: [
          { required: true, message: '店铺ID不能为空', trigger: 'blur' }
        ],
        massagerId: [
          { required: true, message: '按摩师ID不能为空', trigger: 'blur' }
        ],
        duration: [
          { required: true, message: '按摩时长（按分钟算）不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'shopId', display_name: '店铺ID' },
        { key: 'isAssign', display_name: '是否指定按摩师' },
        { key: 'duration', display_name: '按摩时长（按分钟算）' },
        { key: 'status', display_name: '预约状态' },
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
    this.countEndTime(1,'init')
    this.initMassager(this.query)
  },
  computed: {
  },
  created() {
    this.query.shopId = 1
    this.query.status="0"
    this.$set(this.query,'startTime',this.initDate)
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
    arrivedShop(param) {
      if (param.status == "1") {
        return
      }
      param.status = "1"
      crudMassageBooking.edit(param).then(data => {
      })
      param.remedialId = param.massagerId
      param.mark = 5
      addFromBooking(param).then(data => {
        this.$notify({
          title: '确认到店成功',
          type: 'success',
          duration: 2500
        })
      })
    },
    arrivedShopAll(param) {
      let params = param.filter((item)=> {
        return (item.status == '0')
      })
      confirm(params).then(data => {
        this.$notify({
          title: '确认到店成功',
          type: 'success',
          duration: 2500
        })
        // 使用this才可以调用crud的方法
        this.crud.refresh()
      })
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
    countEndTime(event,type) {
      if (type === 'duration') {
        this.form.duration = event
      }
      if (type === 'extraTime') {
        this.form.extraTime = event
      }
      if(type === 'init'){
      }
      var d = new Date()
      d.setTime(Date.parse(this.form.startTime) + 60000 * (this.form.duration+this.form.extraTime))
      this.form.endTime = d
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
    }
  }
}
</script>

<style scoped>
</style>
<style>
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
