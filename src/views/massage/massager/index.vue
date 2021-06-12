<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">姓名</label>
        <el-input v-model="query.name" clearable placeholder="姓名" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">性别</label>
        <!--        <el-input v-model="query.sex" clearable placeholder="性别" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" >-->
        <el-select v-model="query.sex" clearable placeholder="性别" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery">
          <el-option
            v-for="item in dict.sex"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!--        </el-input>-->
        <label class="el-form-item-label">等级</label>
        <el-input v-model="query.level" clearable placeholder="等级" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">是否持证</label>
        <el-input v-model="query.isDiplomate" clearable placeholder="是否持证" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="姓名" prop="name">
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
          <el-form-item label="等级" prop="level">
            <el-select v-model="form.level" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.massage_level"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否持证" prop="isDiplomate">
            <el-select v-model="form.isDiplomate" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.is_holder"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="底薪">
            <el-input-number v-model="form.wage"  :step="10" :min="0" :max="150" :rows="3" style="width: 195px;" />
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input v-model="form.info" :rows="3" type="textarea" style="width: 370px;" />
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
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="sex" label="性别">
          <template slot-scope="scope">
            {{ dict.label.sex[scope.row.sex] }}
          </template>
        </el-table-column>
        <el-table-column prop="level" label="等级">
          <template slot-scope="scope">
            {{ dict.label.massage_level[scope.row.level] }}
          </template>
        </el-table-column>
        <el-table-column prop="isDiplomate" label="是否持证">
          <template slot-scope="scope">
            {{ dict.label.is_holder[scope.row.isDiplomate] }}
          </template>
        </el-table-column>
        <el-table-column prop="wage" label="底薪"/>
        <el-table-column prop="info" label="备注信息" />
        <el-table-column v-if="checkPer(['admin','massager:edit','massager:del'])" label="操作" width="150px" align="center">
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
import crudMassager from '@/api/massage/massager'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, name: null, sex: null, level: null, isDiplomate: null, wage: null, info: null }
export default {
  name: 'Massager',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['sex', 'massage_level', 'is_holder'],
  cruds() {
    return CRUD({ title: 'massager', url: 'api/massager', idField: 'id', sort: 'id,desc', crudMethod: { ...crudMassager }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'massager:add'],
        edit: ['admin', 'massager:edit'],
        del: ['admin', 'massager:del']
      },
      rules: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '性别不能为空', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '等级不能为空', trigger: 'blur' }
        ],
        isDiplomate: [
          { required: true, message: '是否持证不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '姓名' },
        { key: 'sex', display_name: '性别' },
        { key: 'level', display_name: '等级' },
        { key: 'isDiplomate', display_name: '是否持证' }
      ]
    }
  },
  mounted() {
    this.crud.toQuery()
  }
  ,
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
