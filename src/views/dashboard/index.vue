<template>
  <div class="user">
    <div class="home">
      <img src="../../assets/images/home-00.png" width="99%" height="" alt="" />
      <div class="home-taq">管理员：{{username}}</div>

    </div>

<!--    <el-row>-->
<!--      <el-col :span="24" style="margin-top: 20px;">-->
<!--        <el-input style="margin-left: 1%;" placeholder="姓名查询" class="search-input" v-model="userListData.visitorName"></el-input>-->
<!--        <el-input style="margin-left: 1%;" placeholder="手机号查询" class="search-input" v-model="userListData.visitorMobile"></el-input>-->

<!--        <el-date-picker-->
<!--          v-model="conferenceDateBegin"-->
<!--          type="date"-->
<!--          :editable=false-->
<!--          value-format="yyyy-MM-dd"-->
<!--          :picker-options="pickerOptionscreate"-->
<!--          placeholder="开始时间" @change="change1"-->
<!--          style="margin-left: 1%;"-->
<!--        >-->
<!--        </el-date-picker>-->
<!--        <span> - </span>-->
<!--        <el-date-picker-->
<!--          v-model="conferenceDateEnd"-->
<!--          type="date"-->
<!--          :editable=false-->
<!--          value-format="yyyy-MM-dd"-->
<!--          :picker-options="pickerOptionsend"-->
<!--          placeholder="结束时间" @change="change2"-->

<!--        >-->
<!--        </el-date-picker>-->

<!--        <el-button style="margin-left: 1%;" type="primary" @click="ChaxunTap">查询</el-button>-->
<!--        <el-button style="margin-left: 1%;" type="primary" @click="ExportListTap">导出</el-button>-->
<!--      </el-col>-->
<!--    </el-row>-->

<!--    <el-table-->
<!--      class="margin-20"-->
<!--      v-loading="loading"-->
<!--      :data="userList"-->
<!--      border-->
<!--      style="width: 100%">-->
<!--      <el-table-column-->
<!--        type="index"-->
<!--        width="200"-->
<!--        label="序号"-->
<!--        align="center"-->
<!--      >-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="visitorName"-->
<!--        label="姓名"-->
<!--        align="center"-->
<!--        width="200">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="hospital"-->
<!--        label="医院"-->
<!--        align="center"-->
<!--        width="200">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="department"-->
<!--        label="科室"-->
<!--        align="center"-->
<!--        width="200">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="titleName"-->
<!--        label="职称"-->
<!--        align="center"-->
<!--        width="200">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="visitorMobile"-->
<!--        label="手机号"-->
<!--        align="center"-->
<!--        width="200">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="createDt"-->
<!--        label="注册时间"-->
<!--        align="center"-->
<!--        >-->
<!--      </el-table-column>-->

<!--    </el-table>-->
<!--    &lt;!&ndash;    分页&ndash;&gt;-->
<!--    <div>-->
<!--      <el-pagination-->
<!--        @size-change="handleSizeChange"-->
<!--        @current-change="handleCurrentChange"-->
<!--        :current-page="userListData.currentPage"-->
<!--        :page-sizes="[10, 20, 30, 40]"-->
<!--        :page-size="10"-->
<!--        layout="total, sizes, prev, pager, next, jumper"-->
<!--        :total="totalCount"-->
<!--      >-->
<!--      </el-pagination>-->
<!--    </div>-->


  </div>
</template>
<script>
  import api from '../../api/deliverProxy'
  import qs from "qs";
  import {parseTime} from "@/utils";
  import store from "@/store";
  // import {setToken} from "/src/utils/auth";
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
        pickerOptionscreate: {
          disabledDate(time) { //开始时间的禁用
            if(that.conferenceDateEnd != null){
              return time.getTime() > new Date(that.conferenceDateEnd).getTime();

            }
          }
        },
        //结束时间
        pickerOptionsend: {
          disabledDate(time) { //结束时间的禁用
            return time.getTime() <new Date(that.conferenceDateBegin).getTime()-8.64e7;
          }
        },
        conferenceDateBegin: '', //起始时间
        conferenceDateEnd: '', //结束时间
        ExportList:[],//导出列表
        userListData: {
          visitorName: '',
          visitorMobile: '',
          createDtBegin: '',
          createDtEnd: '',
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
        name:''
      }
    },


    mounted: function () {

    },
    watch: {
      "userListData.visitorName"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },
      "userListData.visitorMobile"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },
      "userListData.createDtBegin"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },
      "userListData.createDtEnd"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },

    },
    created() {
      this.handUserName()
    },
    methods: {
      // 获取姓名
      handUserName() {
        // this.name = store.getters.name
        this.username=sessionStorage.getItem('username');

        console.log('name=', this.username)
      },
      // 开始时间
      change1: function() {
        console.log('this.conferenceDateBegin=', this.conferenceDateBegin)
        this.userListData.createDtBegin = this.conferenceDateBegin;
      },
      // 结束时间
      change2: function() {
        console.log('conferenceDateEnd=', this.conferenceDateEnd)
        this.userListData.createDtEnd = this.conferenceDateEnd;
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
        if(this.userListData.createDtBegin == null){

          this.userListData.createDtBegin = ''
        }
        if(this.userListData.createDtEnd == null){
          this.userListData.createDtEnd = ''
        }
        let userListData = this.userListData
        console.log('userListData=', userListData)
        let url = '/web/v1.0/base/visitor/visitor-page'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          // if(response.code){
          //   this.$store.dispatch('user/resetToken')
          //   this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          // }
          if (response.code == '200') {
            if (response.status == 'success') {
              let list = response.data.visitorList.items
              this.totalCount = response.data.visitorList.totalCount
              console.log('返回值!list=', list)
              this.total = response.data.visitorList.totalCount
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

      // 初始化表格数据
      ExportListTap() {
        this.loading = true
        this.paginaSel = 0
        let userListData = {
          visitorName:this.userListData.visitorName,
          visitorMobile:this.userListData.visitorMobile,
          createDtBegin:this.userListData.createDtBegin,
          createDtEnd:this.userListData.createDtEnd
        }

        console.log('userListData=', userListData)
        let url = '/web/v1.0/base/visitor/visitor-export'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          // if(response.code){
          //   this.$store.dispatch('user/resetToken')
          //   this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          // }
          if (response.code == '200') {
            if (response.status == 'success') {
              let list = response.data.visitorList
              this.ExportList = list
              this.handleDownload(this.ExportList);
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
      // 导出
      handleDownload(ExportList) {
        this.downloadLoading = true






        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['姓名', '医院', '科室', '职称', '手机号', '注册时间',]
          const filterVal = ['visitorName', 'hospital', 'department', 'titleName', 'visitorMobile', 'createDt']
          const list = ExportList
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '导出注册用户列表',
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
      }
    }
  }
</script>
<style lang="scss" scoped>
  .home{
    width: 100%;
    text-align: center;
    position: relative;
  }
  .home-taq{
    position: absolute;
    top: 52%;
    left: 44%;
    z-index: 100000;
    /*font-size: 30px!important;*/
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
