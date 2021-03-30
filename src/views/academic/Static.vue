<template>
  <div class="user">
    <!--    <div style="padding: 20px">正在研发...</div>-->

    <el-row>
      <el-col :span="24" style="margin-top: 20px;">
        <el-input style="margin-left: 1%;width: 8%" placeholder="标题查询" class="search-input"
                  v-model="userListData.articleTitle"></el-input>
        <el-select style="margin-left: 1%;width: 8%" v-model="indicationName" filterable @clear="indicatNull" clearable
                   placeholder="适应症查询" @change="">

          <el-option
            v-for="(item,index) in indicationList"
            :key="item.dictCode"
            :label="item.dictName"
            :value="item.dictCode"
            :style="'width:100%;'"
            @click.native="indicatTap(index)"></el-option>
        </el-select>

        <el-select style="margin-left: 1%;width: 8%" v-model="liveStatus" filterable @clear="liveStatusNull" clearable
                   placeholder="状态查询" @change="">

          <el-option
            v-for="(item,index) in liveStatusList"
            :key="item"
            :label="item"
            :value="item"
            :style="'width:100%;'"
            @click.native="liveStatusTap(index)"></el-option>
        </el-select>


        <el-button type="primary" style="margin-left: 1%;" @click="ChaxunTap">查询</el-button>
        <el-button type="primary" @click="addDialogFormVisible=true">创建</el-button>
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
        prop="articleTitle"
        label="静态EDA标题"
        align="center"
        width="300">
      </el-table-column>
      <el-table-column
        prop="indication"
        label="适应症"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        prop="department"
        label="启用状态"
        align="center"
        width="120">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" @change="changeUserState(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="articleDate"
        label="上传时间"
        align="center"
        width="150">
      </el-table-column>
      <el-table-column
        prop="talkSkillContent"
        label="拜访话术"
        align="center"
        width="750">
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
    <!--创建会议对话框:-->
    <el-dialog  title="创建静态EDA" :visible.sync="addDialogFormVisible" @close="addDialogFormVisibleTap">
      <el-form :model="addForm" style="width: 100%;overflow:auto;height: 550px;" label-width="80px" ref="addUserForm">
        <el-form-item label="会议名称" prop="liveName">
          <el-input v-model="addForm.liveName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="适应症">
          <el-select v-model="addForm.indicationName" filterable placeholder="请选择适应症类型"  clearable @clear="indicationNull" @change="">
            <el-option
              v-for="(item,index) in indicationList"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode"
              @click.native="addindicationListTap(index)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科室">
          <el-select v-model="addForm.department"  filterable placeholder="请选择科室类型" clearable @clear="departmentNull" @change="">
            <el-option
              v-for="(item,index) in departmentDictList"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode"
              @click.native="departmentDictSelect(index)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="演讲人">
          <el-select v-model="addForm.lecturerIdList" multiple filterable style="width: 100%" placeholder="请选择">
            <el-option
              v-for="item in doctorListVal"
              :key="item.doctorId"
              :label="item.doctorName"
              :value="item.doctorId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="直播方" prop="liveOrg">
          <el-input v-model="addForm.liveOrg" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="会议时间">
          <el-date-picker
            v-model="liveDateList"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发起人" prop="initiator">
          <el-input v-model="addForm.initiator" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="拉流地址" prop="initiator">
          <el-input v-model="addForm.liveUrl" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="直播海报" prop="initiator">
          <el-upload
            :action="poster"
            list-type="picture-card"
            :on-preview="posterPreview"
            :on-success="posterSuccess"
            :on-exceed="posterExceed"
            :limit='1'
            :multiple="false"
            accept=".jpg, .png"
            :file-list="posterImageUrlArray"
            :on-remove="posterRemove">
            <div class="lin">上传图片</div>
          </el-upload>
          <el-dialog :append-to-body="true" style="z-index: 10000!important;" :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="列表封面" prop="initiator">
          <el-upload
            :action="cover"
            list-type="picture-card"
            :on-preview="coverPreview"
            :on-success="coverSuccess"
            :on-exceed="coverExceed"
            :limit='1'
            :multiple="false"
            accept=".jpg, .png"
            :file-list="coverImageUrlArray"
            :on-remove="coverRemove">
            <div class="lin">上传图片</div>
          </el-upload>
          <el-dialog :append-to-body="true" style="z-index: 10000!important;" :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="会议介绍" prop="initiator">
          <el-upload
            :action="meet"
            list-type="picture-card"
            :on-preview="meetPreview"
            :on-success="meetSuccess"
            :on-exceed="meetExceed"
            :limit='1'
            :multiple="false"
            accept=".jpg, .png"
            :file-list="meetImageUrlArray"
            :on-remove="meetRemove">
            <div class="lin">上传图片</div>
          </el-upload>
          <el-dialog :append-to-body="true" style="z-index: 10000!important;" :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="专家介绍" prop="initiator">
          <el-upload
            :action="expert"
            list-type="picture-card"
            :on-preview="expertPreview"
            :on-success="expertSuccess"
            :on-exceed="expertExceed"
            :limit='1'
            :multiple="false"
            accept=".jpg, .png"
            :file-list="expertImageUrlArray"
            :on-remove="expertRemove">
            <div class="lin">上传图片</div>
          </el-upload>
          <el-dialog :append-to-body="true" style="z-index: 10000!important;" :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <div style="font-size: 12px;color: #999;">单个海报，封面，介绍，上传大小不可超过5M，且只能上传一张</div>
        </el-form-item>

      </el-form>

      <div style="margin: 0 auto!important;text-align: center" class="dialog-footer">
        <el-button @click="addDialogFormVisibleTap">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit()">保存</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑会议" :visible.sync="editDialogFormVisible" @close='editDialogFormVisibleTap'>


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
        // "http://yifang.insightin.cn/live_img/poster/1615184721566/4fc3222f0ef00c0a1e08794ef682abc.jpg"
        posterImageUrlArray: [],
        coverImageUrlArray: [],
        meetImageUrlArray: [],
        expertImageUrlArray: [],
        dialogImageUrl: '',
        dialogVisible: false,
        headers:{},
        poster:'https://yifang.insightin.cn/web/v1.0/conference/live/live-img-upload-insert?imgType=poster',//海报
        cover:'https://yifang.insightin.cn/web/v1.0/conference/live/live-img-upload-insert?imgType=cover',//封面
        meet:'https://yifang.insightin.cn/web/v1.0/conference/live/live-img-upload-insert?imgType=info ',//会议介绍
        expert:'https://yifang.insightin.cn/web/v1.0/conference/live/live-img-upload-insert?imgType=lecturer ',//专家介绍

        posterEdit:'https://yifang.insightin.cn/web/v1.0/conference/live/live-img-upload-edit?imgType=poster',//海报
        coverEdit:'https://yifang.insightin.cn/web/v1.0/conference/live/live-img-upload-edit?imgType=cover',//海报
        meetEdit:'https://yifang.insightin.cn/web/v1.0/conference/live/live-img-upload-edit?imgType=info',//海报
        expertEdit:'https://yifang.insightin.cn/web/v1.0/conference/live/live-img-upload-edit?imgType=lecturer',//海报
        posterEd:'',//上传图片带参
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
        liveDateList:[],//会议时间
        value1: [],
        pickerOptionscreate: {
          disabledDate(time) { //开始时间的禁用
            if (that.liveDateEnd != null) {
              return time.getTime() > new Date(that.liveDateEnd).getTime();

            }
          }
        },
        //结束时间
        pickerOptionsend: {
          disabledDate(time) { //结束时间的禁用
            return time.getTime() < new Date(that.liveDateBegin).getTime() - 8.64e7;
          }
        },
        liveStatus:'',
        liveStatusList:['启用','停用'],
        liveDateBegin: '', //起始时间
        liveDateEnd: '', //结束时间
        indicationList: [],//适应症
        departmentDictList:[],//科室
        indicationName: '',//适应症名称
        conferenceTypeList: [],//三方会类型
        conferenceTypeName: '',//三方会名称
        userListData: {
          articleTitle: '',//标题
          indication: '',//适应症
          edaStatus: '',//状态
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
          liveId: null,//直播id
          liveName: '',//直播名称
          indication: '',//适应症(三方会特有)(字典)
          indicationName:'',
          department:'',//科室
          lecturerIdList: [],//演讲人
          liveOrg: '',//只播方
          liveDateList: [],//直播开始、结束
          liveDateBegin: '',//开始时间
          liveDateEnd: '',//结束时间
          initiator: '',//直播发起人
          liveUrl: '',//拉流地址
          liveImgPosterId: '',//直播海报id
          liveImgCoverId: '',//直播封面ID
          liveImgInfoId	: '',//直播会议介绍id
          liveImgLecturerId: '',//直播专家介绍id
        },
        editDialogFormVisible: false,
        grantDialogFormVisible: false,
        LookDialogFormVisible:false,

      }
    },


    mounted: function () {

    },
    watch: {
      "userListData.articleTitle"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },
      "userListData.indication"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },
      "userListData.edaStatus"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },
    },
    created() {
      this.initList()
      this.indicationTap()//三适应症字典项
    },
    methods: {
      // 改变用户状态
      changeUserState(row) {
        console.log(row)
        this.loading = true
        let userListData = {}

        userListData = qs.stringify({
          edaId:row.staticEdaId
        });

        // userListData.push(row.userId)
        console.log('userListData=', userListData)
        let url = '/web/v1.0/academic/eda/eda-status-change'
        api.post(url, {}, userListData).then(response => {
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let openid = response.data.openid;
              console.log('openid!', openid)
              // this.logout('444',openid)
              this.initList()

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
      // 重置
      ChongzhiTap() {
        this.userListData.articleTitle = ''
        this.userListData.indication = ''
        this.userListData.edaStatus = ''
        this.indicationName = ''
        this.conferenceTypeName = ''
        this.userListData.currentPage = 1
        this.initList();
      },
      // 开始时间
      change1: function () {
        console.log('this.liveDateBegin=', this.liveDateBegin)
        this.userListData.liveDateBegin = this.liveDateBegin;
      },
      // 结束时间
      change2: function () {
        console.log('liveDateEnd=', this.liveDateEnd)
        this.userListData.liveDateEnd = this.liveDateEnd;
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
        let headers = {
          'token': getToken(),
        }
        this.headers = headers
        console.log('headers=', headers)

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
        let url = '/web/v1.0/conference/conference/third-conference-type-select'
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
      liveStatusNull(val) {
        this.userListData.edaStatus = '';
      },
      // 清空三方会类型
      indicationNull(val) {
        this.addForm.indication = '';
      },
      // 清空三方会类型
      departmentNull(val) {
        this.addForm.department = '';
      },
      // 三方会类型查询
      conferenceTap(index) {
        console.log('区域下标=', index)
        this.userListData.conferenceType = this.conferenceTypeList[index].dictCode
        this.conferenceTypeName = this.conferenceTypeList[index].dictName
      },
      // 状态查询
      liveStatusTap(index) {
        console.log('区域下标=', index)
        this.userListData.edaStatus = this.liveStatusList[index]
        // this.conferenceTypeName = this.conferenceTypeList[index].dictName
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
        if (this.userListData.liveDateBegin == null) {
          this.userListData.liveDateBegin = ''
        }
        if (this.userListData.liveDateEnd == null) {
          this.userListData.liveDateEnd = ''
        }
        userListData = this.userListData

        console.log('userListData=', userListData)
        let url = '/web/v1.0/academic/eda/static-eda-page'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let list = response.data.staticEdaList.items
              this.totalCount = response.data.staticEdaList.totalCount
              this.total = response.data.staticEdaList.totalCount
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
      // 添加用户
      addUserSubmit() {

        this.paginaSel = 0
        // return
        console.log('this.addForm=', this.addForm)
        if (!this.addForm.liveName) {
          this.$message('请填写会议名称');
          return
        }
        if (!this.addForm.indication) {
          this.$message('请选择适应症');
          return false
        }
        if (!this.addForm.department) {
          this.$message('请选择科室类型');
          return
        }
        if (this.addForm.lecturerIdList.length == 0) {
          this.$message('请选择演讲人');
          return
        }
        if (!this.addForm.liveOrg) {
          this.$message('请填写直播方');
          return
        }
        if (this.liveDateList.length == 0) {
          this.$message('请选择时间');
          return
        }

        if (!this.addForm.initiator) {
          this.$message('请填写发起人');
          return
        }

        if (!this.addForm.liveUrl) {
          this.$message('请填写拉流地址');
          return
        }


        if (!this.addForm.liveImgPosterId) {
          this.$message('请选择直播海报');
          return
        }
        if (!this.addForm.liveImgCoverId) {
          this.$message('请选择直播封面');
          return
        }
        if (!this.addForm.liveImgInfoId) {
          this.$message('请选择会议介绍');
          return
        }
        if (!this.addForm.liveImgLecturerId) {
          this.$message('请选择专家介绍');
          return
        }

        this.loading = true
        let userListData = {};
        userListData = {
          liveId:this.addForm.liveId,
          liveName: this.addForm.liveName,
          indication: this.addForm.indication,
          department: this.addForm.department,
          liveDateList: this.liveDateList,
          lecturerIdList: this.addForm.lecturerIdList,
          liveOrg: this.addForm.liveOrg,
          initiator: this.addForm.initiator,
          liveUrl: this.addForm.liveUrl,
          liveImgCoverId: this.addForm.liveImgCoverId,
          liveImgPosterId: this.addForm.liveImgPosterId,
          liveImgInfoId: this.addForm.liveImgInfoId,
          liveImgLecturerId: this.addForm.liveImgLecturerId,

        };

        console.log('userListData=', userListData)
        let url = '/web/v1.0/conference/live/live-save'
        api.postn(url, {}, userListData).then(response => {
          console.log('response=', response)
          this.loading = false

          if (response.code == '200') {
            if (response.status == 'success') {
              this.addDialogFormVisible = false;
              this.editDialogFormVisible = false;

              this.initList();
              this.addForm.liveId = ''

              this.addForm.liveName = ''
              this.addForm.indication = ''
              this.addForm.indicationName = ''
              this.addForm.department = ''
              this.liveDateList = []
              this.addForm.lecturerIdList = ''
              this.addForm.liveOrg = ''
              this.addForm.initiator = ''
              this.addForm.liveUrl = ''
              this.addForm.liveImgCoverId = ''
              this.addForm.liveImgPosterId = ''
              this.addForm.liveImgInfoId = ''
              this.addForm.liveImgLecturerId = ''
              this.posterImageUrlArray= [];
              this.coverImageUrlArray= [];
              this.meetImageUrlArray= [];
              this.expertImageUrlArray= [];

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
        this.addForm.liveId = ''
        this.addForm.liveName = ''
        this.addForm.indication = ''
        this.addForm.indicationName = ''

        this.addForm.department = ''
        this.liveDateList = []
        this.addForm.lecturerIdList = ''
        this.addForm.liveOrg = ''
        this.addForm.initiator = ''
        this.addForm.liveUrl = ''
        this.addForm.liveImgCoverId = ''
        this.addForm.liveImgPosterId = ''
        this.addForm.liveImgInfoId = ''
        this.addForm.liveImgLecturerId = ''
        this.posterImageUrlArray= [];
        this.coverImageUrlArray= [];
        this.meetImageUrlArray= [];
        this.expertImageUrlArray= [];

      },
      // 取消编辑弹窗
      editDialogFormVisibleTap() {
        console.log('111')
        this.addDialogFormVisible = false

        this.editDialogFormVisible = false
        this.addForm.liveId = ''
        this.addForm.liveName = ''
        this.addForm.indication = ''
        this.addForm.indicationName = ''
        this.addForm.department = ''
        this.liveDateList = []
        this.addForm.lecturerIdList = ''
        this.addForm.liveOrg = ''
        this.addForm.initiator = ''
        this.addForm.liveUrl = ''
        this.addForm.liveImgCoverId = ''
        this.addForm.liveImgPosterId = ''
        this.addForm.liveImgInfoId = ''
        this.addForm.liveImgLecturerId = ''
        this.posterImageUrlArray= [];
        this.coverImageUrlArray= [];
        this.meetImageUrlArray= [];
        this.expertImageUrlArray= [];

      },
      // 取消查看
      LookDialogFormVisibleTap() {
        console.log('111')
        this.LookDialogFormVisible = false
      },
      // 显示查看
      LookEditDialog(row, type) {
        console.log(row)
        // 跳转至订单列表页面传参
        this.$router.push({
          path: '/ToView',
          query: {
            id: row.liveId,
          }
        }) // 带参跳转


      },
      // 显示编辑用户对话框
      showEditDialog(row, type) {
        console.log(row)
        this.editDialogFormVisible = true
        this.loading = true
        this.posterEd = {
          liveId:row.liveId
        }
        let userListData = {
          liveId: row.liveId
        }
        let url = '/web/v1.0/conference/live/live-info'
        api.get(url, userListData).then(response => {
          console.log('信息!', response)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let liveInfo = response.data.liveInfo
              this.initList();

              let list = [];
              for (let i = 0; i < liveInfo.lecturerList.length; i++) {
                list.push(liveInfo.lecturerList[i].lecturerId)
                if(i == liveInfo.lecturerList.length - 1){
                  this.addForm.lecturerIdList = list
                }

              }
              console.log('list=!', list)




              this.addForm.liveId = liveInfo.liveId
              this.addForm.liveName = liveInfo.liveName
              this.addForm.indication = liveInfo.indication
              // this.addForm.indicationName = liveInfo.indicationName
              this.addForm.department = liveInfo.department
              this.liveDateList = liveInfo.liveDateList
              this.addForm.liveOrg = liveInfo.liveOrg
              this.addForm.initiator = liveInfo.initiator
              this.addForm.liveUrl = liveInfo.liveUrl
              this.addForm.liveImgCoverId = liveInfo.liveImgCoverId
              this.addForm.liveImgPosterId = liveInfo.liveImgPosterId
              this.addForm.liveImgInfoId = liveInfo.liveImgInfoId
              this.addForm.liveImgLecturerId = liveInfo.liveImgLecturerId

              if(liveInfo.liveImgPosterPath != null && liveInfo.liveImgPosterPath != ''){
                let liveImgPosterPath = {
                  'url': liveInfo.liveImgPosterPath
                }
                this.posterImageUrlArray.push(liveImgPosterPath)
              }

              if(liveInfo.liveImgCoverPath != null && liveInfo.liveImgCoverPath != ''){
                let liveImgCoverPath = {
                  'url': liveInfo.liveImgCoverPath
                }
                this.coverImageUrlArray.push(liveImgCoverPath)
              }

              if(liveInfo.liveImgInfoPath != null && liveInfo.liveImgInfoPath != ''){
                let liveImgInfoPath = {
                  'url': liveInfo.liveImgInfoPath
                }
                this.meetImageUrlArray.push(liveImgInfoPath)
              }

              if(liveInfo.liveImgLecturerPath != null && liveInfo.liveImgLecturerPath != ''){
                let liveImgLecturerPath = {
                  'url': liveInfo.liveImgLecturerPath
                }
                this.expertImageUrlArray.push(liveImgLecturerPath)
              }



              // this.posterImageUrlArray= [];
              // this.coverImageUrlArray= [];
              // this.meetImageUrlArray= [];
              // this.expertImageUrlArray= [];
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
