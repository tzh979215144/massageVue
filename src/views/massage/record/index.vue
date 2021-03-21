<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">店铺</label>
        <el-select v-model="query.shopId" clearable placeholder="店铺名" style="width: 130px;" class="filter-item" @change="initMassager(query)" @keyup.enter.native="crud.toQuery">
          <el-option
            v-for="item in shops"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <label class="el-form-item-label">按摩师</label>
        <el-select v-model="query.massagerId" clearable placeholder="按摩师名" style="width: 130px;" class="filter-item" @change="crud.toQuery" @keyup.enter.native="crud.toQuery">
          <el-option
            v-for="item in workMassagers"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
<!--        <label class="el-form-item-label">客人ID</label>-->
<!--        <el-select v-model="query.guestId" clearable placeholder="客人名" style="width: 185px;" class="filter-item" @change="crud.toQuery"  @keyup.enter.native="crud.toQuery">-->
<!--          <el-option-->
<!--            v-for="item in guests"-->
<!--            :key="item.id"-->
<!--            :label="item.name"-->
<!--            :value="item.id"-->
<!--          />-->
<!--        </el-select>-->
        <label class="el-form-item-label">Day</label>
        <el-date-picker
          class="filter-item"
          @change="initMassager(query)"
          v-model="query.startTime"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        />
        <label class="el-form-item-label">老客</label>
        <el-select v-model="query.isAssign" clearable placeholder="请选择" class="filter-item" @change="crud.toQuery" style="width: 100px;">
          <el-option
            v-for="item in dict.is_assign"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <label class="el-form-item-label">保险</label>
        <el-select v-model="query.insuranceStatus" clearable placeholder="请选择" class="filter-item" @change="crud.toQuery" style="width: 100px;">
          <el-option
            v-for="item in insuranceStatusList"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

<!--        <label class="el-form-item-label">按摩评分</label>-->
<!--        <el-slider-->
<!--          v-model="query.mark"-->
<!--          range-->
<!--          show-stops-->
<!--          :max="5"-->
<!--        />-->
        <rrOperation :crud="crud" />
        <div slot = 'right' class="timeLineTitle">
          <div class="timeLineItem">
            <div class="addTimeTip timeLineStatus" />
            <div>加班加时</div>
          </div>
          <div class="timeLineItem">
            <div class="frequenterTip timeLineStatus" />
            <div>老客</div>
          </div>
          <div class="timeLineItem">
            <div class="insuranceTip timeLineStatus" />
            <div>保险</div>
          </div>
          <div class="timeLineItem">
            <div class="toleranceStart timeLineStatus" />
            <div>建议推迟开始</div>
          </div>
          <div class="timeLineItem">
            <div class="toleranceEnd timeLineStatus" />
            <div>建议推迟预约时间</div>
          </div>
        </div>
      </div>

      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" >
        <div slot = 'right' class="timeLineTitle">
            <el-tag size="small" type="">{{incomeLevel.nowLevel}}</el-tag>
            <el-tooltip class="item" effect="light" placement="top-start">
              <div slot="content">
                　<span>距离 {{incomeLevel.closestLevel}} 还有：${{incomeLevel.diffIncome}}</span>
              </div>
              <el-progress status="success" :text-inside="true" :stroke-width="26" :percentage="updateLevelPercentage()"></el-progress>
            </el-tooltip>
            <el-tag size="medium" type="danger">{{incomeLevel.closestLevel}}</el-tag>
        </div>


      </crudOperation>
      <label class="el-form-item-label">预约时间</label>
      <el-time-select
        class="filter-item"
        v-model="tableFilter.startTime"
        default-value="12:30"
        value-format="HH:mm"
        :picker-options="{
                start: '08:30',
                step: '00:05',
                end: '20:30'
              }"
        style="width: 120px;"
      />
      <label class="el-form-item-label">时长</label>
      <el-input-number
        class="filter-item"
        v-model="tableFilter.duration"
        :step="5" :min="0" :max="150" :rows="3" style="width: 150px;"
      />
      <label class="el-form-item-label">Tolerance</label>
      <el-input-number
        class="filter-item"
        v-model="tableFilter.tolerance"
        :step="5" :min="0" :max="150" :rows="3" style="width: 150px;"
      />
      <el-button :loading="crud.status.cu === 2" type="success" class="filter-item" plain round icon="el-icon-check" size="mini" @click="handlesearch(crud.data)">查询时间安排</el-button>
      <label class="el-form-item-label">Lucky One</label>
      <el-select v-model="lastWorkMassager.id" filterable placeholder="请选择" class="filter-item" @focus="updateWorkMassagers(query)"  style="width: 130px;">
        <el-option
          v-for="item in workMassagers"
          :key="item.id"
          :label="item.name"
          :value="item.id"
          :disabled="true"
          class="lastWorker"
          :style="{'background-color':item.status == 'ing'?'#9ec3bd':'#FFFFFF'}">
          <span style="float: left">{{ item.name }}</span>
          <span v-if="{Ing:item.status == 'ing'}" style="float: right; color: #a6404d; font-size: 13px">{{ item.endTime }}</span>
        </el-option>
      </el-select>
      <label class="el-form-item-label">状态</label>
      <el-select v-model="query.orderStatus" clearable style="width: 130px;" class="filter-item" @change="crud.toQuery" @keyup.enter.native="crud.toQuery" >
        <el-option
          v-for="item in dict.appointment_status"
          :key="item.id"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
