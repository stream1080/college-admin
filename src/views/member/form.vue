<template>
  <div class="app-container">
    <!-- 输入表单 -->
    <el-form label-width="100px">
      <el-form-item label="昵称" >
        <el-input v-model="member.nickname " />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="member.email" />
      </el-form-item>
      <el-form-item label="电话号码">
        <el-input v-model="member.mobile" />
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="member.sex">
          <el-option :value="1" label="男"/>
          <el-option :value="2" label="女"/>
          <el-option :value="3" label="其他"/>
        </el-select>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="member.age" />
      </el-form-item>

      <el-form-item label="会员头像">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError"
          :before-upload="beforeAvatarUpload"
          :action="member.avater"
          class="avatar-uploader">
          <img v-if="member.avatar" :src="member.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import memberApi from '@/api/member'

export default {

  data() {
    return {
      member: {
        sort: 0,
        level: 1
      },
      saveBtnDisabled: false, // 默认按钮可用
      BASE_API: process.env.BASE_API
    }
  },

  created() {
    console.log('form created被执行')

    if (this.$route.params.id) {
      this.fetchDataById(this.$route.params.id)
    }
  },

  methods: {
    saveOrUpdate() {
      console.log(this.member)
      this.saveBtnDisabled = true
      if (!this.member.id) {
        this.saveData()
      } else {
        this.updateData()
      }
    },

    // 数据保存
    saveData() {
      memberApi.save(this.member).then(response => {
        // 弹出成功提示
        this.$message({
          message: response.message,
          type: 'success'
        })
        this.$router.push({ path: '/member' })
      })
    },

    // 数据更新
    updateData() {
      memberApi.updateById(this.member).then(response => {
        // 弹出成功提示
        this.$message({
          message: response.message,
          type: 'success'
        })
        this.$router.push({ path: '/member' })
      })
    },

    // 根据id查询数据
    fetchDataById(id) {
      memberApi.getById(id).then(response => {
        this.member = response.data.item
      })
    },

    // 文件上传成功
    handleAvatarSuccess(response) {
      if (response.success) {
        this.member.avatar = response.data.url
        // 强制重新渲染
        this.$forceUpdate()
      } else {
        this.$message.error('上传失败! （非20000）')
      }
    },

    // 文件上传失败（http）
    handleAvatarError() {
      this.$message.error('上传失败! （http失败）')
    },

    // 文件上传前的校验
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' // MIME
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
