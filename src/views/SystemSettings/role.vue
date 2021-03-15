<template>
  <div class="user">
    <!--    <el-row>-->
    <!--      <el-col :span="24">-->
    <!--        <el-breadcrumb separator="/">-->
    <!--          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>-->
    <!--          <el-breadcrumb-item>用户管理</el-breadcrumb-item>-->
    <!--          <el-breadcrumb-item>用户列表</el-breadcrumb-item>-->
    <!--        </el-breadcrumb>-->
    <!--      </el-col>-->
    <!--    </el-row>-->

    <el-row>
      <el-col :span="24" style="margin-top: 20px;">
        <!-- 给组件绑定原生事件的话，需要一个.native的修饰符 -->
        <!--        <el-input placeholder="请输入内容" class="search-input" v-model="query" @keydown.native.enter="initList"></el-input>-->
<!--        <el-input placeholder="CWID查询" class="search-input" v-model="userListData.userIdentifier"></el-input>-->
        <el-input  style="margin-left: 1%;" placeholder="角色名称查询" class="search-input" v-model="userListData.roleName"></el-input>
        <!--        <el-button type="primary" slot="append" ></el-button>-->
        <el-button style="margin-left: 1%;" type="primary" @click="ChaxunTap">查询</el-button>
        <el-button style="margin-left: 1%;" type="primary" @click="ChongzhiTap">重置</el-button>

        <!--        <el-button type="success" @click="addDialogFormVisible=true">添加用户</el-button>-->
      </el-col>
    </el-row>
    <!--    <el-table-->
    <!--      class="margin-20"-->
    <!--      v-loading="loading"-->
    <!--      :data="userList"-->
    <!--      ref="queryHeight"-->
    <!--      border-->
    <!--      :height="tableHeight"-->
    <!--      style="width: 100%">-->
    <el-table
      class="margin-20"
      v-loading="loading"
      :data="userList"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        width="100"
        label="序号"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="300"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="roleType"
        label="描述"
        width="300"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="userCount"
        label="用户数"
        align="center"
      >
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="userMobile"-->
<!--        label="手机号"-->
<!--        width="120">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="createDt"-->
<!--        label="创建时间"-->
<!--        width="160">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="regionItem"-->
<!--        label="所属大区"-->
<!--        width="120">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="regionItemArea"-->
<!--        label="所属地区"-->
<!--        width="120">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="userRole"-->
<!--        label="所属角色"-->
<!--        width="120">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="userMobile"-->
<!--        label="所属部门"-->
<!--        width="120">-->
<!--      </el-table-column>-->

<!--      <el-table-column label="用户状态">-->
<!--        <template slot-scope="scope">-->
<!--          <el-switch v-model="scope.row.isEnable" @change="changeUserState(scope.row)"></el-switch>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="操作">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button size="mini" type="primary" plain @click="showEditDialog(scope.row,1)">编辑</el-button>-->
<!--          <el-button size="mini" type="danger" plain @click="showPingDialog(scope.row)">平调</el-button>-->
<!--          <el-button size="mini" type="warning" plain @click="showEditDialog(scope.row,2)">分配角色</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>
    <!--    分页-->
    <div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userListData.currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination>
    </div>

  </div>
</template>
<script>
  import api from '../../api/deliverProxy'
  import qs from "qs";

  // import {getUserList, changeUserState, addUser, getUserById, editUser, deleteUser, getRoleList, grantUserRole} from '@/api'
  // 节流函数
  const delay = (function () {
    let timer = 0;
    return function (callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();
  export default {
    data() {
      return {
        userListData: {
          roleName: '',
          currentPage: 1,
          pageSize: 10,
        },
        loading:false,
        totalCount: 1,// 总数量,
        total: 0,
        pagesize: 10,
        pagenum: 1,
        userList:[],

      }
    },


    mounted: function () {
      // this.scrollHeight = window.innerHeight * 0.7 + 'px';
      // const that = this
      // window.onresize = () => {
      //   return (() => {
      //     window.tableHeight = window.innerHeight - 300 || document.documentElement.clientHeight- 300 || document.body.clientHeight- 300
      //     that.tableHeight = window.tableHeight - that.$refs.queryHeight.offsetHeight - 300
      //   })()
      // }
    },

    watch: {
      "userListData.roleName"() {
        delay(() => {
          this.initList();
        }, 500);
      },
    },
    created() {
      this.initList()
    },
    methods: {
      // 重置
      ChongzhiTap(){
        this.userListData.roleName = ''
        this.userListData.currentPage = 1
        this.initList();
      },
      // 模糊查询
      ChaxunTap() {
        this.initList()
      },
      // 设置每页条数
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.userListData.pageSize = val
        this.initList()
      },
      // 设置当前页
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        this.userListData.currentPage = val
        this.initList()
      },
      // 初始化表格数据
      initList() {
        this.loading = true
        this.paginaSel = 0
        let userListData = this.userListData
        console.log('userListData=', userListData)
        let url = '/web/v1.0/system/role/role-page'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          // if(response.code){
          //   this.$store.dispatch('user/resetToken')
          //   this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          // }
          if (response.code == '200') {
            if (response.status == 'success') {
              let list = response.data.roleList.items
              this.totalCount = response.data.roleList.totalCount
              console.log('返回值!list=', list)
              this.total = response.data.roleList.totalCount
              this.userList = list
              // location.reload()
            } else {
              this.$message({
                message: response.message,
                type: 'error'
              })
            }
          } else {
            this.$message({
              message: response.message,
              type: 'error'
            })
          }


        }).catch(error => {

        })

      },
      grantDialogFormVisibleTap() {
        console.log('111')
        this.grantDialogFormVisible = false
        this.addForm.CWID = '',
          this.addForm.userName = '',
          this.addForm.userMobile = '',
          this.addForm.userEmail = '',
          this.addForm.userRegionItem = '',
          this.addForm.userRegionItemArea = '',
          this.addForm.roleId = '',
          this.addForm.regionItemName = '',
          this.addForm.regionItemAreaName = '',
          this.addForm.userDepartment = '',
          this.regionName = "";
        this.regionItemList = [];
        this.regionItemAreaList = [];
        this.regionItemName = "";
        this.regionItemAreaName = "";
        this.roleName = "";
        this.userId = "";

      },

    }
  }