<!--      <div class="timeLineTitle">-->
<!--        <div class="timeLineItem">-->
<!--          <div class="addTimeTip timeLineStatus" />-->
<!--          <div>加班加时</div>-->
<!--        </div>-->
<!--        <div class="timeLineItem">-->
<!--          <div class="frequenterTip timeLineStatus" />-->
<!--          <div>老客</div>-->
<!--        </div>-->
<!--        <div class="timeLineItem">-->
<!--          <div class="insuranceTip timeLineStatus" />-->
<!--          <div>保险</div>-->
<!--        </div>-->
<!--        <div class="timeLineItem">-->
<!--          <div class="toleranceStart timeLineStatus" />-->
<!--          <div>建议推迟开始</div>-->
<!--        </div>-->
<!--        <div class="timeLineItem">-->
<!--          <div class="toleranceEnd timeLineStatus" />-->
<!--          <div>建议推迟预约时间</div>-->
<!--        </div>-->
<!--      </div>-->
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form class="normal" :inline="true" ref="form" :model="form" :rules="rules" size="small" label-width="80px">
<!--          <el-form-item label="店铺" prop="shopId">-->
<!--            <el-select v-model="form.shopId" filterable placeholder="请选择" style="width: 130px;">-->
<!--              <el-option-->
<!--                v-for="item in shops"-->
<!--                :key="item.id"-->
<!--                :label="item.name"-->
<!--                :value="item.id"-->
<!--              />-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <el-form-item label="按摩师" prop="massagerId">
            <el-select v-model="form.massagerId" filterable placeholder="请选择" @focus="updateWorkMassagers(query)"  style="width: 130px;">
              <el-option
                v-for="item in workMassagers"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                :class="{Ing:item.status == 'ing'}">
                <span style="float: left">{{ item.name }}</span>
                <span v-if="{Ing:item.status == 'ing'}" style="float: right; color: #a6404d; font-size: 13px">{{ item.endTime }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Part">
            <el-tooltip :content="'类型'" placement="top">
              <el-select v-model="form.massageType" filterable placeholder="请选择" style="width: 130px;">
                <el-option
                  v-for="item in dict.massage_type"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value">
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #a6404d; font-size: 13px">{{ item.value }}</span>
                </el-option>
              </el-select>
            </el-tooltip>
          </el-form-item>

          <el-form-item label="老客" class="oldGuest">
            <el-switch
              v-model="form.isAssign"
              inactive-color="#F4F4F5"
              active-color="#0D61FF"
              active-value="1"
              inactive-value="0">
            </el-switch>
          </el-form-item>
          <el-form-item label="预约">
            <el-switch
              v-model="form.orderStatus"
              inactive-color="#F4F4F5"
              active-color="#0D61FF"
              active-value="0"
              inactive-value="1">
            </el-switch>
          </el-form-item>
          <el-divider content-position="left"><i class="el-icon-bell"></i></el-divider>
          <el-form-item label="时长" prop="duration">
            <el-input-number
              v-model="form.duration"
              :step="5" :min="0" :max="150" :rows="3" style="width: 130px;"
              @change="handleTime(form)"
            />
          </el-form-item>
          <el-form-item :class="{Ing:form.extraTime >= 15}" label="加时" prop="extraTime">
              <el-input-number v-model="form.extraTime"  placeholder="加时" :step="5" :min="0" :max="150" :rows="3" style="width: 130px;" @change="handleTime(form)" />
          </el-form-item>
          <el-form-item label="开始" prop="time">
              <el-time-select
                v-model="form.time"
                default-value="12:30"
                value-format="HH:mm"
                :picker-options="{
                start: '08:30',
                step: '00:05',
                end: '20:30'
              }"
                style="width: 130px;"
                @change="handleTime(form)"
              />
          </el-form-item>
          <el-form-item label="结束" prop="time2">
              <el-time-select
                v-model="form.time2"
                value-format="HH:mm"
                default-value="12:30"
                :picker-options="{
                start: '08:30',
                step: '00:05',
                end: '20:30'
              }"
                style="width: 130px;"
              />
            </el-form-item>
