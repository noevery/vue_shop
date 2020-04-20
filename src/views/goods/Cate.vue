<template>
  <div>
    <elment-break :breakList="breakList" />
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="btnAddCate">添加分类</el-button>
        </el-col>
      </el-row>
<!--      表格-->
     <tree-table class="tree-table" :data="cateList"
                 :columns="columns"
                 show-index
                 :selection-type="false"
                 :expand-type="false"
                 border>
<!--       是否有效-->
       <template slot="isOk" slot-scope="scope">
         <i class="el-icon-success" v-if="!scope.row.is_promot" style="color: lightgreen"></i>
         <i class="el-icon-error" v-else style="color: red"></i>
       </template>
       <template slot="order" slot-scope="scope">
         <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
         <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级级</el-tag>
         <el-tag type="warning" size="mini" v-else-if="scope.row.cat_level === 2">三级</el-tag>
       </template>
       <template slot="handle">
          <el-button icon="el-icon-edit" type="primary" size="mini"></el-button>
          <el-button icon="el-icon-delete" type="danger" size="mini"></el-button>
       </template>
    </tree-table>
<!--      分页功能-->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="this.cateInfo.pagenum"
              :page-sizes="[3, 5, 7, 10]"
              :page-size="this.cateInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
<!--    添加分类对话框-->
    <el-dialog
            title="添加分类"
            :visible.sync="addCateDialog"
            width="50%"
            @close="closeAddCate">
<!--      表单-->
      <el-form :model="addCateForm"
               status-icon
               :rules="addCateRules"
               ref="addCateRef"
               label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader
                  :options="parentCate"
                  :props="parentProps"
                  v-model="chooseParentCateId"
                  :show-all-levels="false"
                  change-on-select
                  clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialog = false">取 消</el-button>
         <el-button type="primary" @click="addParentCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import ElmentBreak from 'components/content/elBreak/ElmentBreak'

  import { getCate, addCate } from "network/getGoods";

  export default {
    name: "Cate",
    components: {
      ElmentBreak,
    },
    data() {
      return {
        breakList: ['商品管理', '商品分类'],
        cateInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        //商品数据
        cateList: [],
        //总条数
        total: 0,
        //tree-table指定的列
        columns: [
          {
            label: '分类名称',
             prop: 'cat_name'
           },
          // 是否有效
          { label: 'isOk',
            //当前列定义为作用域插槽
            type: 'template',
            //使用作用域插槽
            template: 'isOk',
          },
          // 排序
          { label: '排序',
            type: 'template',
            template: 'order',
          },
          // 操作
          { label: '操作',
            type: 'template',
            template: 'handle',
          }
        ],
        addCateDialog: false,
      //  表单验证规则
        addCateRules: {
          cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
          ]
        },
        // 表单绑定的数据
        addCateForm: {
          cat_name: '',
          cat_pid: 0,
          cat_level: 0
        },
      //  获取父级分类
        parentCate: [],
        parentProps: {
          expandTrigger: 'hover',
          label: 'cat_name',
          value: 'cat_id',
          children: 'children'
        },
      //  选中的分类Id
        chooseParentCateId: []
      }
    },
    created() {
      this.getCate(this.cateInfo);
    },
    methods: {
     async getCate(params) {
        const { data: res } = await getCate(params);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.cateList = res.data.result;
        this.total = res.data.total;
     },
      handleSizeChange(newSize) {
        this.cateInfo.pagesize = newSize;
        this.getCate(this.cateInfo);
      },
      handleCurrentChange(newPage) {
        this.cateInfo.pagenum = newPage;
        this.getCate(this.cateInfo);
      },
      async btnAddCate(){
       const { data: res } = await getCate({type: 2});
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.parentCate = res.data;
        console.log(this.parentCate);
        this.addCateDialog = true;
      },
      //添加分类
      addParentCate() {
        if(this.chooseParentCateId.length !== 0) {
          this.addCateForm.cat_pid = this.chooseParentCateId[this.chooseParentCateId.length - 1];
          this.addCateForm.cat_level = this.chooseParentCateId.length;
        }
       this.$refs.addCateRef.validate(async valid => {
         if(!valid) return;
         const { data: res } = await addCate(this.addCateForm);
         if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
         this.$message.success(res.meta.msg);
         this.addCateDialog = false;
         this.getCate(this.cateInfo);
       })
      },
    //  关闭添加分类对话框的回调
      closeAddCate() {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
        this.chooseParentCateId = [];
        this.$refs.addCateRef.resetFields()
      }
    }
  }
</script>

<style scoped>
  .tree-table {
    margin: 20px 0;
  }
  .el-pagination {
    text-align: right;
  }
  .el-cascader {
    width: 100%;
  }
</style>