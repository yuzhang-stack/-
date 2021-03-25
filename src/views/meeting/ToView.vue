<template>
  <div class="user">
    <!--    <div style="padding: 20px">正在研发...</div>-->

    <el-row>
      <el-col :span="24" style="margin-top: 20px;">
        <el-input style="margin-left: 1%;width: 8%" placeholder="姓名查询" class="search-input"
                  v-model="userListData.userName"></el-input>
        <el-input style="margin-left: 1%;width: 8%" placeholder="手机号查询" class="search-input"
                  v-model="userListData.mobile"></el-input>
        <el-select style="margin-left: 1%;width: 8%" v-model="indicationName" filterable @clear="indicatNull" clearable
                   placeholder="观众类型查询" @change="">

          <el-option
            v-for="(item,index) in indicationList"
            :key="item.dictCode"
            :label="item.dictName"
            :value="item.dictCode"
            :style="'width:100%;'"
            @click.native="indicatTap(index)"></el-option>
        </el-select>

        <el-button style="margin-left: 1%;" type="primary" @click="ChongzhiTap">重置</el-button>
        <el-button v-if="userList.length != 0" type="primary" @click="ExportListTap">导出观看列表</el-button>
      </el-col>
    </el-row>
    <!--    表格-->
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
        prop="liveName"
        label="会议名称"
        align="center"
        width="150">
      </el-table-column>
      <el-table-column
        prop="userType"
        label="用户角色"
        align="center"
        width="150">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="用户姓名"
        align="center"
        width="150">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机号"
        align="center"
        width="150">
      </el-table-column>

      <el-table-column
        prop="hospital"
        label="医院"
        align="center"
        width="150">
      </el-table-column>
      <el-table-column
        prop="department"
        label="科室"
        align="center"
        width="150">
      </el-table-column>
      <el-table-column
        prop="inviterName"
        label="邀请人"
        align="center"
        width="150">
      </el-table-column>
      <el-table-column
        prop="duration"
        label="观看时长(单位:秒）"
        align="center"
        >
      </el-table-column>





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
  import {parseTime} from "@/utils";
  import {getToken} from "@/utils/auth";
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
      let that = this;
      return {
        liveViewList:[],//直播观看人数列表
        indicationList:[],
        liveVIewExportList:[],
        indicationName:'',
        userListData: {
          liveId: '',//直播ID
          userType: '',//观众类型
          userName: '',//姓名
          mobile: '',
          currentPage: 1,
          pageSize: 10,
        },
        totalCount: 1,// 总数量
        loading: true,
        userList: [],
        query: '',
        total: 0,
        pagesize: 10,
        pagenum: 1,
      }
    },


    mounted: function () {

    },
    watch: {
      "userListData.userName"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },
      "userListData.mobile"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },
      "userListData.userType"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },


    },
    created() {
      this.indicationTap()//观众类型字典项
      // this.departmentTap()//科室字典项
      // this.thirdTap()//演讲人

      if (this.$route.query) {
        console.log('this.$route.query.id=',this.$route.query.id);
        this.userListData.liveId = this.$route.query.id
        this.initList()
      }

    },
    methods: {
      // 导出
      ExportListTap() {
        this.handleDownload(this.liveVIewExportList);
      },
      handleDownload(ExportList) {
        this.downloadLoading = true

        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['会议名称', '用户角色', '用户姓名', '手机号', '医院', '科室', '邀请人', '观看时长(单位:秒）',]
          const filterVal = ['liveName', 'userType', 'userName', 'mobile', 'hospital', 'department', 'inviterName', 'duration',]
          const list = ExportList
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '导出观看人列表',
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },



      // 打印
      clickBtn: function () {
      },
      // 重置
      ChongzhiTap() {
        this.userListData.userName = ''
        this.userListData.mobile = ''
        this.userListData.userType = ''
        this.userListData.currentPage = 1
        this.initList();
      },

      // 适应症字典项
      indicationTap() {
        this.loading = true
        let headers = {
          'token': getToken(),
        }
        this.headers = headers
        console.log('headers=', headers)

        let userListData = {};
        console.log('userListData=', userListData)
        let url = '/web/v1.0/common/user-type-select'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let indicationList = response.data.userTypeList
              this.indicationList = indicationList
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
      // 清空观众类型
      indicatNull(val) {
        this.indicationName = '';
        this.userListData.userType = '';
      },
      // 选择观众类型
      indicatTap(index) {
        console.log('区域下标=', index)
        this.userListData.userType = this.indicationList[index].dictCode
        this.indicationName = this.indicationList[index].dictName

      },


      // 设置每页条数
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.userListData.pageSize = val
        this.initList()
      },
      // 模糊查询
      ChaxunTap() {
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
        let url = '/web/v1.0/conference/live/live-view-page'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let list = [];
              if(response.data.liveViewList.items != null){
                list = response.data.liveViewList.items
              }
              this.liveVIewExportList = response.data.liveVIewExportList
              this.totalCount = response.data.liveViewList.totalCount
              this.total = response.data.liveViewList.totalCount
              this.userList = list
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

    }
  }
</script>
<style lang="scss" scoped>

  .el-dialog {
    top: 35% !important;
  }
  .happy-scroll {
    height: 350px !important;
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

  .letui {
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
  /*// 上传图片框样式*/
  .avatar{
    width: 80px;
    height: 80px;
  }
  .lin{
    line-height: 80px;
    color: #26C0E4;
  }
  .el-upload--picture-card i{
    line-height: 80px!important;
    margin-bottom: 20px!important;
    padding-bottom: 50px!important;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 80px!important;
    height: 80px!important;
  }
  .el-upload--picture-card {
    width: 80px!important;
    height: 80px!important;
  }
  .el-button--primary {
    color: #fff;
    background-color: #26C0E4 !important;
    border-color: #fff !important;
  }

  .el-button--primary:hover {
    background-color: #20b6f9 !important;
    border-color: #20b6f9 !important;
  }

  .el-button--primary.is-plain {
    color: #1890ff !important;
    background: #e8f4ff !important;
    border-color: #a3d3ff !important;
  }

  .el-button--primary.is-plain:hover {
    color: #fff !important;
    background: #20b6f9 !important;
    border-color: #20b6f9 !important;
  }

</style>