<!--              <el-time-picker v-model="form.time2" type="datetime" style="width: 120px;" />-->
          <el-divider content-position="left"><i class="el-icon-bank-card"></i></el-divider>
          <el-form-item label="CASH">
            <el-input-number v-model="form.cash"  :precision="2" :min="0" style="width: 130px;" @change="updateFormIncome(form,'CASH')"/>
          </el-form-item>
          <el-form-item label="CARD">
            <el-input-number v-model="form.card" :precision="2" :min="0" style="width: 130px;" @change="updateFormIncome(form,'NAB')"/>
          </el-form-item>
          <el-form-item label="INS" class="ins">
            <el-input-number v-model="form.insurance" :precision="2" :min="0" style="width: 130px;" @change="updateFormIncome(form,'INS')"/>

          </el-form-item>
          <el-form-item label="保险" class="ins">
            <el-switch
              v-model="form.insuranceStatus"
              inactive-color="#F4F4F5"
              active-color="#67C23A"
              active-value="Y"
              inactive-value="N">
            </el-switch>
          </el-form-item>
          <el-form-item v-if="form.insuranceStatus=='Y'" label="WHO" class="ins">
            <el-select v-model="form.remedialId" style="width: 355px; background: #13ce66" filterable placeholder="请选择">
              <el-option
                v-for="item in remedialMassagers"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="总收入">
            <el-input v-model="form.income" :disabled="true" style="width: 130px;" />
          </el-form-item>
          <el-form-item label="GV/OFF">
            <el-input-number v-model="form.gvOff" :precision="2" :min="0" style="width: 130px;" controls-position="right" @change="updateFormIncome(form,'GV/OFF')"/>
          </el-form-item>
          <el-divider content-position="left"><i class="el-icon-s-custom"></i></el-divider>
          <el-form-item label="客人">
            <el-select v-model="form.guestId" filterable placeholder="请选择" style="width: 130px;">
              <el-option
                v-for="item in guests"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                style="width: 150px;"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="评分">
            <el-select v-model="form.mark" filterable placeholder="请选择" style="width: 130px;">
              <el-option
                v-for="item in dict.mark"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.info" :rows="2" type="textarea" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table show-summary :summary-method="getSummaries" ref="table" v-loading="crud.loading" :data="dataList"
                :row-class-name="tableRowClassName" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column align="center"  type="selection" width="55" />
<!--        <el-table-column align="center" prop="shopId" label="店铺ID">-->
<!--          <template slot-scope="scope">-->
<!--            {{ shopName(scope.row.shopId) }}-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column align="center" sortable prop="massagerId" label="按摩师">
          <template slot-scope="scope">
            <el-select size="mini" v-model="scope.row.massagerId" style="width: 90px;" filterable placeholder="请选择" @focus="updateWorkMassagers(query)" @change="crud.crudMethod.edit(scope.row)">
              <el-option
                v-for="item in workMassagers"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                :class="{Ing:item.status == 'ing'}">
                <span style="float: left">{{ item.name }}</span>
                <span v-if="{Ing:item.status == 'ing'}" style="float: right; color: #a6404d; font-size: 13px">{{ item.endTime }}</span>
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="isAssign" label="老客" width="50">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isAssign"
              @change="crud.crudMethod.edit(scope.row)"
              inactive-color="#F4F4F5"
              active-color="#0D61FF"
              active-value="1"
              inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>
