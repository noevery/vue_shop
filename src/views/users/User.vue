<template>
  <div>
<!--    面包屑-->
    <elment-break :breakList="breakList" />
<!--        卡片视图-->
    <elment-card :userQuery.sync="userQuery" />
<!--        表格-->
    <elment-tab :user-list="userList" />
<!--    分页-->
    <element-page :userQuery="userQuery"
                  :total="total"
                  @handleSizeChange="handleSizeChange"
                  @handleCurrentChange="handleCurrentChange" />
  </div>
</template>

<script>
  import ElmentBreak from 'components/content/elBreak/ElmentBreak'
  import ElmentCard from './usersComps/ElementCard'
  import ElmentTab from './usersComps/ElementTab'
  import ElementPage from './usersComps/ElementPage'

  import {getUserList} from "network/getUser";

  export default {
    name: "User",
    components: {
      ElmentBreak,
      ElmentCard,
      ElmentTab,
      ElementPage
    },
    data() {
      return {
        breakList: ['用户管理', '用户列表'],
        userQuery: {
          query: '',
          pagenum: 1,
          pagesize: 4
        },
        userList: [],
        total: 0
      }
    },
    created() {
      this.getUserList();
    },
    methods: {
      getUserList() {
        getUserList(this.userQuery).then(res => {
          const data = res.data;
          if (data.meta.status !== 200) return data.meta.msg;
          this.total = data.data.total;
          this.userList = data.data.users;
        })
      },
      handleSizeChange(size) {
        this.userQuery.pagesize = size;
        this.getUserList();
      },
      handleCurrentChange(page) {
        this.userQuery.pagenum = page;
        this.getUserList();
      }
    },
  }
</script>

<style scoped>
</style>