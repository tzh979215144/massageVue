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
          <el-form-item v-if="false" label="店长ID" prop="managerId">
            <el-input v-model="form.massagerId" style="width: 370px;" />
          </el-form-item>
          <el-form-item :show-overflow-tooltip="true" label="店长名字" prop="name">
            <el-autocomplete
              v-model="form.managerName"
              popper-class="my-autocomplete"
              style="width: 370px;"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入店长名字"
              @select="updateMassagerId($event)"
            >
              <li
                slot="suffix"
                class="el-icon-edit el-input__icon"
              />
              <template slot-scope="{ item }">
                <div class="name">{{ item.value }}</div>
                <span class="info">{{ item.info }}</span>
              </template>

            </el-autocomplete>
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
        <el-table-column prop="managerId" label="店长ID">
          <!--          <template slot-scope="scope">-->
          <!--            {{ dict.label.sex[scope.row.sex] }}-->
          <!--          </template>-->
        </el-table-column>
        <el-table-column prop="managerName" label="店长名称" />
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

const defaultForm = { id: null, name: null, phone: null, website: null, managerId: null }
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
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '店铺名称' },
        { key: 'managerId', display_name: '店长ID' }
      ],
      massagers: [],
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
    initMassager: function() {
      getMassagers().then(data => {
        this.massagers = data.content
      })
    },
    querySearchAsync(queryString, callback) {
      var list = [{}]
      // 调用的后台接口
      const queryParams = {
        'name': queryString
      }
      // 从后台获取到对象数组
      getMassagers(queryParams).then(data => {
        list = data.content
        for (const i of list) {
          i.value = i.name // 将想要展示的数据作为value
        }
        // 在这里为这个数组中每一个对象加一个value字段, 因为autocomplete只识别value字段并在下拉列中显示
        list = list.filter(this.createFilter(queryString))
        callback(list)
      }).catch((error) => {
        console.log(error)
      })
    },
    handleSelect(item) {
      // item.value = item.value.split(":")[0]
      console.log(item)
      // do something
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1)
        // 后台已做筛选,不需再过滤
        // return (restaurant.value)
      }
    },
    updateMassagerId(event) {
      console.log(event)
      this.form.managerId = event.id // 赋值给后端需要的字段
      this.form.managerName = event.name // 赋值给后端需要的字段
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