</script>
<style lang="scss" scoped>
  .happy-scroll{
    height: 350px!important;
  }
  .happy-scroll-container .happy-scroll-content {
    width: 100% !important;
  }

  /*.happy-scroll{*/
  /*  width: 10%;*/
  /*  height: 50%;*/
  /*}*/

  .det-taq-fir-e-img {
    width: 14px;
    height: 14px;
  }

  .el-dialog-taq-fir {
    width: 100%;
    text-align: center;
    font-size: 12px;
    margin: 0 auto;
  }

  .el-dialog-taq {
    /*position: relative;*/
  }

  .el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    /*margin: 0 !important;*/
    transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
    display: flex;
    flex-direction: column;
  }

  .el-dialog__body {
    overflow: auto;
  }

  .el-scrollbar__wrap {
    overflow-y: hidden !important;
  }

  .dialog-taq {
    /*height: 80%;*/
    max-height: 80%;
    overflow-y: auto;
  }

  .kehu-taq {
    width: 50%;
    padding-top: 10px;
    text-align: center;
    border-right: 1px solid #f5f4f3;
  }

  .none {
    border-right: 1px solid #fff;
  }

  .kehu-taq-fir {
    margin-bottom: 20px;
  }

  .det-taq-fir-d {
    width: 80%;
    margin: 0 auto;
    font-size: 12px;
    display: flex;
    align-items: center;
    /*margin-left: 10%;*/
    /*margin-bottom: 15px;*/
    /*-webkit-transform: scals(0.83)*/
  }

  .disf {
    margin-left: 21% !important;
    margin-bottom: 15px;

  }

  .let {
    margin-left: 7%;
  }

  .det-taq-fir-c {
    /*width: 80%;*/
    margin: 0 auto;
    margin-left: -20%;
    font-size: 12px;
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    /*-webkit-transform: scals(0.83)*/
  }
  .letui{
    margin-left: -50%;

  }

  .det-taq-fir-d {
    /*width: 80%;*/
    margin-left: 10%;
    font-size: 12px;
    /*-webkit-transform: scals(0.83)*/
  }

  .det-taq-fir-e {
    width: 14px;
    height: 14px;
    border-radius: 3px;
    border: 1px solid #9A9A9A;
  }

  .det-taq-fir-e-bg {
    background: #E75A3E;
    border: 1px solid #E75A3E;

  }

  .search-taq {
    width: 50% !important;
    /*padding: 10px 0;*/
    margin-right: 5%;


  }

  el-table--mini th, .el-table--mini td {
    padding: 10px 0 !important;
  }

  el-table-column {
    height: 50px !important;
  }

  .user {
    .margin-20 {
      margin: 20px 0;
    }

    .search-input {
      width: 300px;
    }

    .page {
      padding: 5px 0;
      background-color: #D3DCE6;
    }
  }
</style>
<style>
  .el-button--primary{
    color: #fff;
    background-color: #26C0E4!important;
    border-color: #fff!important;
  }
  .el-button--primary:hover{
    background-color: #20b6f9!important;
    border-color: #20b6f9!important;
  }
  .el-button--primary.is-plain {
    color: #1890ff!important;
    background: #e8f4ff!important;
    border-color: #a3d3ff!important;
  }
  .el-button--primary.is-plain:hover{
    color: #fff!important;
    background: #20b6f9!important;
    border-color: #20b6f9!important;
  }

</style>