<!--        <el-table-column prop="guestId" label="客人ID">-->
<!--          <template slot-scope="scope">-->
<!--            {{ guestName(scope.row.guestId) }}-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="isAssign" label="是否老客">-->
<!--          <template slot-scope="scope">-->
<!--            {{ dict.label.is_assign[scope.row.isAssign] }}-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column align="center"  prop="duration" label="按摩时长" width="70"/>
        <el-table-column  align="center" prop="extraTime" label="加时" >
          <template slot-scope="scope" >
            <el-input-number  :class="{extraTime:scope.row.extraTime >= 15}"  v-model="scope.row.extraTime" style="width: 85px" size="mini" controls-position="right" :step="5" :min="0" :max="150" :rows="3" @change="handleAndUpdateTime(scope.row)" />
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
        <el-table-column align="center" prop="income" label="总收入" >
        </el-table-column>
        <el-table-column align="center" prop="cash" label="CASH" >
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.cash"  style="width: 100px;" size="mini" controls-position="right" :precision="2" :step="1" :min="0" :max="150" :rows="3" @change="updateTableIncome(scope.row,'CASH')"/>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="card" label="EFPOS" >
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.card"  style="width: 100px;" size="mini" controls-position="right" :precision="2" :step="1" :min="0" :max="150" :rows="3" @change="updateTableIncome(scope.row,'NAB')"/>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="insurance" label="INS" >
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.insurance"  style="width: 100px;" size="mini" controls-position="right" :precision="2" :step="1" :min="0" :max="150" :rows="3" @change="updateTableIncome(scope.row,'INS')"/>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="gvOff" label="GV/OFF" >
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.gvOff"  style="width: 100px;" size="mini" controls-position="right" :precision="2" :step="1" :min="0" :max="150" :rows="3" @change="updateTableIncome(scope.row,'GV/OFF')"/>
          </template>
        </el-table-column>
        <el-table-column align="center" sortable prop="startTime" label="预约开始"
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
              @change="handleAndUpdateTime(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" sortable prop="time2" width="100" label="预计结束" />
