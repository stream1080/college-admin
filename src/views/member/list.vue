<template>
  <div class="app-container">

    <!--查询表单-->
    <el-form :inline="true">
      <el-form-item>
        <!-- <el-input v-model="searchObj.name" placeholder="讲师"/> -->
        <el-input
          v-model="searchObj.nikename"
          class="inline-input"
          placeholder="会员昵称"
          value-key="nikename" />
      </el-form-item>

      <el-form-item>
        <el-input
          v-model="searchObj.mobile"
          class="inline-input"
          placeholder="手机号码"
          value-key="mibile" />
      </el-form-item>

      <el-form-item>
        <el-input
          v-model="searchObj.email"
          class="inline-input"
          placeholder="邮箱"
          value-key="email" />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form-item>
    </el-form>

    <!-- 工具条
    <div style="margin-bottom: 10px;">
      <el-button type="danger" size="mini" @click="batchRemove()">批量删除</el-button>
    </div> -->

    <!-- 表格 -->
    <el-table
      :data="list"
      border
      stripe
      @selection-change="handleSelectionChange">

      <el-table-column type="selection" />

      <el-table-column
        label="序号"
        width="50" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" width="80" align="center"/>
      <el-table-column prop="mobile" label="手机号码" width="120" align="center"/>
      <el-table-column prop="email" label="邮箱" width="200" align="center"/>
      <el-table-column prop="age" label="年龄" width="80" align="center"/>

      <el-table-column prop="sex" label="性别" width="100" align="center" >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.sex === 1" type="warning">男</el-tag>
          <el-tag v-if="scope.row.sex === 2" type="success">女</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="is_disabled" label="状态" width="100" align="center" >
        <template slot-scope="scope">
          <el-tag v-if="!scope.row.disabled" >正常</el-tag>
          <el-tag v-if="scope.row.disabled" type="danger">禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="注册时间" width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.gmtCreate }}
        </template>
      </el-table-column>

      <el-table-column label="最后一次修改时间" width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.gmtModified }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
          <router-link :to="'/member/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button v-if="!scope.row.disabled" size="mini" type="danger" @click="disableById(scope.row.id)">禁用</el-button>
          <el-button v-if="scope.row.disabled" size="mini" type="success" @click="availableById(scope.row.id)" >解禁</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20]"
      style="padding: 30px 0; text-align: center"
      layout="sizes, prev, pager, next, jumper, ->, total"
      @current-change="changeCurrentPage"
      @size-change="changePageSize"/>
  </div>
</template>

<script>
import memberApi from '@/api/member'

export default {

  data() {
    return {
      list: [], // 讲师列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 5, // 每页记录数
      searchObj: {}, // 查询表单
      multipleSelection: [] // 批量选中的记录列表
    }
  },

  created() {
    this.fetchData()
  },

  methods: {

    // 调用api模块，加载讲师列表
    fetchData() {
      memberApi.pageList(this.page, this.limit, this.searchObj).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
      })
    },

    // 改编页码
    changeCurrentPage(page) {
      console.log('changeCurrentPage:' + page)
      this.page = page
      this.fetchData()
    },

    // 改变每页记录数
    changePageSize(size) {
      console.log('changePageSize:' + size)
      this.limit = size
      this.fetchData()
    },

    // 重置表单
    resetData() {
      this.searchObj = {}
      this.fetchData()
    },

    // 禁用用户
    disableById(id) {
      // 询问是否删除
      this.$confirm('此操作将影响用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return memberApi.disableById(id)
      }).then(response => {
        // 刷新页面
        this.fetchData()
        // 弹出成功提示
        this.$message({
          message: response.message,
          type: 'success'
        })
      }).catch((err) => {
        console.log(err)
        if (err === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        }
      })
    },

    // 禁用用户
    availableById(id) {
      // 询问是否删除
      this.$confirm('此操作将影响用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(id)
        return memberApi.availableById(id)
      }).then(response => {
        // 刷新页面
        this.fetchData()
        // 弹出成功提示
        this.$message({
          message: response.message,
          type: 'success'
        })
      }).catch((err) => {
        console.log(err)
        if (err === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        }
      })
    },

    // 当表格中多选项发生变化的时候触发
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },

    // 批量删除
    batchRemove() {
      // 判断是否选中记录
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的记录'
        })
        return
      }

      // 询问是否删除
      this.$confirm('此操作将永久删除这些数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 拿到选中数据
        const idList = []
        this.multipleSelection.forEach(item => {
          idList.push(item.id)
        })
        return memberApi.batchRemove(idList)
      }).then(response => {
        // 刷新页面
        this.fetchData()
        // 弹出成功提示
        this.$message({
          message: response.message,
          type: 'success'
        })
      }).catch((err) => {
        console.log(err)
        if (err === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      })
    },

    // 输入建议
    querySearch(queryString, callback) {
      memberApi.selectNameListByKey(queryString).then(response => {
        callback(response.data.nameList)
      })
    }
  }
}
</script>
