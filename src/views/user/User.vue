<script>
import { getCurrentInstance, onMounted, ref, reactive } from 'vue'

export default {
  setup() {
    const { proxy } = getCurrentInstance()
    const list = ref([])

    const tableLabel = reactive([
      {
        prop: "name",
        label: "姓名",
      },
      {
        prop: "age",
        label: "年龄",
      },
      {
        prop: "sexLabel",
        label: "性别",
      },
      {
        prop: "birth",
        label: "出生日期",
        width: 200,
      },
      {
        prop: "addr",
        label: "地址",
        width: 320,
      },
    ]);

    const config = reactive({
      total: 0,
      page: 1,
      name: ''
    })

    const formInline = reactive({
      keyWord: ''
    })

    const getUserData = async (config) => {
      let res = await proxy.$api.getUserData(config)
      console.log(res)
      config.total = res.count
      list.value = res.list.map((item) => {
        item.sexLabel = item.sex === 0 ? '女' : '男'
        return item
      })
    }

    const changePage = (page) => {
      console.log(page)
      config.page = page
      getUserData(config)
    }
    const handleSearch = () => {
      config.name = formInline.keyWord
      getUserData(config)
    }

    // 控制模态框的显示与隐藏
    const dialogVisible = ref(false)

    const handleClose = () => {
      ElMessageBox.confirm('确定关闭吗?')
        .then(() => {
          proxy.$refs.userForm.resetFields()
          done()
        })
        .catch(() => {
          // catch error
        })
    }

    // 添加用户的form数据
    const formUser = reactive({
      name: '', // 添加用户名
      age: '',
      sex: '',
      birth: '',
      addr: ''
    })

    // 日期格式化
    const timeFormat = (time) => {
      var time = new Date(time)
      var year = time.getFullYear()
      var month = time.getMonth() - 1
      var date = time.getDate()

      function add(m) {
        return m < 10 ? '0' + m : m
      }
      return add(year) + '-' + add(month) + '-' + add(date)
    }

    // 添加用户
    const onSubmit = () => {
      proxy.$refs.userForm.validate(async (valid) => {
        if (valid) {
          if (action.value == 'add') {
            // 新增接口
            formUser.birth = timeFormat(formUser.birth)
            let res = await proxy.$api.addUser(formUser)
            console.log(res)
            if (res) {
              // 表单重置
              proxy.$refs.userForm.resetFields()
              dialogVisible.value = false
              getUserData(config)
            }
          } else {
            // 编辑接口
            formUser.sex == '男' ? (formUser.sex = 1) : (formUser.sex = 0)
            let res = await proxy.$api.editUser(formUser)
            console.log(res)
            if (res) {
              // 表单重置
              proxy.$refs.userForm.resetFields()
              dialogVisible.value = false
              getUserData(config)
            }
          }
        } else {
          ElMessage({
            showClose: true,
            message: '请输入正确的内容',
            type: 'error'
          })
        }
      })
    }

    // 表单取消事件
    const handleCancel = () => {
      proxy.$refs.userForm.resetFields()
      dialogVisible.value = false
    }

    // 区分编辑和新增的变量
    const action = ref('add')

    // 编辑用户
    const handleEdit = (row) => {
      dialogVisible.value = true
      action.value = 'edit'
      console.log(row)
      row.sex == 1 ? (row.sex = '男') : (row.sex = '女')
      proxy.$nextTick(() => {
        // 浅拷贝赋值
        Object.assign(formUser, row)
      })

    }

    // 新增用户
    const handleAdd = () => {
      action.value = 'add'
      dialogVisible.value = true
    }

    // 删除用户
    const handleDelete = (row) => {
      ElMessageBox.confirm('确定删除吗?')
        .then( async () => {
          await proxy.$api.deleteUser({
            id: row.id
          })

          ElMessage({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })

          getUserData(config)
        })
        .catch(() => {
          // catch error
        })
    }

    onMounted(() => {
      getUserData(config)
    })

    return {
      list,
      tableLabel,
      config,
      changePage,
      formInline,
      handleSearch,
      dialogVisible,
      formUser,
      onSubmit,
      handleCancel,
      handleClose,
      handleEdit,
      action,
      handleAdd,
      handleDelete
    }
  },
}
</script>

<template>
  <div class="user-header">
    <el-button type="primary" @click="handleAdd">新增</el-button>
    <el-form :inline="true" :model="formInline">
      <el-form-item label="请输入">
        <el-input v-model="formInline.keyWord" placeholder="请输入用户名" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="table">
    <el-table :data="list" style="width: 100%" height="525px">
      <el-table-column v-for="item in tableLabel" :key="item.prop" :label="item.label" :prop="item.prop"
        :width="item.width ? item.width : 125" />
      <el-table-column fixed="right" label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button link type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination small background layout="prev, pager, next" :total="config.total" @current-change="changePage"
      class="mt-4 pager" />
  </div>

  <el-dialog v-model="dialogVisible" :title="action == 'add' ? '新增用户' : '编辑用户'" width="40%" :before-close="handleClose">
    <el-form :inline="true" :model="formUser" ref="userForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name" :rules="[{ required: true, message: '姓名是必填项' }]">
            <el-input v-model="formUser.name" placeholder="请输入姓名" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年龄" prop="age"
            :rules="[{ required: true, message: '年龄是必填项' }, { type: 'number', message: '年龄必须是数字' }]">
            <el-input v-model.number="formUser.age" placeholder="请输入年龄" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="性别" prop="sex" :rules="[{ required: true, message: '性别是必填项' }]">
            <el-select v-model="formUser.sex" placeholder="请选择" clearable>
              <el-option label="男" value="0" />
              <el-option label="女" value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生日期" prop="birth" :rules="[{ required: true, message: '出生日期是必填项' }]">
            <el-form-item>
              <el-date-picker v-model="formUser.birth" type="date" placeholder="请输入" clearable />
            </el-form-item>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="地址" prop="addr" :rules="[{ required: true, message: '地址是必填项' }]">
            <el-input v-model="formUser.addr" placeholder="请输入地址" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="justify-content:flex-end">
        <el-form-item>
          <el-button type="primary" @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<style lang="less" scoped>
.table {
  position: relative;
  padding-bottom: 10px;

  .pager {
    position: absolute;
    right: 0;
    bottom: -20px;
  }
}

.user-header {
  display: flex;
  justify-content: space-between;
}
</style>