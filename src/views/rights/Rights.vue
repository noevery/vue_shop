<template>
  <div>
    <elment-break :breakList="breakList" />
    <rights-card :rightsList="rightsList"/>
  </div>
</template>

<script>
  import ElmentBreak from 'components/content/elBreak/ElmentBreak'
  import RightsCard from './childComps/RightsCard'

  import { getRightsList } from "network/getRights";

  export default {
    name: "Rights",
    components: {
      ElmentBreak,
      RightsCard
    },
    data() {
      return {
        breakList: ['权限管理', '权限列表'],
        rightsList: []
      }
    },
    created() {
      // 请求权限列表数据
      this.getRightsList();
    },
    methods: {
      async getRightsList() {
        const { data: res } = await getRightsList('list');
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.rightsList = res.data;
      }
    }
  }
</script>

<style scoped>

</style>