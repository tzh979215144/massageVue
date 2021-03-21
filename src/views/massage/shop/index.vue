<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">店铺名称</label>
        <el-input v-model="query.name" clearable placeholder="店铺名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">店长ID</label>
        <el-input v-model="query.managerId" clearable placeholder="店长ID" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="店铺名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="店铺手机号">
            <el-input v-model="form.phone" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="店铺网址">
            <el-input v-model="form.website" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="店长" prop="managerId">
            <el-select v-model="form.managerId" filterable placeholder="请选择" style="width: 150px;">
              <el-option
                v-for="item in massagers"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #a6404d; font-size: 13px">{{ item.info }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="档位间隔" prop="gap">
            <el-input-number v-model="form.gap" :step="50" :min="0" :max="1000" :rows="3" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="3%" prop="threePercent">
            <el-input-number v-model="form.threePercent" :step="50" :min="0" :rows="3" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="4%" prop="fourPercent">
            <el-input-number v-model="form.fourPercent" :step="50" :min="0" :rows="3" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="一档" prop="oneLevel">
            <el-input-number v-model="form.oneLevel" :step="50" :min="0" :rows="3" style="width: 370px;" />
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
        <el-table-column prop="name" label="店铺名称" />
        <el-table-column prop="phone" label="店铺手机号" />
        <el-table-column prop="website" label="店铺网址" />
        <el-table-column align="center" sortable prop="massagerId" label="店长">
          <template slot-scope="scope">
            <el-select size="mini" v-model="scope.row.managerId" style="width: 90px;" filterable placeholder="请选择" @change="crud.crudMethod.edit(scope.row)">
              <el-option
                v-for="item in massagers"
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
          <!--          <template slot-scope="scope">-->
          <!--            {{ dict.label.sex[scope.row.sex] }}-->
          <!--          </template>-->
        <el-table-column prop="gap" label="档位间隔" />
        <el-table-column prop="threePercent" label="3%" />
        <el-table-column prop="fourPercent" label="4%" />
        <el-table-column prop="oneLevel" label="一档" />
        <el-table-column v-if="checkPer(['admin','shop:edit','shop:del'])" label="操作" width="150px" align="center">
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
import crudShop from '@/api/massage/shop'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getMassagers } from '@/api/massage/massager'

const defaultForm = { id: null, name: null, phone: null, website: null, managerId: null, gap: null, threePercent: null, fourPercent: null, oneLevel: null }
export default {
  name: 'Shop',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'shop', url: 'api/shop', idField: 'id', sort: 'id,desc', crudMethod: { ...crudShop }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'shop:add'],
        edit: ['admin', 'shop:edit'],
        del: ['admin', 'shop:del']
      },
      rules: {
        name: [
          { required: true, message: '店铺名称不能为空', trigger: 'blur' }
        ],
        managerId: [
          { required: true, message: '店长ID不能为空', trigger: 'blur' }
        ],
        gap: [
          { required: true, message: '档位间隔不能为空', trigger: 'blur' }
        ],
        threePercent: [
          { required: true, message: '3%不能为空', trigger: 'blur' }
        ],
        fourPercent: [
          { required: true, message: '4%不能为空', trigger: 'blur' }
        ],
        oneLevel: [
          { required: true, message: '一档不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '店铺名称' },
        { key: 'managerId', display_name: '店长ID' }
      ],
      massagers: [{
      id:16,
      name:"默认"
    }],
      massagerId: ''
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
    initMassager: function(queryParam) {
      getMassagers().then(data => {
        this.massagers = data.content
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
.el-autocomplete {
  li {
    line-height: normal;
    padding: 7px;
  }

      .name {
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .info {
        font-size: 12px;
        color: #b4b4b4;
      }

      .highlighted .info {
        color: #ddd;
      }

}
</style>
