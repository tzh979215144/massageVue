<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">店铺ID</label>
        <el-input v-model="query.shopId" clearable placeholder="店铺ID" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">是否指定按摩师</label>
        <el-input v-model="query.isAssign" clearable placeholder="是否指定按摩师" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">按摩时长（按分钟算）</label>
        <el-input v-model="query.duration" clearable placeholder="按摩时长（按分钟算）" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">预约状态</label>
        <el-input v-model="query.status" clearable placeholder="预约状态" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
            <el-input
              v-model="form.duration"
              style="width: 370px;"
              @change="countEndTime($event)"
            />
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
        <el-table-column prop="guestId" label="客人">
          <template slot-scope="scope">
            {{ guestName(scope.row.guestId) }}
          </template>
        </el-table-column>
        <el-table-column prop="isAssign" label="是否指定按摩师">
          <template slot-scope="scope">
            {{ dict.label.is_assign[scope.row.isAssign] }}
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="按摩时长（按分钟算）" />
        <el-table-column prop="startTime" label="预约开始时间" />
        <el-table-column prop="endTime" label="预计结束时间" />
        <el-table-column prop="status" label="预约状态">
          <template slot-scope="scope">
            {{ dict.label.appointment_status[scope.row.status] }}
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
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getMassagers } from '@/api/massage/massager'
import { getGuests } from '@/api/massage/guest'
import { getShops } from '@/api/massage/shop'
import { addFromBooking } from '@/api/massage/massageRecord'

const defaultForm = { id: null, shopId: 1, massagerId: null, guestId: 2, isAssign: 0, duration: null, startTime: new Date(), endTime: null, status: 0 }
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
        { key: 'status', display_name: '预约状态' }
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
    arrivedShop(param) {
      if (param.status == 1) {
        return
      }
      param.status = 1
      crudMassageBooking.edit(param).then(data => {
      })
      param.remedialId = param.massagerId
      addFromBooking(param).then(data => {
        console.log('keyi ')
      })
      // let ids = [param.id]
      // crudMassageBooking.del(ids).then(data => {
      // });
    }
  }
}
</script>

<style scoped>

</style>
