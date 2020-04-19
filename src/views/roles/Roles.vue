<template>
  <div>
    <elment-break :breakList="breakList"/>
    <roles-card :roleList="roleList"/>
  </div>
</template>

<script>
  import ElmentBreak from 'components/content/elBreak/ElmentBreak'
  import RolesCard from './childComps/RolesCard'

  import { getRoleList } from "network/getRights";

  export default {
    name: "Roles",
    components: {
      ElmentBreak,
      RolesCard
    },
    data() {
      return {
        breakList: ['角色管理', '角色列表'],
        roleList: []
      }
    },
    created() {
      this.getRoleList();
    },
    methods: {
      async getRoleList() {
        const {data: res} = await getRoleList();
        if (res.meta.status !== 200) return ;
        this.roleList = res.data;
      }
    }
  }
</script>

<style scoped>
  .el-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  }
</style>