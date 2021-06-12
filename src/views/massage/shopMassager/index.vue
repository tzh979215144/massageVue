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
        <label class="el-form-item-label">上班日期</label>
        <el-date-picker
          @change="initMassager(query)"
          v-model="query.workDate"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
        <label class="el-form-item-label">迟到等级</label>
        <el-slider
          v-model="query.lateLevel"
          range
          show-stops
          :max="5"
        />
        <rrOperation :crud="crud" />
        <el-button type="success" plain round class="filter-item" icon="el-icon-check" size="mini" @click="update(query)">更新工资</el-button>
        <label class="el-form-item-label">今日爆档：{{$root.incomeLevelRes[$root.shopId]}}</label>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
<!--          <el-form-item label="店铺" prop="shopId">-->
<!--            <el-select v-model="form.shopId" filterable placeholder="请选择">-->
<!--              <el-option-->
<!--                v-for="item in shops"-->
<!--                :key="item.id"-->
<!--                :label="item.name"-->
<!--                :value="item.id"-->
<!--              />-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <el-form-item label="单个按摩师">
              <el-select v-model="form.massagerId" filterable @change="handleFormShopId(form)" placeholder="请选择">
                <el-option
                  v-for="item in massagers"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
          </el-form-item>
          <el-form-item label="批量按摩师">
            <el-checkbox-group v-model="form.massagerIds" @change="handleCheckedCitiesChange">
              <el-checkbox
                v-for="item in massagers" :label="item.id" :key="item.id"
                @change="handleFormShopId(form)"
              >{{item.name}}
              </el-checkbox>
            </el-checkbox-group>

          </el-form-item>
          <el-form-item label="上班日期" prop="workDate">
            <el-date-picker v-model="form.workDate"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="date" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="到店时间">
            <el-time-picker v-model="form.workTime" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="迟到等级">
            <el-select v-model="form.lateLevel" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.late_level"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="工资">
            <el-input v-model="form.wage" style="width: 370px;" />
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
        <el-table-column type="date" prop="workDate" label="上班日期" />
        <el-table-column sortable prop="workTime" label="到店时间" />
        <el-table-column prop="lateLevel" label="迟到等级">
          <template slot-scope="scope">
            {{ dict.label.late_level[scope.row.lateLevel] }}
          </template>
        </el-table-column>
        <el-table-column prop="wage" label="工资" />
        <el-table-column v-if="checkPer(['admin','shopMassager:edit','shopMassager:del'])" label="操作" width="150px" align="center">
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
import crudShopMassager from '@/api/massage/shopMassager'
import { updateWage } from '@/api/massage/shopMassager'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getMassagers } from '@/api/massage/massager'
import { getShops } from '@/api/massage/shop'
import moment from 'moment'

const defaultForm = { id: null, shopId: 1, massagerId: null, workDate: new Date(),workTime: null, lateLevel: '0',massagerIds:[],wage: null }
export default {
  name: 'ShopMassager',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['late_level'],
  cruds() {
    return CRUD({ title: '员工分配', url: 'api/shopMassager', idField: 'id', sort: 'id,desc', crudMethod: { ...crudShopMassager }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'shopMassager:add'],
        edit: ['admin', 'shopMassager:edit'],
        del: ['admin', 'shopMassager:del']
      },
      rules: {
        shopId: [
          { required: true, message: '店铺不能为空', trigger: 'blur' }
        ],
        massagerId: [
          { required: true, message: '按摩师不能为空', trigger: 'blur' }
        ],
        workDate: [
          { required: true, message: '上班日期不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'shopId', display_name: '店铺' },
        { key: 'massagerId', display_name: '按摩师' },
        { key: 'workDate', display_name: '上班日期' }
      ],
      massagers: [],
      shops: [],
      isIndeterminate: true,
      checkAll: false,
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
    this.$set(this.query,'shopId',this.$root.shopId)
    this.$set(this.query,'workDate',moment(new Date().setHours(0,0,0)).format('YYYY-MM-DD HH:mm:ss'))
    this.$set(this.form,'shopId',this.$root.shopId)
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    initMassager: function(queryParam) {
      if (queryParam.shopId !== undefined && queryParam.shopId !== null) {
        this.filterParam.shopId = queryParam.shopId
        this.$root.shopId = queryParam.shopId
      }
      getMassagers().then(data => {
        this.massagers = data
      })
      getShops().then(data => {
        this.shops = data.content
      })
      this.update(queryParam)
      this.crud.toQuery(queryParam)
    },
    massagerName(id) {
      const result = this.massagers.find(item => item.id == id)
      if (typeof result === 'undefined') {
        return id + '号按摩师不存在'
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
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = (checkedCount === this.massagers.length);
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.massagers.length;
    },
    update(data) {
      if (data.shopId !== undefined) {
        this.filterParam.shopId = data.shopId
      }
      if (data.workDate !== undefined) {
        this.filterParam.nowDay = data.workDate
      }
      let param = this.filterParam
      updateWage(param).then(data => {
        this.$notify({
          title: '已更新工资',
          type: 'success',
          duration: 2500
        })
        // 使用this才可以调用crud的方法
        this.crud.refresh()
      })
    },
    arrivedShop(param) {
      let nowTime = new Date()

      param.workTime = moment(nowTime).format('HH:mm:ss')
      this.crud.crudMethod.edit(param).then(data => {
        this.$notify({
          title: this.massagerName(param.massagerId)+'到店啦',
          type: 'success',
          duration: 2500
        })
      })
      this.crud.crudMethod.refresh()
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
