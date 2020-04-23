<template>
  <div>
<!--    面包屑-->
    <elment-break :breakList="breakList"/>
<!--    卡片视图-->
    <el-card>
          <el-alert show-icon
                    title="注意：只允许为第三级分类设置相关参数！"
                    type="warning"></el-alert>
      <el-row class="cat_pot">
        <el-col>
          <span>商品分类：
<!--            级联选择框-->
            <el-cascader
                    :options="cateList"
                    :props="cateProps"
                    v-model="chooseCateId"
                    :show-all-levels="false"
                    @change="handleChanged"
                    clearable></el-cascader>
          </span>
        </el-col>
      </el-row>
<!--      tabs 标签页-->
      <el-tabs v-model="activeTabsName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary"
                     :disabled="isBtnDisabled"
                     @click="CateParamsDialog = true">添加参数</el-button>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary"
                     :disabled="isBtnDisabled"
                     @click="CateParamsDialog = true">添加参数</el-button>
        </el-tab-pane>
<!--        参数表格-->
        <el-table :data="TableData" border stripe>
<!--          展开列-->
          <el-table-column type="expand">
            <template v-slot="scope">
              <el-tag v-for="(item, index) in scope.row.attr_vals"
                      :key="index"
                      closable
                      @close="deleteTag(index, scope.row)">
                {{item}}
              </el-tag>
              <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button v-else
                         class="button-new-tag"
                         size="small"
                         @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
<!--          索引列-->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="btnModifyCateParams(scope.row)">修改</el-button>
              <el-button type="danger" icon="el-icon-search" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tabs>
    </el-card>
<!--    添加动态参数/属性对话框-->
    <el-dialog
            :title="'添加' + cateParamsTitle"
            :visible.sync="CateParamsDialog"
            width="50%"
            @close="closeAddParams">
<!--      表单-->
      <el-form :model="cateParamsForm"
               :rules="cateParamsRule"
               ref="cateParamsRef"
               label-width="100px">
        <el-form-item :label="cateParamsTitle" prop="attr_name">
          <el-input v-model="cateParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="CateParamsDialog = false">取 消</el-button>
        <el-button type="primary" @click="btnAddCateParams">确 定</el-button>
      </span>
    </el-dialog>
