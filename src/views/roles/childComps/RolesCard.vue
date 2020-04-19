<template>
  <el-card>
    <el-row>
      <el-col>
        <el-button type="primary" >添加角色</el-button>
      </el-col>
    </el-row>
    <el-table :data="roleList" border stripe>
<!--       展开列-->
      <el-table-column type="expand">
        <template v-slot="scope">
<!--          一级权限-->
          <el-row v-for="(item1, index) in scope.row.children"
                  :class="['bdbottom', index === 0 ? 'bdtop' : '', 'vcenter']">
            <el-col :span="5">
              <el-tag type="primary" closable
                      @close="removeTag(scope.row, item1.id)">{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19">
<!--              二级权限和三级权限-->
              <el-row v-for="(item2, indey) in item1.children"
                      :key="item2.id"
                      :class="[indey === 0 ? '' : 'bdtop', 'vcenter']">
                <el-col :span="6">
                  <el-tag type="success"
                          closable
                          @close="removeTag(scope.row, item2.id)">{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag type="warning"
                          v-for="item3 in item2.children"
                          :key="item3.id"
                          closable
                          @close="removeTag(scope.row, item3.id)">{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
<!--          <pre>-->
<!--            {{scope.row}}-->
<!--          </pre>-->
        </template>
      </el-table-column>
<!--      索引列-->
      <el-table-column type="index" label="序号" />
      <el-table-column label="角色名称" prop="roleName"/>
      <el-table-column label="角色名称" prop="roleDesc"/>
      <el-table-column label="操作" width="300">
        <template v-slot="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
          <el-button type="warning" size="mini"
                     icon="el-icon-setting"
                     @click="btnSetRightsDialog(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
<!--    分配权限对话框-->
    <el-dialog
            title="提示"
            :visible.sync="setRightsDialog"
            width="50%">
<!--      树形数据-->
      <el-tree :data="rightsTree"
               :props="treeProps"
               show-checkbox
               node-key="id"
               default-expand-all
               :default-checked-keys="checkKeys" ref="rightsTreeRef"></el-tree>
      <span slot="footer">
        <el-button @click="setRightsDialog = false">取 消</el-button>
        <el-button type="primary" @click="allRights">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
  import { deleteRolesRights, getRightsList, allotRights } from "network/getRights";
  import { getRightsId } from "common/utls";

  export default {
    name: "RolesCard",
    props: {
      roleList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        //分配权限对话框的显示隐藏
        setRightsDialog: false,
        // 树形绑定的数据
        rightsTree: [],
        // 树形配置选项
        treeProps: {
          label: 'authName',
          children: 'children'
        },
        // 默认选中的值
        checkKeys: [],
        // 保存当前点击的权限id
        roleId: ''
      }
    },
    methods: {
      // 删除权限
      async removeTag(roles, rightsId) {
        const confirmResult = await this.$confirm('是否删除此权限?', '删除权限', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if (confirmResult !== 'confirm') return ;
         deleteRolesRights(roles.id, rightsId).then(res => {
           console.log(res);
           const data = res.data;
           if (data.meta.status !== 200) return this.$message.error(data.meta.msg);
           this.$message.success(data.meta.msg);
           roles.children = data.data;
         })
      },
      // 分配权限
       async btnSetRightsDialog(role) {
        this.roleId = role.id;
        const { data: res } = await getRightsList('tree');
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        //递归获取所有权限id
         this.checkKeys = [];
         getRightsId(role, this.checkKeys);
        this.setRightsDialog = true;
        this.rightsTree = res.data;
      },
      async allRights() {
        const idStr = [
          ...this.$refs.rightsTreeRef.getCheckedKeys(),
          ...this.$refs.rightsTreeRef.getHalfCheckedKeys(),
        ].join(',');
        const { data: res } = await allotRights(this.roleId, idStr);
        console.log(idStr);
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.$parent.getRoleList();
        this.setRightsDialog = false;
      }
    }
  }
</script>

<style scoped>
  .el-tag {
    margin: 7px;
  }
  .el-table {
    margin: 10px 0;
  }
</style>