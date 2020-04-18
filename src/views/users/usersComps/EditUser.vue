<template>
  <el-dialog
          title="修改用户"
          :visible.sync="isEditUserDialogVisible"
          width="50%"
          @close="modifyEditUser">
    <el-form :model="userForm"
             :rules="userFormRules"
             ref="userFormRef"
             label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="userForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="userForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="userForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
    <el-button @click="isEditUserDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserConfirm">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>

  import  { editUser } from "network/getUser";
  // import { formCheck } from "common/utls";

  import {formRules} from "common/mixins";
  export default {
    name: "EditUser",
    props: {
      editUserDialogVisible: {
        type: Boolean,
        default() {
          return false
        }
      },
      userForm: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    mixins: [formRules],
    data() {
      return {
        isEditUserDialogVisible: false,
      }
    },
    watch: {
      editUserDialogVisible() {
        this.isEditUserDialogVisible = this.editUserDialogVisible;
      }
    },
    methods: {
      // 关闭对话框时
      modifyEditUser() {
        this.$emit('isEditUser', this.isEditUserDialogVisible);
        this.$refs.userFormRef.resetFields();
      },
      // 确认修改
      editUserConfirm() {
        this.$refs.userFormRef.validate(valid => {
          if(!valid) return ;
          editUser(this.userForm.id, this.userForm.email, this.userForm.mobile).then(res => {
            console.log(res);
            const data = res.data;
            if (data.meta.status !== 200) return this.$message.error(data.meta.msg);
            this.$message.success(data.meta.msg);
            this.isEditUserDialogVisible = false
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>