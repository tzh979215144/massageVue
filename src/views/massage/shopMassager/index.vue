<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">店铺</label>
        <el-input v-model="query.shopId" clearable placeholder="店铺" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">按摩师</label>
        <el-input v-model="query.massagerId" clearable placeholder="按摩师" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">上班日期</label>
        <el-input v-model="query.workDate" clearable placeholder="上班日期" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-date-picker
          v-model="query.workTime"
          type="daterange"
          value-format="HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <label class="el-form-item-label">迟到等级</label>
        <el-slider
          v-model="query.lateLevel"
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
          <el-form-item label="上班日期" prop="workDate">
            <el-date-picker v-model="form.workDate" type="date" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="到店时间">
            <el-time-picker v-model="form.workTime" style="width: 370px;" />
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
        <el-table-column prop="workTime" label="到店时间" />
        <el-table-column prop="lateLevel" label="迟到等级">
          <template slot-scope="scope">
            {{ dict.label.late_level[scope.row.lateLevel] }}
          </template>
        </el-table-column>
        <el-table-column v-if="checkPer(['admin','shopMassager:edit','shopMassager:del'])" label="操作" width="150px" align="center">
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
import crudShopMassager from '@/api/massage/shopMassager'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getMassagers } from '@/api/massage/massager'
import { getShops } from '@/api/massage/shop'

const defaultForm = { id: null, shopId: null, massagerId: null, workDate: null, workTime: null, lateLevel: 0 }
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
      getShops().then(data => {
        this.shops = data.content
      })
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
    }
  }
}
</script>

<style scoped>

</style>
