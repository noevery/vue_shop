<template>
  <!--    添加用户提示-->
  <el-dialog
          title="添加用户"
          :visible.sync="isAddUserDialogVisible"
          width="50%"
          @close="modifyAddUser(isAddUserDialogVisible)">
<!--    表单-->
    <el-form :model="userForm"
             :rules="userFormRules"
             ref="addUserFormRef"
             label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="userForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="userForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="userForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="userForm.mobile"></el-input>
      </el-form-item>
    </el-form>
<!--    提交-->
    <span slot="footer" class="dialog-footer">
        <el-button @click="isAddUserDialogVisible = false">取 消</el-button>
       <el-button type="primary" @click="addUserConfirm">确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
  // import { formCheck } from "common/utls";

  import { addUsers } from 'network/getUser'

  import { formRules } from "common/mixins";

  export default {
    name: "AddUserPrompt",
    props: {
      addUserDialogVisible: {
        type: Boolean,
        default() {
          return true
        }
      }
    },
    mixins: [formRules],
    data() {

      return {
        isAddUserDialogVisible: false,
        userForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        userFormRules: {
          username: [
            { required: true, message: '请输入用户名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
            ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
        }
      }
    },
    watch: {
      addUserDialogVisible() {
        this.isAddUserDialogVisible = this.addUserDialogVisible;
      }
    },
    methods: {
      //关闭对话框后执行
      modifyAddUser(value) {
        this.$emit('modifyAddUser', value);
        this.$refs.addUserFormRef.resetFields();
      },
      // 确认添加用户
      addUserConfirm() {
        //  562162421@qq.com
        this.$refs.addUserFormRef.validate(valid => {
          if (!valid) return ;
          addUsers(this.userForm).then(res => {
            console.log(this.userForm);
            console.log(res);
            const data = res.data;
            if (data.meta.status !== 201) return this.$message.error(data.meta.msg);
            this.$message.success(data.meta.msg);
            this.isAddUserDialogVisible = false;
          })
        });
      }
    }
  }
</script>

<style scoped>

</style>