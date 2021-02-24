<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">客户姓名</label>
        <el-input v-model="query.name" clearable placeholder="客户姓名" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">性别</label>
        <el-input v-model="query.sex" clearable placeholder="性别" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">联系电话</label>
        <el-input v-model="query.phone" clearable placeholder="联系电话" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="客户姓名" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="form.sex" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.sex"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="form.phone" style="width: 370px;" />
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
        <el-table-column prop="name" label="客户姓名" />
        <el-table-column prop="sex" label="性别">
          <template slot-scope="scope">
            {{ dict.label.sex[scope.row.sex] }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" />
        <el-table-column v-if="checkPer(['admin','guest:edit','guest:del'])" label="操作" width="150px" align="center">
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
import crudGuest from '@/api/massage/guest'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, name: null, sex: null, phone: null }
export default {
  name: 'Guest',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['sex'],
  cruds() {
    return CRUD({ title: 'guest', url: 'api/guest', idField: 'id', sort: 'id,desc', crudMethod: { ...crudGuest }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'guest:add'],
        edit: ['admin', 'guest:edit'],
        del: ['admin', 'guest:del']
      },
      rules: {
        name: [
          { required: true, message: '客户姓名不能为空', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '性别不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '客户姓名' },
        { key: 'sex', display_name: '性别' },
        { key: 'phone', display_name: '联系电话' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
