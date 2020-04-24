<template>
  <div>
    <elment-break :breakList="breakList" />
    <el-card>
      <div id="main" style="width: 800px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>

  import ElmentBreak from 'components/content/elBreak/ElmentBreak'
  //导入  echarts  可视化数据插件
  import echarts from 'echarts'

  import _ from 'lodash'

  import { getReport } from "network/getReport";

  export default {
    name: "Report",
    components: {
      ElmentBreak
    },
    created() {

    },
    async mounted() {
      const { data: res} = await getReport();
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      const myChart = echarts.init(document.getElementById('main'));
      const result = _.merge(res.data, this.options)
      myChart.setOption(result)
    },
    data() {
      return {
        breakList: ['数据统计', '数据报表'],
        options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        },
      }
    },
    methods: {

    }
  }
</script>

<style scoped>

</style>