<!--        <el-table-column prop="info" label="备注" :show-overflow-tooltip="true" width="10"/>-->
        <el-table-column align="center" prop="massageType" label="Part"
                         width="100">
          <template slot-scope="scope">
            <el-select v-model="scope.row.massageType" @change="crud.crudMethod.edit(scope.row)" filterable placeholder="请选择" style="width: 90px;">
              <el-option
                v-for="item in dict.massage_type"
                :key="item.id"
                :label="item.label"
                :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #a6404d; font-size: 13px">{{ item.value }}</span>
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="insuranceStatus" label="保险" width="55">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.insuranceStatus"
              @change="crud.crudMethod.edit(scope.row)"
              inactive-color="#F4F4F5"
              active-color="#67C23A"
              active-value="Y"
              inactive-value="N">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="到店" width="55" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.orderStatus"
              @change="crud.crudMethod.edit(scope.row)"
              inactive-color="#f196ba"
              active-color="#A5E4F1"
              active-value="1"
              inactive-value="0">
            </el-switch>
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
// status 给容忍状态用，timeStatus 标识加班加时（算工资），extraType 标识加时付款类型，用来导出数据，, orderStatus: 预约状态
const defaultForm = { id: null, shopId: 1, massagerId: 16, guestId: 2, isAssign: "0", duration: 30, remedialId: 16, mark: 5, income: 0, cash: 0, card: 0, insurance: 0,extraTime: 0, startTime: new Date(), endTime: null, time:null, time2:null,insuranceStatus:"N",info:null,gvOff:0,status:null,timeStatus:'0',extraType:null, orderStatus: 1 }
export default {
  name: 'MassageRecord',
  components: { pagination, crudOperation, rrOperation, udOperation, myDatepicker },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['is_assign', 'mark','massage_type','appointment_status'],
  cruds() {
    return CRUD({ title: 'Massage_Record', url: 'api/massageRecord', idField: 'id', sort: ['startTime,desc','id,desc'], crudMethod: { ...crudMassageRecord }})
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
          { required: true, message: '是否老客不能为空', trigger: 'blur' }
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
      workMassagers: [
        {
          id:16,
          name:"默认"
        }
      ],
      // 记录上活优先级最高的人
      lastWorkMassager:{
        id:16,
        name:"默认"
      },
      massagers: [
        {
          id:16,
          name:"默认"
        }
      ],
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
      tableFilter:{
        startTime:null,
        duration:20,
        endTime:null,
        tolerance:10
      },
      initDate:[
        moment(new Date().setHours(0,0,0)).format('YYYY-MM-DD HH:mm:ss'),
        moment(new Date().setHours(23,59,59)).format('YYYY-MM-DD HH:mm:ss')
      ],
      insuranceStatusList:[
        {
          label:'是',
          value:'Y'
        },
        {
          label:'否',
          value:'N'
        }
      ],
      incomeLevel:{
        closestLevel: '3%',
        nowLevel:'加油',
        totalIncome:null,
        diffPercent:'0',
        diffIncome:'0'

      },
      shopIncomeLevel:{
        id:'1',
        gap:'200',
        threePercent:'',
        fourPercent:'',
        oneLevel:''
      }

    }
  },
  mounted() {
    this.initMassager(this.query)
    this.updateWorkMassagers(this.query)
  },
  created() {
    this.$set(this.query,'startTime',this.initDate)
    this.$set(this.query,'shopId',1)
    // this.$set(this.form,'time',new Date().format('HH:mm'))
  },
  computed: {
    dataList:function() {
        return this.handlesearch(this.crud.data)
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    updateWorkMassagers: function(queryParam) {
      if (queryParam.shopId !== undefined && queryParam.shopId !== null) {
        this.filterParam.shopId = queryParam.shopId
      }
      if (queryParam.startTime !== undefined && queryParam.startTime !== null) {
        this.filterParam.nowDay = queryParam.startTime[0]
      }
      let param = this.filterParam
      getWorkMassagers(param).then(data => {
        if (data == undefined || data.length == 0) {
          return;
        }
        this.workMassagers = data.concat([
          {
            id:16,
            name:"默认"
          }
        ])
        this.lastWorkMassager =this.workMassagers[0]

      })
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
        // this.workMassagers = this.workMassagers.concat(data)
        this.workMassagers = data.concat([
          {
            id:16,
            name:"默认"
          }
        ])

      })
      // 所有按摩师
      getMassagers().then(data => {
        this.massagers = data
        this.remedialMassagers = data.filter(function (value, index, array) {
          return value.isDiplomate == "1";
        })
      })
      getGuests().then(data => {
        this.guests = data.content
      })
      getShops().then(data => {
        this.shops = data.content
        this.shopIncomeLevel = this.shops.find(item => item.id == this.query.shopId)
        console.log(this.shopIncomeLevel)
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
    handleTime(data){
      // 加时收钱超过15刀-加时=1，加班的话，为2
      if (data.extraTime >= 15 || (data.extraTime >= 10 && data.duration <= 20)) {
        data.timeStatus = '1'
      }else if (data.timeStatus == '1') {
        data.timeStatus = '0'
      }
      // 编辑预约开始结束时间的日期-默认当天，如果有queryStartTime就用query的
      let nowTime = new Date()
      let initStartTIme = new Date
      let queryDay = new Date()
      if (this.query.startTime[0] != 'undefined') {
        // Date.parse使用YYYY/MM/DD HH:mm:ss这个格式，不然在Safari会报错
        queryDay.setTime(Date.parse(this.query.startTime[0].replace(/-/g,"/")))
      }
      initStartTIme = queryDay
      initStartTIme.setHours(nowTime.getHours())
      initStartTIme.setMinutes(nowTime.getMinutes())
      initStartTIme.setSeconds(nowTime.getSeconds())

      if (data.time == 'Invalid date'||data.time == null) {
        data.time = moment(initStartTIme).format('HH:mm')
      }
      let inputTime = data.time
      queryDay.setHours((inputTime+'').substr(0,2))
      queryDay.setMinutes((inputTime+'').substr(3,2))
      // todo 是否有时区问题
      data.startTime = moment(queryDay).format('YYYY-MM-DD HH:mm:ss')
      data.time = moment(queryDay).format('HH:mm')
      let endTime = new Date()
      endTime.setTime(queryDay.getTime() + 60000 * (data.duration+data.extraTime))
      data.endTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss')
      data.time2 = moment(endTime).format('HH:mm')

      // 根据时长，默认设置按摩part
      // if (data.massageType == undefined) {
        if (data.duration == 60) {
          data.massageType = 'FB'
        }else if (data.duration == 30) {
          data.massageType = 'NSB'
        }else if (data.duration == 45) {
          data.massageType = 'NSBL'
        }else if (data.duration == 90) {
          data.massageType = 'FB+R'
        }
      // }

      return data
    },
    handleAndUpdateTime(data) {

      data = this.handleTime(data)
      this.crud.crudMethod.edit(data)
    },
    // 表格颜色方法
    tableRowClassName({row, rowIndex}) {
      let rowEndTime = row.endTime;
      // 周六日 五点整，周四是九点整，其余时间五点半
      let closedTime = new Date()
      closedTime.setTime(Date.parse(rowEndTime.replace(/-/g,"/")))
      var week = "星期" + "日一二三四五六".charAt(closedTime.getDay());

      if (closedTime.getDay() === 0 || closedTime.getDay() === 6) {
        closedTime.setHours(17)
        closedTime.setMinutes(5)
        closedTime.setSeconds(0)
      } else if (closedTime.getDay() === 4) {
        closedTime.setHours(21)
        closedTime.setMinutes(5)
        closedTime.setSeconds(0)
      } else {
        closedTime.setHours(17)
        closedTime.setMinutes(35)
        closedTime.setSeconds(0)
      }
      // 加班-加时状态更新
      if (Date.parse(rowEndTime.replace(/-/g,"/")) > closedTime) {
        if (row.timeStatus == '1') {
          // 加班又加时
          row.timeStatus = '3'
        } else {
          // 加班
          row.timeStatus = '2'
        }
        this.crud.crudMethod.edit(row)
      }


      // 周六日 五点整，周四是九点整，其余时间五点半
      // 可容忍的冲突
      if (row.status == '1') {
        return 'tolerance-row';
      }else if (row.status == '2') {
        return 'tolerance-row2';
      } else if (row.isAssign === "1") {
        return 'frequenter-row';
      } else if (row.insuranceStatus === "Y") {
        return 'insurance-row';
      } else if(row.timeStatus == '1'||row.timeStatus == '2'){
        return 'addTime-row'
      }

    },
    // 更新表格总收入
    updateTableIncome(data,extraType){
      data = this.updateFormIncome(data,extraType)
      // 更新数据
      this.crud.crudMethod.edit(data)
    },
    // 更新表单总收入
    updateFormIncome(data,extraType){
      // 如果有加时，记录加时付款类型
      if (data.duration > 0) {
        data.extraType = extraType
      }
      if (data.cash == undefined) {
        data.cash = 0
      }
      if (data.card == undefined) {
        data.card = 0
      }
      if (data.insurance == undefined) {
        data.insurance = 0
      }
      if (data.gvOff == undefined) {
        data.gvOff = 0
      }
      if (data.insurance !== 0) {
        data.insuranceStatus = 'Y'
      }else {
        data.insuranceStatus = 'N'
      }
      //关系：总收入=其余所有相加(不包含礼券）
      data.income = data.cash+data.insurance+data.card
      return data
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价';
          return;
        }
        // if (index === 1) {
        //   sums[index] = '店铺';
        //   return;
        // }
        if (index === 1) {
          sums[index] = '按摩师';
          return;
        }
        if (index === 5) {
          sums[index] = '保险人';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          if (index === 2) {
            sums[index] = 0
            for (let i = 0; i < values.length; i++) {
              if (values[i] == '1') {
                sums[index]++
              }
            }
          } else {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
          }
          if (index === 2) {
            sums[index] += ' 个老客'
          } else if (index === 3 || index === 4) {
            sums[index] += ' mins'
          } else {
            // 第六个总收入记录
            if (index === 6) {
              this.incomeLevel.totalIncome = sums[index]
              console.log(this.incomeLevel.totalIncome+'total')
              //调用更新进度
              // this.updateLevelPercentage()
            }
            sums[index] = '$ ' + sums[index]
          }
        } else {
          sums[index] = '---'
        }
      });

      return sums;
    },
    handlesearch: function(data) { //第30行调用了该方法
      if (this.tableFilter.startTime == null) {
        return data
      }
      let countDoing = 0;
      let filterStartTime = this.tableFilter.startTime.split(':').join('')
      let hours = parseInt(this.tableFilter.duration/60)
      let endTime = this.tableFilter.startTime.split(':')
      let duration = hours >= 1 ? (this.tableFilter.duration - 60 * hours):this.tableFilter.duration
      endTime[0] = parseInt(endTime[0])+hours
      endTime[1] = parseInt(endTime[1])+duration
      if (endTime[1] > 59) {
        endTime[0]++
        endTime[1] = endTime[1]-60
      }
      if (endTime[1] < 10) {
        endTime[1] = '0'+endTime[1]
      }
      // endTime[2]='00'
      this.tableFilter.endTime = endTime.join('')
      // this.tableFilter.endTime[0]=endTime[0]
      // this.tableFilter.endTime[1]=endTime[1]
      let toleranceStatus = 'N'
      let result = data.filter(item => {
        // filter()对象遍历,true 返回对象参数值,如果多条数据,自动使用数组拼接
        let tableStartTime = (item.time+'').split(':').join('')
        let tableEndTime = (item.time2+'').split(':').join('')
        if (filterStartTime <= tableEndTime && this.tableFilter.endTime >=tableStartTime) {
          countDoing++
          if (tableEndTime - filterStartTime <= this.tableFilter.tolerance) {
              item.status = '1'
            toleranceStatus = 'Y'
          }else if (this.tableFilter.endTime - tableStartTime <= this.tableFilter.tolerance) {
            item.status = '2'
            toleranceStatus = 'Y'
          } else {
            item.status = '0'
          }
          return item
        }
      })
      let frees = this.workMassagers.length-1 - countDoing
      this.$notify({
        title: (frees>0?'还可以接'+frees+'个':'做不了啦')+''+(toleranceStatus=='Y'?'红色的可以考虑哦':''),
        type: 'success',
        duration: 2500
      })
      return result
    },
    //爆档进度条
    updateLevelPercentage() {
      // return percentage === 100 ? '满' : `${percentage}%`;
      console.log(this.shopIncomeLevel)
      let total = this.incomeLevel.totalIncome
      if (total <= this.shopIncomeLevel.threePercent) {
        this.incomeLevel.nowLevel = '加油'
        this.incomeLevel.closestLevel = '3%'
        console.log(this.shopIncomeLevel.threePercent-total)
        this.incomeLevel.diffIncome = (this.shopIncomeLevel.threePercent-total).toFixed(2)
        this.incomeLevel.diffPercent = (total/this.shopIncomeLevel.threePercent*100).toFixed(2)
      }else if (total <= this.shopIncomeLevel.fourPercent) {
        this.incomeLevel.nowLevel = '3%'
        this.incomeLevel.closestLevel = '4%'
        this.incomeLevel.diffIncome = (this.shopIncomeLevel.fourPercent-total).toFixed(2)
        // this.incomeLevel.diffPercent = (total/this.shopIncomeLevel.fourPercent*100).toFixed(2)
        this.incomeLevel.diffPercent = (100-(this.incomeLevel.diffIncome/(this.shopIncomeLevel.fourPercent-this.shopIncomeLevel.threePercent))*100).toFixed(2)
      }else if (total <= this.shopIncomeLevel.oneLevel) {
        this.incomeLevel.nowLevel = '4%'
        this.incomeLevel.closestLevel = '一档'
        this.incomeLevel.diffIncome = (this.shopIncomeLevel.oneLevel-total).toFixed(2)
        // this.incomeLevel.diffPercent = (total/this.shopIncomeLevel.oneLevel*100).toFixed(2)
        this.incomeLevel.diffPercent = (100-(this.incomeLevel.diffIncome/(this.shopIncomeLevel.oneLevel-this.shopIncomeLevel.fourPercent))*100).toFixed(2)
      }else if (total > this.shopIncomeLevel.oneLevel) {
        //2603.2 - 2000=603.2 603.2/250=2
        // 2000 250 2130
        let num = parseInt((total-this.shopIncomeLevel.oneLevel)/this.shopIncomeLevel.gap)
        this.incomeLevel.diffIncome = ((this.shopIncomeLevel.oneLevel+(num+1)*this.shopIncomeLevel.gap)-total).toFixed(2)
        // this.incomeLevel.diffPercent = (total/(this.shopIncomeLevel.oneLevel+(num+1)*this.shopIncomeLevel.gap)*100).toFixed(2)
        this.incomeLevel.diffPercent = (100-(this.incomeLevel.diffIncome/this.shopIncomeLevel.gap)*100).toFixed(2)
        this.incomeLevel.nowLevel = (num+1)+'档'
        this.incomeLevel.closestLevel = (num+2)+'档'
        console.log(num)
        // this.incomeLevel.closestLevel =
      }
      console.log(this.incomeLevel.diffPercent)
      return this.incomeLevel.diffPercent
    }
  }
}
</script>
<style>
  .normal .el-form-item__label {
    color: #9a6732;
  }
  .oldGuest .el-form-item__label {
    color: #00a0e9;
  }
  .ins .el-form-item__label {
    color: #12a31d;
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
 .el-table .tolerance-row {
   background: #f196ba;
 }
  .el-table .tolerance-row2 {
    background: #f171c1;
  }
  .extraTime.el-input-number.is-controls-right .el-input__inner{
    padding-left: 15px;
    padding-right: 50px;
    background-color: #FBCD77;
  }
  .lastWorker.el-select-dropdown__item.is-disabled {
    color: #4f59d0;
    cursor: not-allowed;
  }
  .el-progress-bar__outer{
    height: 26px;
    width: 200px;
  }
  /*.extraTime ::v-deep.el-input-number::v-deep.is-controls-right ::v-deep.el-input__inner{*/
  /*  padding-left: 15px;*/
  /*  padding-right: 50px;*/
  /*  background-color: palegoldenrod;*/
  /*}*/
</style>
<style scoped lang="scss">
  /*.el-form-item__label {*/
  /*  text-align: right;*/
  /*  vertical-align: middle;*/
  /*  float: left;*/
  /*  font-size: 14px;*/
  /*  color: #b79020;*/
  /*  line-height: 40px;*/
  /*  padding: 0 12px 0 0;*/
  /*  -webkit-box-sizing: border-box;*/
  /*  box-sizing: border-box;*/
  /*}*/
  /*一行form*/

  .el-form-item label:after {
    content: "";
    display: inline-block;
    width: 100%;
  }
  .el-form-item__label {
    text-align: justify;
    height: 50px;
  }

  .el-form-item.is-required .el-form-item__label:before {
    content: none !important;
  }

  .timeLineTitle {
    float: right;
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */

    .timeLineItem {
      display: flex;
      padding: 0px;
      font-size: 15px;
      justify-content: center; /* 水平居中 */
      align-items: center; /* 垂直居中 */
    }
    .timeLineStatus {
      width: 28px;
      height: 10px;
      margin: 10px;
      border-radius: 2px;
    }
    .addTimeTip {
      background-color: #fbcd77;
    }
    .frequenterTip {
      background-color: #b3d2f1;
    }
    .insuranceTip {
      background-color: #d0f1be;
    }
    .toleranceEnd {
      background-color: #f196ba;
    }
    .toleranceStart {
      background-color: #f171c1;
    }
  }
  .Ing {
    background-color: #9ec3bd;
  }

</style>

