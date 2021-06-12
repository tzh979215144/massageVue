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
        <label class="el-form-item-label">Day</label>
        <el-date-picker
          class="filter-item"
          @change="initMassager(query)"
          v-model="query.startTime"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="售卖日期"
          end-placeholder="截止日期"
          :default-time="['00:00:00', '23:59:59']"
        />
        <label class="el-form-item-label">过期时间</label>
        <el-date-picker
          class="filter-item"
          @change="initMassager(query)"
          v-model="query.endTime"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="售卖日期"
          end-placeholder="截止日期"
          :default-time="['00:00:00', '23:59:59']"
        />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
<!--          <el-form-item label="店铺" prop="shopId">-->
<!--            <el-select v-model="form.shopId" filterable placeholder="请选择" style="width: 150px;">-->
<!--              <el-option-->
<!--                v-for="item in shops"-->
<!--                :key="item.id"-->
<!--                :label="item.name"-->
<!--                :value="item.id"-->
<!--              />-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <el-form-item label="售卖" prop="startTime">
            <el-date-picker
              v-model="form.startTime"
              style="width: 150px;"
            />
          </el-form-item>
          <el-form-item label="截止日" prop="endTime">
            <el-date-picker
              v-model="form.endTime"
              style="width: 150px;"
            />
          </el-form-item>
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
          <el-form-item label="总收入">
            <el-input v-model="form.income" :disabled="true" style="width: 130px;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.info" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" show-summary v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column align="center" prop="shopId" label="店铺">
          <template slot-scope="scope">
            {{ shopName(scope.row.shopId) }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="income" label="总收入" >
        </el-table-column>
        <el-table-column align="center" prop="cash" label="CASH" >
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.cash"  style="width: 100px;" size="mini" controls-position="right" :precision="2" :step="1" :min="0":rows="3" @change="updateTableIncome(scope.row,'CASH')"/>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="card" label="EFPOS" >
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.card"  style="width: 100px;" size="mini" controls-position="right" :precision="2" :step="1" :min="0" :rows="3" @change="updateTableIncome(scope.row,'NAB')"/>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="insurance" label="INS" >
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.insurance"  style="width: 100px;" size="mini" controls-position="right" :precision="2" :step="1" :min="0" :rows="3" @change="updateTableIncome(scope.row,'INS')"/>
          </template>
        </el-table-column>
        <el-table-column align="center" type="date" sortable prop="time" width="130" label="售卖时间"/>
        <el-table-column align="center" type="date" sortable prop="time2" width="130" label="到期时间" />
        <el-table-column prop="info" label="备注" />
        <el-table-column v-if="checkPer(['admin','massageGiftVouchers:edit','massageGiftVouchers:del'])" label="操作" width="150px" align="center">
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
import crudMassageGiftVouchers from '@/api/massage/giftVouchers'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getShops } from '@/api/massage/shop'

import moment from 'moment'

const defaultForm = { id: null, shopId: 1, income: 0, cash: 0, card: 0, insurance: 0, startTime: new Date(), endTime: null, info: null,time:null,time2:null}
export default {
  name: 'giftVouchers',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'massage vouchers', url: 'api/massageGiftVouchers', idField: 'id', sort: 'id,desc', crudMethod: { ...crudMassageGiftVouchers }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'massageGiftVouchers:add'],
        edit: ['admin', 'massageGiftVouchers:edit'],
        del: ['admin','massageGiftVouchers:del']
      },
      rules: {
        shopId: [
          { required: true, message: '店铺不能为空', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '售卖时间不能为空', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '过期日期不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'shopId', display_name: '店铺ID' },
        {key:'startTime', display_name: '售卖时间'}
      ],
      initDate:[
        moment(new Date().setHours(0,0,0)).format('YYYY-MM-DD HH:mm:ss'),
        moment(new Date().setHours(23,59,59)).format('YYYY-MM-DD HH:mm:ss')
      ],
      filterParam: {
        shopId: 1,
        nowDay: new Date()
      },
    }
  },
  mounted() {
    this.initMassager(this.query)
  },
  created() {
    this.$set(this.query,'startTime',this.initDate)
    this.$set(this.query,'shopId',this.$root.shopId)
  },
  activated() {
    this.$set(this.query,'startTime',this.initDate)
    this.$set(this.query,'shopId',this.$root.shopId)
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    initMassager: function(queryParam) {
      console.log(queryParam)
      if (queryParam.shopId !== undefined&&queryParam.shopId !==null) {
        this.filterParam.shopId = queryParam.shopId
        this.$root.shopId = queryParam.shopId
        console.log(this.$root.shopId+"======")
      }
      if (queryParam.startTime !== undefined&&queryParam.startTime !== null) {
        this.filterParam.nowDay = queryParam.startTime[0]
      }
      getShops().then(data => {
        this.shops = data.content
        this.shopIncomeLevel = this.shops.find(item => item.id == this.query.shopId)
      })
      this.crud.toQuery(queryParam)
    },
    shopName(id) {
      const result = this.shops.find(item => item.id == id)
      if (typeof result === 'undefined') {
        return id + '号店铺不存在'
      }
      return result.name
    },
    // 更新表格总收入
    updateTableIncome(data){
      data = this.updateFormIncome(data)
      // 更新数据
      this.crud.crudMethod.edit(data)
    },
    // 更新表单总收入
    updateFormIncome(data){
      this.handleFormShopId(data)
      // 如果有加时，记录加时付款类型
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
      //关系：总收入=其余所有相加(不包含礼券）
      data.income = data.cash+data.insurance+data.card
      return data
    },
    //将表单店铺id设为全局的shopId
    handleFormShopId(form) {
      form.shopId = this.$root.shopId
    },
  }
}
</script>

<style scoped>

</style>
