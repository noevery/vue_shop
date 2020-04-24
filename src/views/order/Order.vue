<template>
  <div>
    <elment-break :breakList="breakList" />
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" >
              <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
<!--      表格-->
      <el-table
              :data="orderList"
              border
              style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单号" />
        <el-table-column prop="order_price" label="订单价格" />
        <el-table-column prop="pay_status" label="是否付款">
          <template v-slot="scope">
            <el-tag size="mini" type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag size="mini" type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" />
        <el-table-column label="下单时间">
          <template v-slot="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="addressDialog = true"></el-button>
            <el-button type="success"
                       icon="el-icon-location"
                       size="mini"
                       @click="showProgressDialog"></el-button>
          </template>
        </el-table-column>
      </el-table>
<!--      分页-->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
<!--      修改地址对话框-->
      <el-dialog
              title="修改地址"
              :visible.sync="addressDialog"
              width="50%" @close="closeAddres">
        <el-form :model="addresForm"
                 :rules="addresRules"
                 ref="addresFormRef"
                 label-width="100px">
          <el-form-item label="省市区/县" prop="addres1">
            <el-cascader
                    v-model="addresForm.addres1"
                    :options="cityData"
                    :props="{ expandTrigger: 'hover' }"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="addres2">
            <el-input v-model="addresForm.addres2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addressDialog = false">取 消</el-button>
          <el-button type="primary" @click="addressDialog = false">确 定</el-button>
        </span>
      </el-dialog>
<!--      物流进度对话框-->
      <el-dialog
              title="提示"
              :visible.sync="progressDialog"
              width="50%">
        <el-timeline reverse>
          <el-timeline-item
                  v-for="(activity, index) in progressInfo"
                  :key="index"
                  :timestamp="activity.time">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>

  import ElmentBreak from 'components/content/elBreak/ElmentBreak'

  import { getOrder, getProgress } from "network/getOrder";
  //省市县区数据
  import cityData from './citydata'

  export default {
    name: "Order",
    components: {
      ElmentBreak
    },
    data() {
      return {
        breakList: ['订单管理', '订单列表'],
        //查询的参数
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10
        },
        //订单参数
        orderList: [],
        //总条数
        total: 0,
        addresForm: {
          addres1: [],
          addres2: ''
        },
        addresRules: {
          addres1: [
            { required: true, message: '请选择省区县市', trigger: 'blur' }
            ],
          addres2: [
            { required: true, message: '请填写详细地址', trigger: 'blur' }
          ],
        },
        addressDialog: false,
        progressDialog: false,
        cityData,
        progressInfo: []
      }
    },
    created() {
      this.getOrder();
    },
    methods: {
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getOrder();
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getOrder();
      },
      closeAddres() {
        this.$refs.addresFormRef.resetFields()
      },
      //点击显示物流进度
      showProgressDialog() {
        this.progressDialog = true
        this.getProgress('1106975712662');
      },
      //网络请求
      //获取订单参数列表
      async getOrder() {
        const { data: res } = await getOrder(this.queryInfo);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.orderList = res.data.goods;
        this.total = res.data.total
      },
      //查看物流信息
      async getProgress(id) {
        const { data: res } = await getProgress(id);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.progressInfo = res.data;
        console.log(this.progressInfo);
      }
    }
  }
</script>

<style scoped>
  .el-table {
    margin: 15px 0;
  }
  .el-pagination {
    text-align: right;
  }
  .el-cascader {
    width: 100%;
  }
</style>