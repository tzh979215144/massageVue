<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">店铺ID</label>
        <el-select v-model="query.shopId" clearable placeholder="店铺名" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery">
          <el-option
            v-for="item in shops"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <label class="el-form-item-label">按摩师ID</label>
        <el-select v-model="query.massagerId" clearable placeholder="按摩师名" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery">
          <el-option
            v-for="item in massagers"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <label class="el-form-item-label">客人ID</label>
        <el-select v-model="query.guestId" clearable placeholder="客人名" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery">
          <el-option
            v-for="item in guests"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <label class="el-form-item-label">开始时间</label>
        <el-date-picker
          v-model="query.startTime"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <label class="el-form-item-label">结束时间</label>
        <el-date-picker
          v-model="query.endTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <label class="el-form-item-label">按摩评分</label>
        <el-slider
          v-model="query.mark"
          range
          show-stops
          :max="5"
        />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="店铺ID" prop="shopId">
            <el-select v-model="form.shopId" filterable placeholder="请选择">
              <el-option
                v-for="item in shops"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="按摩师ID" prop="massagerId">
            <el-select v-model="form.massagerId" filterable placeholder="请选择">
              <el-option
                v-for="item in massagers"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="客人ID">
            <el-select v-model="form.guestId" filterable placeholder="请选择">
              <el-option
                v-for="item in guests"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否指定按摩师" prop="isAssign">
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
            <el-input v-model="form.duration" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="保险刷谁的">
            <el-select v-model="form.remedialId" filterable placeholder="请选择">
              <el-option
                v-for="item in massagers"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="按摩评分">
            <el-select v-model="form.mark" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.mark"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="总收入金额">
            <el-input v-model="form.income" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="现金付款金额">
            <el-input v-model="form.cash" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="卡付款金额">
            <el-input v-model="form.card" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="保险付款金额">
            <el-input v-model="form.insurance" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="预约开始时间">
            <el-date-picker
              v-model="form.startTime"
              type="datetime"
              style="width: 370px;"
              @change="countEndTime($event)"
            />
          </el-form-item>
          <el-form-item label="预计结束时间">
            <el-date-picker v-model="form.endTime" type="datetime" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="shopId" label="店铺ID">
          <template slot-scope="scope">
            {{ shopName(scope.row.shopId) }}
          </template>
        </el-table-column>
        <el-table-column prop="massagerId" label="按摩师ID">
          <template slot-scope="scope">
            {{ massagerName(scope.row.massagerId) }}
          </template>
        </el-table-column>
        <el-table-column prop="guestId" label="客人ID">
          <template slot-scope="scope">
            {{ guestName(scope.row.guestId) }}
          </template>
        </el-table-column>
        <el-table-column prop="isAssign" label="是否指定">
          <template slot-scope="scope">
            {{ dict.label.is_assign[scope.row.isAssign] }}
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="按摩时长（按分钟算）" />
        <el-table-column prop="remedialId" label="保险刷谁的（默认按摩师）">
          <template slot-scope="scope">
            {{ massagerName(scope.row.remedialId) }}
          </template>
        </el-table-column>
        <el-table-column prop="mark" label="按摩评分">
          <template slot-scope="scope">
            {{ dict.label.mark[scope.row.mark] }}
          </template>
        </el-table-column>
        <el-table-column prop="income" label="总收入金额" />
        <el-table-column prop="cash" label="现金付款金额" />
        <el-table-column prop="card" label="卡付款金额" />
        <el-table-column prop="insurance" label="保险付款金额" />
        <el-table-column prop="startTime" label="预约开始时间" />
        <el-table-column prop="endTime" label="预计结束时间" />
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

const defaultForm = { id: null, shopId: null, massagerId: null, guestId: null, isAssign: null, duration: null, remedialId: null, mark: null, income: null, cash: null, card: null, insurance: null, startTime: null, endTime: null }
export default {
  name: 'MassageRecord',
  components: { pagination, crudOperation, rrOperation, udOperation, myDatepicker },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['is_assign', 'mark'],
  cruds() {
    return CRUD({ title: 'massage', url: 'api/massageRecord', idField: 'id', sort: 'id,desc', crudMethod: { ...crudMassageRecord }})
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
          { required: true, message: '按摩时长（按分钟算）不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'shopId', display_name: '店铺ID' },
        { key: 'massagerId', display_name: '按摩师ID' },
        { key: 'guestId', display_name: '客人ID' },
        { key: 'mark', display_name: '按摩评分' }
      ],
      massagers: [],
      guests: [],
      shops: []
    }
  },
  mounted() {
    this.initMassager()
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    initMassager: function() {
      getMassagers().then(data => {
        this.massagers = data.content
      })
      getGuests().then(data => {
        this.guests = data.content
      })
      getShops().then(data => {
        this.shops = data.content
      })
    },
    countEndTime(event) {
      console.log(typeof event)
      if (typeof event === 'string') {
        var d = new Date()
        d.setTime(Date.parse(this.form.startTime) + 60000 * event)
        this.form.endTime = d
      } else {
        var d = new Date()
        d.setTime(Date.parse(this.form.startTime) + 60000 * this.form.duration)
        this.form.endTime = d
      }
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
    }
  }
}
</script>

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
