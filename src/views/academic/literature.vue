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
        label="文献标题"
        align="center"
        width="500">
      </el-table-column>
      <el-table-column
        prop="indication"
        label="适应症"
        align="center"
        width="200">
      </el-table-column>
      <el-table-column
        prop="department"
        label="启用状态"
        align="center"
        width="200">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" @change="changeUserState(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="articleDate"
        label="上传时间"
        align="center"
        width="400">
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
    <el-dialog  title="创建文献" :visible.sync="addDialogFormVisible" @close="addDialogFormVisibleTap">
      <el-form :model="addForm" style=" width: 100%;overflow:auto;height: 550px;" label-width="80px" ref="addUserForm">
        <el-form-item label="标题" prop="liveName">
          <el-input v-model="addForm.articleTitle" auto-complete="off"></el-input>
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

        <el-form-item label="学术内容" prop="initiator">
          <el-upload
            :action="academic"
            list-type="picture-card"
            :on-preview="contentPreview"
            :on-success="contentSuccess"
            :on-exceed="contentExceed"
            :limit='100'
            :multiple="false"
            accept=".jpg, .png"
            :file-list="contentImageUrlArray"
            :on-remove="contentRemove">
            <div class="lin">上传文章</div>
          </el-upload>
          <!--          <div style="font-size: 12px;color: #999;">上传大小不可超过5M，且只能上传一张（宽高比例：4:3）</div>-->
          <el-dialog :append-to-body="true" style="z-index: 10000!important;" :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="封面背景" prop="initiator">
          <el-upload
            :action="academic"
            list-type="picture-card"
            :on-preview="posterPreview"
            :on-success="posterSuccess"
            :on-exceed="posterExceed"
            :limit='1'
            :multiple="false"
            accept=".jpg, .png"
            :file-list="posterImageUrlArray"
            :on-remove="posterRemove">
            <div class="lin">上传封面</div>
          </el-upload>
          <div style="font-size: 12px;color: #999;">上传大小不可超过5M，且只能上传一张（宽高比例：4:3）</div>
          <el-dialog :append-to-body="true" style="z-index: 10000!important;" :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="分享卡片" prop="initiator">
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
            <div class="lin">上传卡片</div>
          </el-upload>
          <div style="font-size: 12px;color: #999;">上传大小不可超过5M，且只能上传一张（宽高比例：16:9）</div>
          <el-dialog :append-to-body="true" style="z-index: 10000!important;" :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
      </el-form>
      <div style="margin: 0 auto!important;text-align: center" class="dialog-footer">
        <el-button @click="addDialogFormVisibleTap">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit()">保存</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑文献" :visible.sync="editDialogFormVisible" @close='editDialogFormVisibleTap'>
      <el-form :model="addForm" style=" width: 100%;overflow:auto;height: 550px;" label-width="80px" ref="addUserForm">
        <el-form-item label="标题" prop="liveName">
          <el-input v-model="addForm.articleTitle" auto-complete="off"></el-input>
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

        <el-form-item label="文献内容" prop="initiator">
          <el-upload
            :action="academic"
            list-type="picture-card"
            :on-preview="contentPreview"
            :on-success="contentSuccess"
            :on-exceed="contentExceed"
            :limit='100'
            :multiple="false"
            accept=".jpg, .png"
            :file-list="contentImageUrlArray"
            :on-remove="contentRemove">
            <div class="lin">上传文章</div>
          </el-upload>
          <!--          <div style="font-size: 12px;color: #999;">上传大小不可超过5M，且只能上传一张（宽高比例：4:3）</div>-->
          <el-dialog :append-to-body="true" style="z-index: 10000!important;" :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="封面背景" prop="initiator">
          <el-upload
            :action="academic"
            list-type="picture-card"
            :on-preview="posterPreview"
            :on-success="posterSuccess"
            :on-exceed="posterExceed"
            :limit='1'
            :multiple="false"
            accept=".jpg, .png"
            :file-list="posterImageUrlArray"
            :on-remove="posterRemove">
            <div class="lin">上传封面</div>
          </el-upload>
          <div style="font-size: 12px;color: #999;">上传大小不可超过5M，且只能上传一张（宽高比例：4:3）</div>
          <el-dialog :append-to-body="true" style="z-index: 10000!important;" :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="分享卡片" prop="initiator">
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
            <div class="lin">上传卡片</div>
          </el-upload>
          <div style="font-size: 12px;color: #999;">上传大小不可超过5M，且只能上传一张（宽高比例：16:9）</div>
          <el-dialog :append-to-body="true" style="z-index: 10000!important;" :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
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
        contentImageUrlArray: [],
        wenxianImageUrlArray:[],
        posterImageUrlArray: [],
        coverImageUrlArray: [],
        meetImageUrlArray: [],
        expertImageUrlArray: [],
        dialogImageUrl: '',
        dialogVisible: false,
        headers:{},
        academic:'https://yifangweb.insightin.cn//web/v1.0/common/academic-img-upload?academicType=slide_show',//海报
        cover:'https://yifangweb.insightin.cn//web/v1.0/common/academic-img-upload?academicType=slide_show',//封面
        meet:'https://yifangweb.insightin.cn//web/v1.0/common/academic-img-upload?academicType=slide_show',//会议介绍
        expert:'https://yifangweb.insightin.cn//web/v1.0/common/academic-img-upload?academicType=slide_show',//专家介绍
        posterEd:'',//上传图片带参
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
          status: '',//状态
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
          literatureId: null,//id
          articleTitle: '',//名称
          indication: '',//适应症(三方会特有)(字典)
          indicationName:'',
          titleImageUrl: '',//封面图
          shareImgUrl: '',//分享卡片
          articleImgList: [],//内容图
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
      "userListData.status"() {
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

      // 文献内容成功返回结果
      contentSuccess(file) {
        console.log('file=',file);
        if (file.code == '200') {
          if (file.status == 'success') {
            console.log('file.data.fileFullPath=',file.data.fileFullPath);
            let articl ={
              staticEdaImgId:null,
              imgUrl:'',
            }
            articl.imgUrl = file.data.fileFullPath;
            this.addForm.articleImgList.push(articl)
            console.log('articleImgList=',this.addForm.articleImgList);

          } else {
            this.$message({
              message: file.message,
              type: 'error'
            })
          }
        } else {
          this.$message({
            message: file.message,
            type: 'error'
          })
        }

      },
      // 文献内容删除
      contentRemove(res,file) {
        console.log('res=',res);
        // console.log('res=',res.response.data.fileFullPath);
        console.log('articleImgList=',this.addForm.articleImgList);

        for(let i=0;i<this.addForm.articleImgList.length;i++){
          // arr.splice(i,1);//(循环删除所有元素)i是索引，1是长度，null的意思是该元素替换为null
          if(this.addForm.articleImgList[i].imgUrl == res.url){
            this.addForm.articleImgList.splice(i,1);//删除第2个元素
          }

        }
        console.log('articleImgList=',this.addForm.articleImgList);
      },
      // 文献内容预览图片
      contentPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
        console.log('1111=',file);
      },
      // 文献内容超出数量提醒
      contentExceed() {
        this.$message({
          message: '超过数量限制',
          type: 'error'
        })
      },
      // 卡片封面删
      coverRemove(file, fileList) {
        this.addForm.shareImgUrl = '';
      },
      // 卡片封面超出数量提醒
      coverExceed() {
        this.$message({
          message: '超过数量限制',
          type: 'error'
        })
      },
      // 卡片封面预览图片
      coverPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
        console.log('1111=',file);
      },
      // 卡片封面成功返回结果
      coverSuccess(file) {
        console.log('1111=',file);
        if (file.code == '200') {
          if (file.status == 'success') {
            this.addForm.shareImgUrl = file.data.fileFullPath;
            console.log('this.addForm.shareImgUrl=',this.addForm.shareImgUrl);

          } else {
            this.$message({
              message: file.message,
              type: 'error'
            })
          }
        } else {
          this.$message({
            message: file.message,
            type: 'error'
          })
        }

      },
      // 封面删除
      posterRemove(file, fileList) {
        this.addForm.titleImageUrl = '';
        // this.delete(this.addForm.liveImgPosterId,'poster')
      },
      // 封面超出数量提醒
      posterExceed() {
        this.$message({
          message: '超过数量限制',
          type: 'error'
        })
      },
      // 封面预览图片
      posterPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
        console.log('1111=',file);
      },
      // 封面成功返回结果
      posterSuccess(file) {
        console.log('1111=',file);
        if (file.code == '200') {
          if (file.status == 'success') {
            this.addForm.titleImageUrl = file.data.fileFullPath;
            console.log('this.addForm.titleImageUrl=',this.addForm.titleImageUrl);

          } else {
            this.$message({
              message: file.message,
              type: 'error'
            })
          }
        } else {
          this.$message({
            message: file.message,
            type: 'error'
          })
        }

      },
      // 改变用户状态
      changeUserState(row) {
        console.log(row)
        this.loading = true
        let userListData = {}

        userListData = qs.stringify({
          literatureId:row.literatureId
        });

        // userListData.push(row.userId)
        console.log('userListData=', userListData)
        let url = '/web/v1.0/academic/literature/literature-status-change'
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
        this.userListData.status = ''
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
      // 清空
      liveStatusNull(val) {
        this.userListData.status = '';
      },
      // 清空
      indicationNull(val) {
        this.addForm.indication = '';
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
        this.userListData.status = this.liveStatusList[index]
        // this.conferenceTypeName = this.conferenceTypeList[index].dictName
      },
      // 适应症类型添加
      addindicationListTap(index) {
        this.addForm.indication = this.indicationList[index].dictCode
        this.addForm.indicationName = this.indicationList[index].dictName

        console.log('适应症类型 =', this.addForm.indication)
        console.log('适应症类型名称 =', this.addForm.indicationName)

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
        let url = '/web/v1.0/academic/literature/literature-page'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let list = response.data.literatureList.items
              this.totalCount = response.data.literatureList.totalCount
              this.total = response.data.literatureList.totalCount
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
        if (!this.addForm.articleTitle) {
          this.$message('请填写标题');
          return
        }
        if (!this.addForm.indication) {
          this.$message('请选择适应症');
          return false
        }
        if (this.addForm.articleImgList.length == 0) {
          this.$message('请选择文献内容');
          return
        }
        if (!this.addForm.titleImageUrl) {
          this.$message('请选择封面图');
          return
        }
        if (!this.addForm.shareImgUrl) {
          this.$message('请选择分享卡片');
          return
        }

        this.loading = true
        let userListData = {};
        userListData = {
          literatureId:this.addForm.literatureId,
          articleTitle: this.addForm.articleTitle,
          indication: this.addForm.indication,
          titleImageUrl: this.addForm.titleImageUrl,
          shareImgUrl: this.addForm.shareImgUrl,
          articleImgList: this.addForm.articleImgList,
        };
        console.log('userListData=', userListData)
        let url = '/web/v1.0/academic/literature/literature-save'
        api.postn(url, {}, userListData).then(response => {
          console.log('response=', response)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              this.addDialogFormVisible = false;
              this.editDialogFormVisible = false;
              this.initList();
              this.addForm.literatureId = ''
              this.addForm.articleTitle = ''
              this.addForm.indication = ''
              this.addForm.titleImageUrl = ''
              this.addForm.articleImgList = []
              this.addForm.shareImgUrl = ''
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
        this.addForm.edaId = ''
        this.addForm.articleTitle = ''
        this.addForm.indication = ''
        this.addForm.talkSkillContent = ''
        this.addForm.titleImageUrl = ''
        this.addForm.articleImgList = []
        this.addForm.shareImgUrl = ''
        this.contentImageUrlArray = []
        this.posterImageUrlArray = []
        this.coverImageUrlArray = []


      },
      // 取消编辑弹窗
      editDialogFormVisibleTap() {
        console.log('111')
        this.addDialogFormVisible = false
        this.editDialogFormVisible = false
        this.addDialogFormVisible = false
        this.addForm.literatureId = ''
        this.addForm.articleTitle = ''
        this.addForm.indication = ''
        this.addForm.indicationName= ''
        this.addForm.talkSkillContent = ''
        this.addForm.titleImageUrl = ''
        this.addForm.articleImgList = []
        this.addForm.shareImgUrl = ''
        this.contentImageUrlArray = []
        this.posterImageUrlArray = []
        this.coverImageUrlArray = []


      },
      // 查看编辑
      showEditDialog(row, type) {
        console.log(row)
        this.editDialogFormVisible = true
        this.loading = true
        this.posterEd = {
          literatureId:row.literatureId
        }
        let userListData = {
          literatureId: row.literatureId
        }
        let url = '/web/v1.0/academic/literature/literature-info'
        api.get(url, userListData).then(response => {
          console.log('信息!', response)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let literatureInfo = response.data.literatureInfo

              console.log('this.indicationList=!', this.indicationList)

              for (let i = 0; i < this.indicationList.length; i++) {
                if(this.indicationList[i].dictCode == literatureInfo.indication){
                  this.addForm.indicationName = this.indicationList[i].dictName
                }
              }

              this.addForm.articleImgList = literatureInfo.articleImgList
              this.addForm.articleTitle = literatureInfo.articleTitle
              this.addForm.indication = literatureInfo.indication
              this.addForm.literatureId = literatureInfo.literatureId
              this.addForm.shareImgUrl = literatureInfo.shareImgUrl
              this.addForm.titleImageUrl = literatureInfo.titleImageUrl

              for (let i = 0; i < literatureInfo.articleImgList.length; i++) {
                let contePath = {
                  'url': ''
                }
                contePath.url = literatureInfo.articleImgList[i].imgUrl
                this.contentImageUrlArray.push(contePath)
              }
              if(literatureInfo.titleImageUrl != null && literatureInfo.titleImageUrl != ''){
                let liveImgPosterPath = {
                  'url': literatureInfo.titleImageUrl
                }
                this.posterImageUrlArray.push(liveImgPosterPath)
              }
              //
              if(literatureInfo.shareImgUrl != null && literatureInfo.shareImgUrl != ''){
                let liveImgCoverPath = {
                  'url': literatureInfo.shareImgUrl
                }
                this.coverImageUrlArray.push(liveImgCoverPath)
              }



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
