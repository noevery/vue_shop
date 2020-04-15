<template>
  <div>
    <el-button type="info" @click="clickExit">退出</el-button>
  </div>
</template>

<script>
  export default {
    name: "Home",
    methods: {
      // 退出登录
      clickExit() {
        window.sessionStorage.clear();
        this.$router.replace('/login');
      }
    }
  }
</script>

<style scoped>

</style>