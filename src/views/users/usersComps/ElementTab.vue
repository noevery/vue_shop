<template>
  <div>
  <el-table
          :data="userList"
          border
          stripe>
    <el-table-column type="index" label="序号"></el-table-column>
    <el-table-column prop="username" label="姓名"></el-table-column>
    <el-table-column prop="email" label="邮箱"></el-table-column>
    <el-table-column prop="mobile" label="电话"></el-table-column>
    <el-table-column prop="role_name" label="角色"></el-table-column>
    <el-table-column prop="mg_state" label="状态">
      <template v-slot="scope">
        <el-switch v-model="scope.row.mg_state" @change="changeUsetStatus(scope.row)"></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="180px">
      <template v-slot="scope">
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row.id)"></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)"></el-button>
        <el-tooltip effect="dark"
                    content="分配角色"
                    placement="top"
                    :enterable="false">
          <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
<!--    修改用户-->
    <edit-user :editUserDialogVisible="editUserDialogVisible"
               @isEditUser="isEditUser"
               :userForm="editUserData" />
  </div>
</template>

<script>
  import EditUser from  './EditUser'

  import {  modifyUserStatus,
            getUserId,
    // deleteUser
  } from "network/getUser";

  // import { throttle } from "common/utls";

  export default {
    name: "ElementTab",
    components: {
      EditUser
    },
    props: {
      userList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        editUserDialogVisible: false,
        editUserData: {}
      }
    },
    methods: {
      changeUsetStatus: function (userinfo) {
        modifyUserStatus(userinfo.id, userinfo.mg_state).then(res => {
          const data = res.data;
          console.log(data);
          if (data.meta.status !== 200) return this.$message.error(data.meta.msg);
          return this.$message.success(data.meta.msg);
        })
      },
      //修改用户
      editUser(id) {
        this.editUserDialogVisible = true;
        getUserId(id).then(res => {
          const data = res.data;
          if(data.meta.status !== 200) return this.$message(data.meta.msg);
          this.editUserData = data.data;
        })
      },
      // 删除用户
      async removeUser(id) {
        // 点击确定返回字符串 confirm
        // 点击取消返回字符串 cancel
        // 必须catch捕获错误，否则后台报错
        const confirmResult = await this.$confirm(
                '是否永久删除该用户？',
                '删除用户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if (confirmResult !== 'confirm') return ;
        // const { data: res } = await deleteUser(id);
        // if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // this.$message.success(res.meta.msg);
      },
      // 重新赋值
      isEditUser(value) {
        this.editUserDialogVisible = value;
      }
    }
  }
</script>

<style scoped>
  .el-table {
    margin-top: 20px;
    font-size: 12px;
  }
</style>