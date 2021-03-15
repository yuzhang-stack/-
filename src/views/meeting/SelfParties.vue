<template>
  <div class="user">
    <!--    <div style="padding: 20px">正在研发...</div>-->

    <el-row>
      <el-col :span="24" style="margin-top: 20px;">
        <el-input style="margin-left: 1%;" placeholder="会议名称查询" class="search-input"
                  v-model="userListData.conferenceName"></el-input>
        <el-select style="margin-left: 1%;" v-model="userListData.saler" filterable @clear="indicatNull" clearable
                   placeholder="销售查询" @change="">

          <el-option
            v-for="(item,index) in newUserList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
            :style="'width:100%;'"
            @click.native="indicatTap(index)"></el-option>
        </el-select>

        <el-select style="margin-left: 1%;" v-model="conferenceTypeName" filterable @clear="conferTypeNull" clearable
                   placeholder="会议类型查询" @change="">

          <el-option
            v-for="(item,index) in conferenceTypeList"
            :key="item.dictCode"
            :label="item.dictName"
            :value="item.dictCode"
            :style="'width:100%;'"
            @click.native="conferenceTap(index)"></el-option>
        </el-select>


        <el-date-picker
          v-model="conferenceDateBegin"
          type="date"
          :editable=false
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptionscreate"
          placeholder="开始时间" @change="change1"
          style="margin-left: 1%;"
        >
        </el-date-picker>
        <span> - </span>
        <el-date-picker
          v-model="conferenceDateEnd"
          type="date"
          :editable=false
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptionsend"
          placeholder="结束时间" @change="change2"

        >
        </el-date-picker>


        <!--        <el-button type="primary" slot="append" ></el-button>-->
        <el-button type="primary" style="margin-left: 1%;" @click="ChaxunTap">查询</el-button>
        <!--        <el-button type="primary" @click="ExportListTap">导出</el-button>-->
        <el-button type="primary" @click="addDialogFormVisible=true">创建会议</el-button>
        <el-button style="margin-left: 1%;" type="primary" @click="ChongzhiTap">重置</el-button>
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
        prop="conferenceName"
        label="会议名称"
        align="center"
        width="150">
      </el-table-column>
      <el-table-column
        prop="saler"
        label="所属销售"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        prop="conferenceType"
        label="会议类型"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        prop="conferencePlace"
        label="会议地点"
        align="center"
        width="150">
      </el-table-column>
      <el-table-column
        prop="conferenceDateBegin"
        label="会议开始时间"
        align="center"
        width="190">
      </el-table-column>
      <el-table-column
        prop="conferenceDateEnd"
        label="会议结束时间"
        align="center"
        width="200">
      </el-table-column>
      <el-table-column
        prop="conferenceChairman"
        label="参会主席"
        align="center"
        width="150">
      </el-table-column>
      <el-table-column
        prop="conferenceLecturer"
        label="参会讲师"
        align="center"
        width="150">
      </el-table-column>
      <el-table-column
        prop="createDt"
        label="录入时间"
        align="center"
        width="190">
      </el-table-column>
      <el-table-column
        prop="conferenceStatus"
        label="状态"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        prop="isSummary"
        label="总结"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain @click="showEditDialog(scope.row,1)">编辑</el-button>
          <!--          <el-button size="mini" type="primary" plain @click="showEditDialog(scope.row,1)">编辑</el-button>-->
        </template>
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
    <!--添加用户对话框:-->

    <el-dialog title="创建会议" :visible.sync="addDialogFormVisible" @close="addDialogFormVisibleTap">
      <el-form :model="addForm" label-width="80px" ref="addUserForm">
        <el-form-item label="会议名称" prop="conferenceName">
          <el-input v-model="addForm.conferenceName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="会议类型">
          <el-select v-model="addForm.addconferenceTypeName" filterable placeholder="请选择会议类型" @change="">
            <el-option
              v-for="(item,index) in conferenceTypeList"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode"
              @click.native="addconferenceTypeTap(index)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会议地点" prop="conferencePlace">
          <el-input v-model="addForm.conferencePlace" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="会议时间">
          <el-date-picker
            v-model="conferenceDateList"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预计人数" prop="estimateNumber">
          <el-input v-model="addForm.estimateNumber" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属销售">
          <el-select v-model="addForm.saler" filterable placeholder="请选择所属销售" @change="">
            <el-option
              v-for="(item,index) in newUserList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
              @click.native="addindicationListTap(index)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参会主席">
          <el-select v-model="addForm.chairmanList" multiple filterable style="width: 100%" placeholder="请选择">
            <el-option
              v-for="item in doctorListVal"
              :key="item.doctorId"
              :label="item.doctorName"
              :value="item.doctorId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参会讲师">
          <el-select v-model="addForm.lecturerList" multiple filterable style="width: 100%" placeholder="请选择">
            <el-option
              v-for="item in doctorListVal"
              :key="item.doctorId"
              :label="item.doctorName"
              :value="item.doctorId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会议日程">
          <div style="display: flex;margin-bottom: 5px;" v-for="(item,index) in details">
            <el-date-picker
              v-model="item.scheduleDateList"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00']">
            </el-date-picker>
            <el-input
              style="width: 20%!important;margin-left: 20px"
              placeholder="讲题"
              v-model="item.scheduleType"
              maxlength="18"
              auto-complete="off"
              show-word-limit
            >
            </el-input>
            <span> - </span>
            <el-input style="width: 20%!important;margin-right: 20px"
                      v-model="item.schedulePerson" auto-complete="off" placeholder="讲者">index
            </el-input>
            <el-button v-if="index != details.length - 1" style="background: #e95a3c!important;" type="primary" @click="removeItem(index)">
              取消 </el-button>
            <el-button v-if="index == details.length - 1" style="background: #E6A23C!important;" type="primary" @click="addItem"> 添加 </el-button>
          </div>
          <div style="font-size: 12px;margin-top: 20px">注：为不影响邀请函展示效果，会议日程控制在十条以内。</div>

        </el-form-item>
      </el-form>
      <div style="margin: 0 auto!important;text-align: center" class="dialog-footer">
        <el-button @click="addDialogFormVisibleTap">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit()">保存</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑会议" :visible.sync="editDialogFormVisible" @close='editDialogFormVisibleTap'>
      <el-form :model="addForm" label-width="80px" ref="addUserForm">
        <el-form-item label="会议名称" prop="conferenceName">
          <el-input v-model="addForm.conferenceName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="会议类型">
          <el-select v-model="addForm.conferenceType" filterable placeholder="请选择会议类型" @change="">
            <el-option
              v-for="(item,index) in conferenceTypeList"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode"
              @click.native="addconferenceTypeTap(index)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会议地点" prop="conferencePlace">
          <el-input v-model="addForm.conferencePlace" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="会议时间">
          <el-date-picker
            v-model="conferenceDateList"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预计人数" prop="estimateNumber">
          <el-input v-model="addForm.estimateNumber" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属销售">
          <el-select v-model="addForm.saler" filterable placeholder="请选择所属销售" @change="">
            <el-option
              v-for="(item,index) in newUserList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
              @click.native="addindicationListTap(index)"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="参会主席">
          <el-select v-model="addForm.chairmanList" multiple filterable style="width: 100%" placeholder="请选择">
            <el-option
              v-for="item in doctorListVal"
              :key="item.doctorId"
              :label="item.doctorName"
              :value="item.doctorId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参会讲师">
          <el-select v-model="addForm.lecturerList" multiple filterable style="width: 100%" placeholder="请选择">
            <el-option
              v-for="item in doctorListVal"
              :key="item.doctorId"
              :label="item.doctorName"
              :value="item.doctorId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会议日程">
          <div style="display: flex;margin-bottom: 5px;" v-for="(item,index) in details">
            <el-date-picker
              v-model="item.scheduleDateList"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00']">
            </el-date-picker>
            <el-input
              style="width: 20%!important;margin-left: 20px"
              placeholder="讲题"
              v-model="item.scheduleType"
              maxlength="18"
              auto-complete="off"
              show-word-limit
            >
            </el-input>
            <span> - </span>
            <el-input style="width: 20%!important;margin-right: 20px"
                      v-model="item.schedulePerson" auto-complete="off" placeholder="讲者">index
            </el-input>
            <el-button v-if="index != details.length - 1" style="background: #e95a3c!important;" type="primary" @click="removeItem(index)">
              取消 </el-button>
            <el-button v-if="index == details.length - 1" style="background: #E6A23C!important;" type="primary" @click="addItem"> 添加 </el-button>
          </div>
          <div style="font-size: 12px;margin-top: 20px">注：为不影响邀请函展示效果，会议日程控制在十条以内。</div>

        </el-form-item>
      </el-form>
      <div style="margin: 0 auto!important;text-align: center" class="dialog-footer">
        <el-button @click="editDialogFormVisibleTap">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit()">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import api from '../../api/deliverProxy'
  import qs from "qs";
  import {parseTime} from "@/utils";
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
        // 会议日程
        details : [
          {
            scheduleId: null,
            scheduleDateList:[],//开始结束
            scheduleType: null,
            schedulePerson: null
          }
        ],
        doctorListVal: [],//参会主席列表
        conferenceDateList:[],//会议时间
        value1: [],
        pickerOptionscreate: {
          disabledDate(time) { //开始时间的禁用
            if (that.conferenceDateEnd != null) {
              return time.getTime() > new Date(that.conferenceDateEnd).getTime();

            }
          }
        },
        //结束时间
        pickerOptionsend: {
          disabledDate(time) { //结束时间的禁用
            return time.getTime() < new Date(that.conferenceDateBegin).getTime() - 8.64e7;
          }
        },

        newUserList: '', //销售列表
        conferenceDateBegin: '', //起始时间
        conferenceDateEnd: '', //结束时间
        indicationList: [],//适应症
        indicationName: '',//适应症名称
        conferenceTypeList: [],//三方会类型
        conferenceTypeName: '',//三方会名称


        userListData: {
          conferenceName: '',
          conferenceDateBegin: '',
          conferenceDateEnd: '',
          conferenceType: '',
          saler: '',
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
        addDialogFormVisible: false,
        addForm: {
          conferenceId: null,//会议id
          conferenceName: '',//会议名称
          conferenceType: '',//会议类型（字典项）
          addconferenceTypeName: '',//会议类型（名称）
          conferencePlace: '',//会议地点
          conferenceDateBegin: '',//开始时间
          conferenceDateEnd: '',//结束时间
          estimateNumber: '',//预计人数
          saler: '',//适应症(三方会特有)(字典)
          chairmanList: [],//参会主席id lis
          lecturerList: '',//参会讲师id list
          scheduleList: '',//日程list
        },
        editDialogFormVisible: false,
        grantDialogFormVisible: false,


      }
    },


    mounted: function () {

    },
    watch: {
      "userListData.conferenceName"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },
      "userListData.conferenceDateEnd"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },
      "userListData.conferenceDateBegin"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },
      "userListData.saler"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },
      "userListData.conferenceType"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },
    },
    created() {
      this.initList()
      this.thirdTap()//三方会类型字典项
      // this.indicationTap()//三方会类型字典项
      this.SanfangTypeTap()//三方会类型字典项
      this.marketListTap()//三方会类型字典项
    },
    methods: {
      // 销售列表
      marketListTap() {
        this.loading = true
        let userListData = {
          userName: '',
        };
        console.log('userListData=', userListData)
        let url = '/web/v1.0/system/user/user-select'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let newUserList = response.data.userList

              for (let i = 0; i < newUserList.length; i++) {
                newUserList[i].isChecked = false
                if(i == newUserList.length - 1){
                  this.newUserList = newUserList

                  // console.log('1=', )
                  console.log('length=', newUserList.length)

                }
              }

              this.pingDialogFormVisible = true
              console.log('返回值!newUserList=', newUserList)
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
      // 添加会议日程
      addItem: function () {
        if (this.details.length > 9){
          this.$message({
            message: '会议日程已超出条目',
            type: 'error'
          })
          return
        }
        let  detailsNew =
          {
            scheduleId: null,
            scheduleDateList:[],//开始结束
            scheduleType: null,
            schedulePerson: null
          }

        this.details.push(detailsNew);
        console.log(this.details);

      },
      // 取消会议日程
      removeItem: function (index) {
        this.details.splice(index, 1);
        console.log(this.details);
      },
      // 多选主席
      changeSelect(val) {
        if (val.length === this.options.length) {
          this.checked = true
        } else {
          this.checked = false
        }
      },
      // 打印
      clickBtn: function () {
        console.log(this.addForm.conferenceDateBegin);
        console.log(this.addForm.conferenceDateEnd);
        console.log(this.value1);
      },
      // 重置
      ChongzhiTap() {
        this.userListData.conferenceName = ''
        this.userListData.conferenceDateEnd = ''
        this.conferenceDateEnd = ''
        this.userListData.conferenceDateBegin = ''
        this.conferenceDateBegin = ''
        this.userListData.indication = ''
        this.indicationName = ''
        this.userListData.conferenceType = ''
        this.conferenceTypeName = ''
        this.userListData.saler = ''
        this.userListData.currentPage = 1
        this.initList();
      },
      // 开始时间
      change1: function () {
        console.log('this.conferenceDateBegin=', this.conferenceDateBegin)
        this.userListData.conferenceDateBegin = this.conferenceDateBegin;
      },
      // 结束时间
      change2: function () {
        console.log('conferenceDateEnd=', this.conferenceDateEnd)
        this.userListData.conferenceDateEnd = this.conferenceDateEnd;
      },
      // 三方会主席字典项
      thirdTap() {
        this.loading = true
        let userListData = {};
        console.log('userListData=', userListData)
        let url = '/web/v1.0/conference/conference/third-doctor-select'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let doctorListVal = response.data.doctorList
              this.doctorListVal = doctorListVal
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
      // 适应症字典项
      indicationTap() {
        this.loading = true
        let userListData = {};
        console.log('userListData=', userListData)
        let url = '/web/v1.0/conference/conference/indication-select'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let indicationList = response.data.indicationList
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
      // 清空适应症
      indicatNull(val) {
        this.indicationName = '';
        this.userListData.indication = '';
      },
      // 选择适应症
      indicatTap(index) {
        console.log('区域下标=', index)
        this.userListData.indication = this.indicationList[index].dictCode
        this.indicationName = this.indicationList[index].dictName

      },
      // 三方会类型字典项
      SanfangTypeTap() {
        this.loading = true
        let userListData = {};
        console.log('userListData=', userListData)
        let url = '/web/v1.0/conference/conference/self-conference-type-select'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let conferenceTypeList = response.data.conferenceTypeList
              this.conferenceTypeList = conferenceTypeList
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
      // 清空三方会类型
      conferTypeNull(val) {
        this.conferenceTypeName = '';
        this.userListData.conferenceType = '';
      },
      // 三方会类型查询
      conferenceTap(index) {
        console.log('区域下标=', index)
        this.userListData.conferenceType = this.conferenceTypeList[index].dictCode
        this.conferenceTypeName = this.conferenceTypeList[index].dictName
      },

      // 适应症类型添加
      addindicationListTap(index) {
        this.addForm.indication = this.indicationList[index].dictCode
        this.addForm.indicationName = this.indicationList[index].dictName

        console.log('适应症类型 =', this.addForm.indication)
        console.log('适应症类型名称 =', this.addForm.indicationName)

      },
      // 三方会类型添加
      addconferenceTypeTap(index) {
        this.addForm.conferenceType = this.conferenceTypeList[index].dictCode
        this.addForm.addconferenceTypeName = this.conferenceTypeList[index].dictName

        console.log('添加选择类型 =', this.addForm.conferenceType)
        console.log('添加选择类型名称 =', this.addForm.addconferenceTypeName)

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
        let userListData = {}
        if (this.userListData.conferenceDateBegin == null) {

          this.userListData.conferenceDateBegin = ''
        }
        if (this.userListData.conferenceDateEnd == null) {
          this.userListData.conferenceDateEnd = ''
        }
        userListData = this.userListData

        console.log('userListData=', userListData)
        let url = '/web/v1.0/conference/conference/self-conference-page'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let list = response.data.conferenceList.items
              this.totalCount = response.data.conferenceList.totalCount
              console.log('返回值!list=', list)
              this.total = response.data.conferenceList.totalCount
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
      // 添加用户
      addUserSubmit() {
        this.paginaSel = 0
        // return
        console.log('this.addForm=', this.addForm)

        if (!this.addForm.conferenceName) {
          this.$message('请填写会议名称');
          return
        }
        if (!this.addForm.conferenceType) {
          this.$message('请填写会议类型');
          return false
        }
        if (!this.addForm.conferencePlace) {
          this.$message('请填写会议地点');
          return
        }
        if (this.conferenceDateList.length == 0) {
          this.$message('请选择会议时间');
          return
        }
        if (!this.addForm.estimateNumber) {
          this.$message('请填写预计人数');
          return
        }
        if (!this.addForm.saler) {
          this.$message('请选择所属销售');
          return
        }
        if (this.addForm.chairmanList.length == 0) {
          this.$message('请选择参会主席');
          return
        }
        if (this.addForm.lecturerList.length == 0) {
          this.$message('请选择参会讲师');
          return
        }
        console.log('this.details=', this.details)
        for (let i = 0; i < this.details.length; i++) {
         if(this.details[i].scheduleDateList[0] == null || this.details[i].scheduleDateList[0] == ''){
           this.$message('请选择日程时间');
           return
         }
        }
        this.loading = true
        let userListData = {};
        userListData = {
          conferenceId:this.addForm.conferenceId,
          conferenceName: this.addForm.conferenceName,
          conferenceType: this.addForm.conferenceType,
          conferencePlace: this.addForm.conferencePlace,
          conferenceDateList: this.conferenceDateList,
          estimateNumber: this.addForm.estimateNumber,
          saler: this.addForm.saler,
          sysHospDept: this.addForm.sysHospDept,
          chairmanList: this.addForm.chairmanList,
          lecturerList: this.addForm.lecturerList,
          scheduleList: this.details,
        };

        console.log('userListData=', userListData)
        let url = '/web/v1.0/conference/conference/conference-save'
        api.postn(url, {}, userListData).then(response => {
          console.log('response=', response)
          this.loading = false

          if (response.code == '200') {
            if (response.status == 'success') {
              this.addDialogFormVisible = false;
              this.editDialogFormVisible = false;

              this.initList();
              this.addForm.conferenceName = ''
              this.addForm.conferenceType = ''
              this.addForm.conferencePlace = ''
              this.conferenceDateList = []
              this.addForm.estimateNumber = ''
              this.addForm.saler = ''
              this.addForm.sysHospDept = ''
              this.addForm.chairmanList = ''
              this.addForm.lecturerList = ''
              this.addForm.addconferenceTypeName = ''
              this.details = [{
                scheduleId: null,
                scheduleDateList:[],//开始结束
                scheduleType: null,
                schedulePerson: null
              }]
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
      // 取消添加
      addDialogFormVisibleTap() {
        console.log('111')

        this.addDialogFormVisible = false
        this.addForm.conferenceName = ''
        this.addForm.conferenceType = ''
        this.addForm.conferencePlace = ''
        this.conferenceDateList = []
        this.addForm.estimateNumber = ''
        this.addForm.saler = ''
        this.addForm.sysHospDept = ''
        this.addForm.chairmanList = ''
        this.addForm.lecturerList = ''
        this.addForm.addconferenceTypeName = ''
        this.details = [{
          scheduleId: null,
          scheduleDateList:[],//开始结束
          scheduleType: null,
          schedulePerson: null
        }]

      },
      // 取消编辑弹窗
      editDialogFormVisibleTap() {
        console.log('111')
        this.editDialogFormVisible = false
        this.addForm.conferenceName = ''
        this.addForm.conferenceType = ''
        this.addForm.conferencePlace = ''
        this.conferenceDateList = []
        this.addForm.estimateNumber = ''
        this.addForm.saler = ''
        this.addForm.sysHospDept = ''
        this.addForm.chairmanList = ''
        this.addForm.lecturerList = ''
        this.addForm.addconferenceTypeName = ''
        this.addForm.conferenceId = null
        this.details = [{
          scheduleId: null,
          scheduleDateList:[],//开始结束
          scheduleType: null,
          schedulePerson: null
        }]

      },

      // 显示编辑用户对话框
      showEditDialog(row, type) {
        console.log(row)
        this.editDialogFormVisible = true
        this.loading = true
        let userListData = {
          conferenceId: row.conferenceId
        }
        let url = '/web/v1.0/conference/conference/conference-info'
        api.get(url, userListData).then(response => {
          console.log('信息!', response)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let conferenceInfo = response.data.conferenceInfo
              this.initList();
              this.addForm.conferenceName = conferenceInfo.conferenceName
              this.addForm.conferenceType = conferenceInfo.conferenceType
              this.addForm.conferencePlace = conferenceInfo.conferencePlace
              this.conferenceDateList = conferenceInfo.conferenceDateList
              this.addForm.estimateNumber = conferenceInfo.estimateNumber
              this.addForm.saler = conferenceInfo.saler
              this.addForm.sysHospDept = conferenceInfo.sysHospDept
              this.addForm.chairmanList = conferenceInfo.chairmanList
              this.addForm.lecturerList = conferenceInfo.lecturerList
              this.details = conferenceInfo.scheduleList

              this.addForm.conferenceId = conferenceInfo.conferenceId
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
