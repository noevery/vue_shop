<template>

  <el-card >
    <el-row :gutter="30">
      <el-col :span="14">
<!--        搜索-->
        <el-input placeholder="请输入内容"
                  v-model="userQuery.query"
                  clearable
                  @clear="allUserList">
          <el-button slot="append"
                     icon="el-icon-search"
                     @click="queryUsers"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
<!--        添加用户按钮-->
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="isAddUserDialogVisible">添加用户</el-button>
      </el-col>
    </el-row>
    <add-user-prompt :addUserDialogVisible="addUserDialogVisible"
                     @modifyAddUser="modifyAddUser" />
  </el-card>

</template>

<script>
  import AddUserPrompt from './AddUserPrompt'

  export default {
    name: "ElementCard",
    props: {
      userQuery: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    components: {
      AddUserPrompt
    },
    data() {
      return {
        addUserDialogVisible: false
      }
    },
    methods: {
      queryUsers() {
        if (!this.userQuery.query) return ;
        this.userQuery.pagenum = 1;
        this.$parent.getUserList();
      },
      allUserList() {
        this.$parent.getUserList();
      },
      //显示或隐藏对话框
      isAddUserDialogVisible() {
        this.addUserDialogVisible = true;
      },
      modifyAddUser(value) {
        this.addUserDialogVisible = value;
      }
    },
  }
</script>

<style scoped>
  .el-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  }
</style>