<!--    修改参数-->
    <el-dialog
            :title="'修改'+ cateParamsTitle"
            :visible.sync="modifyParamsDialog"
            width="50%"
            @close="closeModifyParams">
      <el-form :model="modifyParamsForm"
               :rules="modifyParamsRules"
               ref="cateIdDataRef"
               label-width="100px">
        <el-form-item :label="cateParamsTitle" prop="attr_name">
          <el-input v-model="modifyParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyParamsDialog = false">取 消</el-button>
        <el-button type="primary" @click="btnComfirmParams">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>

  import ElmentBreak from 'components/content/elBreak/ElmentBreak'

  import { getCate,
           getCateParams,
           addCateParams,
           modifyCateParams,
           deleteParams } from "network/getGoods";

  export default {
    name: "Params",
    components: {
      ElmentBreak
    },
    data() {
      return {
        breakList: ['商品管理', '参数列表'],
        cateList: [],
      //  级联选择框的配置选项
        cateProps: {
          expandTrigger: 'hover',
          label: 'cat_name',
          value: 'cat_id',
          children: 'children'
        },
      //  级联选择框双向绑定的数据
        chooseCateId: [],
      //  tab 标签页当前活跃的name属性
        activeTabsName: 'many',
      //  分类的id
        cateId: null,
      //  动态参数数据
        TableData: [],
      //  动态参数数据
      //   manyTableData: [],
      //  静态属性数据
      //   onlyTaleData: []
      //  控制增加参数对话框的显示/隐藏
        CateParamsDialog: false,
      //  控制修改参数对话框的显示/隐藏
        modifyParamsDialog: false,
      //  添加参数表单绑定的数据
        cateParamsForm: {},
      //  添加参数表单验证
        cateParamsRule: {
          attr_name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
          ],
        },
        //修改参数表单绑定的数据
        modifyParamsForm: {},
      //  修改参数表单验证
        modifyParamsRules: {
          attr_name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
          ],
        },
      }
    },
    computed: {
      isBtnDisabled() {
        return this.chooseCateId.length !== 3
      },
      cateParamsTitle() {
        return this.activeTabsName === 'many' ? '动态参数' : '静态属性';
      }
    },
    // watch: {
    //   TableData() {
    //     this.getCateParams(this.cateId, this.activeTabsName)
    //   }
    // },
    created() {
      this.getCate()
    },
    methods: {
      //  级联选择框选中时触发事件
      handleChanged() {
        if (this.chooseCateId.length !== 3) {
          this.chooseCateId = [];
          this.TableData = [];
          return ;
        }
        this.cateId = this.chooseCateId[2];
        this.getCateParams(this.cateId, this.activeTabsName)
      },
      //  tabs 标签页点击
      handleClick() {
        this.getCateParams(this.cateId, this.activeTabsName);
      },
    //  确定添加参数
      btnAddCateParams() {
        this.$refs.cateParamsRef.validate(valid => {
          if (!valid) return ;
          this.addCateParams();
          this.getCateParams(this.cateId, this.activeTabsName);
          this.CateParamsDialog = false;
        })
      },
    //   关闭添加参数对话框执行函数
      closeAddParams() {
        this.getCateParams(this.cateId, this.activeTabsName);
        this.$refs.cateParamsRef.resetFields();
      },
    //   点击修改参数
      btnModifyCateParams(cate) {
        this.modifyParamsForm =  cate;
        this.modifyParamsDialog = true;
      },
    //  确定修改参数
      btnComfirmParams() {
        this.$refs.cateIdDataRef.validate(valid => {
          if (!valid) return ;
          this.modifyCateParams(this.cateId,
                  this.modifyParamsForm.attr_id,
                  this.modifyParamsForm.attr_name,
                  this.modifyParamsForm.attr_sel,
                  this.modifyParamsForm.attr_vals.join(' '),
          );
          console.log(this.modifyParamsForm);
          this.getCateParams(this.cateId, this.activeTabsName)
          this.modifyParamsDialog = false
        });
      },
    //  关闭修改参数对话框时触发的事件
      closeModifyParams() {

        this.$refs.cateIdDataRef.resetFields()
      },
      //文本框失去焦点，或按下了Enter键都会触发事件
      handleInputConfirm(row) {
        //如果用户输入的内容为空，则在失去焦点的时候隐藏输入框
        if (row.inputValue.trim().length === 0) {
          row.inputValue = ''
          return row.inputVisible = false;
        }
        row.attr_vals.push(row.inputValue);
        this.modifyCateParams(
                this.cateId,
                row.attr_id,
                row.attr_name,
                row.attr_sel,
                row.attr_vals.join(' ')
        );
        console.log(row);
        row.inputValue = '';
        row.inputVisible = false;
      },
      //点击按钮展示文本输入框
      showInput(row) {
        row.inputVisible = true;
        //让文本框自动获得焦点
        //$nextTick  方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      //删除Tag标签
      deleteTag(index, row) {
        console.log(row);
        row.attr_vals.splice(index, 1);
        this.modifyCateParams(
                this.cateId,
                row.attr_id,
                row.attr_name,
                row.attr_sel,
                row.attr_vals.join(' ')
        );
      },

    //  网络请求
      // 商品分类管理
      async getCate() {
        const { data: res } = await getCate({});
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.cateList = res.data;
      },
      //  分类参数管理
      async getCateParams(id, sle) {
        const { data: res } = await getCateParams(id, sle);
        if (res.meta.status !== 200) return ;
        res.data.forEach(item => {
          //数组的切割
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
          //  添加控制按钮与文本的切换和显示的属性
          item.inputVisible = false;
          //  文本框中的输入内容
          item.inputValue = ''
        });
        if (this.activeTabsName === 'many') return this.TableData = res.data;

        this.TableData = res.data;

      },
      //  添加动态参数或者静态属性
      async addCateParams() {
        const { data: res } = await addCateParams(
                this.cateId,
                this.cateParamsForm.attr_name,
                this.activeTabsName,
        );
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
      },
      // //  根据 id 查询参数
      // async getIdCate(id, attrld, attr_sel, attr_vals) {
      //   const { data: res } = await getIdCate(id, attrld, attr_sel, attr_vals);
      //   if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      //   this.modifyParamsForm = res.data;
      // },
    //  编辑提交参数
      async modifyCateParams(id, attrId, attr_name, attr_sel, attr_vals) {
        const { data: res } = await modifyCateParams(id, attrId, attr_name, attr_sel, attr_vals);
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg)

      },
    //  删除参数
      async deleteParams(attr_id) {
        const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
       if (confirmResult !== 'confirm') return this.$message('取消删除');
        const { data: res } = await deleteParams(this.cateId, attr_id);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.getCateParams(this.cateId, this.activeTabsName);
      }
    }
  }
</script>

<style scoped>
  .cat_pot {
    margin: 15px 0;
  }
  .el-table {
    margin: 15px 0;
  }
  .el-tag {
    margin: 0 10px;
  }
  .button-new-tag {
    width: 120px;
    margin: 10px;
  }
  .input-new-tag {
    width: 120px;
    margin: 10px;
  }
</style>