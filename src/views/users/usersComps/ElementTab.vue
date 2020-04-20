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
          <el-button type="warning"
                     icon="el-icon-setting"
                     size="mini"
                     @click="allotUser(scope.row)"></el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
<!--    修改用户-->
    <edit-user :editUserDialogVisible="editUserDialogVisible"
               @isEditUser="isEditUser"
               :userForm="editUserData" />
<!--    分配用户-->
    <el-dialog
            title="分配角色"
            :visible.sync="allotUserDialogVisible"
            width="50%">
      <p>当前用户：{{currentUser.username}}</p>
      <p>当前角色：{{currentUser.role_name}}</p>
      <p>分配新角色：
        <el-select v-model="selectUserId"
                   :placeholder="currentUser.role_name">
          <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
          </el-option>
        </el-select>
      </p>
      <span slot="footer">
        <el-button @click="allotUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotUserDialog">确 定</el-button>
     </span>
    </el-dialog>
  </div>
</template>

<script>
  import EditUser from  './EditUser'

  import {  modifyUserStatus,
            getUserId,
            deleteUser,
            allotUser
  } from "network/getUser";
  import { getRoleList } from "network/getRights";

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
        //获取修改前用户的数据
        editUserData: {},
        allotUserDialogVisible: false,
      //  获取当前用户数据
        currentUser: {},
      //  保存下拉选中的id
        selectUserId: '',
      //  保存角色列表
        roleList: []
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
        const { data: res } = await deleteUser(id);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg);
        this.$parent.getUserList();
      },
      // 重新赋值
      isEditUser(value) {
        this.editUserDialogVisible = value;
      },
      //分配用户角色
      async allotUser(currentUser) {
        this.currentUser = currentUser;
        const { data: res } = await getRoleList();
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.roleList = res.data;
        this.allotUserDialogVisible = true;
      },
      //确定分配角色
      async allotUserDialog() {
        const { data: res } = await allotUser(this.currentUser.id, this.selectUserId);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.$parent.getUserList();
        this.allotUserDialogVisible = false;
      },
    }
  }
</script>

<style scoped>
  .el-table {
    margin-top: 20px;
    font-size: 12px;
  }
  .el-dialog  p {
    margin: 10px 0;
  }
</style>