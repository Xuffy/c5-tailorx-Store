<template>
  <!--<div>
    <iframe ref="iframe-store" class="tx-nesting" :src="url"></iframe>
  </div>-->
  <div class="templet-index tx-container">
    <div class="tx-form-search">
      <Form ref="templetSearch" :model="templetSearch" :label-width="65" inline>
        <FormItem label="关键字">
          <Input placeholder="搜索标签、设计师" v-model="templetSearch.keyWord"></Input>
        </FormItem>
        <FormItem label="性别标签">
          <Select clearable placeholder="全部" v-model="templetSearch.systemTagSexId">
            <Option v-for="item in tagData.sex" :key="item.tagId" :value="item.tagId">{{item.tagName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="款式标签">
          <Select clearable placeholder="全部" v-model="templetSearch.systemTagStyleId">
            <Option v-for="item in tagData.style" :key="item.tagId" :value="item.tagId">{{item.tagName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="季节标签">
          <Select clearable placeholder="全部" v-model="templetSearch.systemTagSeasonId">
            <Option v-for="item in tagData.season" :key="item.tagId" :value="item.tagId">{{item.tagName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="创建时间">
          <Row>
            <Col span="11">
            <DatePicker type="date" placeholder="开始时间" v-model="templetSearch.startTime"></DatePicker>
            </Col>
            <Col span="2" style="text-align: center">~</Col>
            <Col span="11">
            <DatePicker type="date" placeholder="结束时间" v-model="templetSearch.endTime"></DatePicker>
            </Col>

          </Row>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="getTemplateList">查询</Button>
          <Button type="ghost" style="margin-left: 8px" @click="handleReset(templetSearch)">重置</Button>
        </FormItem>
      </Form>
    </div>
    <div style="margin: 15px auto">
      <Button @click="templetListAdd">添加版式</Button>
    </div>
    <div class="templet-cardList">
      <Card class="card" v-for="(item,index) in templeData.data" :key="item.id">
        <p slot="title">
          <Icon type="social-designernews-outline"></Icon>
          {{item.designerName}}
        </p>
        <!--v-if="item.owner"-->
        <span class="cardEdit" slot="extra" v-if="item.owner" @click="templetEdit(item.id)">
          <Icon type="edit"></Icon>编辑
        </span>
        <div class="coverPhoto">
         <!-- <img :src="item.picUrls | picSrc" @click="templetDetail(item.id,item.owner)">-->
         <v-image v-if="item.picUrls" :src="item.picUrls.split(',')[0]"
                   :width="275"
                   :height="200"
                  @click.native="templetDetail(item.id,item.owner)"></v-image>
        </div>
        <ul>
          <li>
            <span v-if="item.plateTypeBokes.length > 0" style="display: inline-block;width: 170px;">{{item.plateTypeBokes[0].sizeStr}}码</span> <span>{{item.createTimeStr}}</span>
          </li>
          <li v-if="item.plateTypeBokes.length > 0">
            <div style="font-size: 12px;display: flex; flex-direction: row; flex-wrap: nowrap">
              <a href="javascript:;" >
                <span class="sizeItem" @click="download(item.plateTypeBokes[0].url)">{{item.plateTypeBokes[0].fileName}}</span>
              </a>
            </div>
          </li>
        </ul>
      </Card>
    </div>
    <div style="text-align:right;width: 100%;margin-top: 30px;">
      <Page :total="templeData.totalSize" show-elevator show-sizer show-total :current="templetSearch.page + 1" placement="top" @on-change="getTemplateList" @on-page-size-change="changePageSize"></Page>
    </div>
    <!--详情-->
    <Modal
      title="详情"
      v-model="cadDetail"
      :styles="{maxWidth:'1250px',minWidth:'1190px',top: '20px'}">
      <div class="cadDetail-left">
        <!--v-model="templetDetailData.plateTypePicList"-->
        <Carousel v-model="value1" class="carousel-box" v-if="templetDetailData && cadDetail">
          <CarouselItem v-if="item.id" v-for="item in templetDetailData.plateTypePicList" :key="item.id">
            <div class="carousel">
              <!--<img :src="item.url">-->
              <v-image :src="item.url"
                       :width="840"
                       :height="595">
                       </v-image>
            </div>
          </CarouselItem>
        </Carousel>
      </div>
      <div class="cadDetail-right">
        <span class="cardEdit" slot="extra" v-if="ownType" @click="templetEdit(templetDetailData.id)">
          <Icon type="edit"></Icon>编辑
        </span>
        <Form :label-width="65" :model="templetDetailData" v-if="templetDetailData">
          <FormItem label="设计师：">{{templetDetailData.designerName}}</FormItem>
          <FormItem label="标签：">
            <span v-for="item in templetDetailData.tagSystems">
              <Tag type="border"color="yellow">{{item.tagName}}</Tag>
            </span>
            <span v-for="item in templetDetailData.tagCommons">
              <Tag type="border"color="yellow">{{item.tagName}}</Tag>
            </span>
          </FormItem>
          <FormItem label="时间：">{{templetDetailData.createTimeStr}}</FormItem>
          <FormItem label="版式图：" >
            <span v-for="(item, index) in templetDetailData.plateTypeBokes" :key="item.id">{{item.sizeStr}}码<a href="javascript:;"><span @click="download(item.url)">{{item.fileName}}</span></a><br/></span>

          </FormItem>
          <FormItem label="说明：">
            <Input v-model="descriptExplain" disabled  class="desInput" type="textarea" :autosize="{minRows: 1,maxRows: 14}" ></Input>
            <!--{{templetDetailData.description}}-->
          </FormItem>
        </Form>
      </div>
      <Spin size="large" fix v-if="templetDetailLoading"></Spin>
    </Modal>
    <Spin size="large" fix v-if="templetLoading"></Spin>
  </div>
</template>

<script>
import VImage from 'components/common/image';


  export default {
    name: 'picture',
    components: {
      VImage,
    },
    data () {
      return{
        templetLoading:false,
        templetDetailLoading:false,
        tagData:[],
        templeData:{},
        templetSearch: {
          keyWord:'',
          page:0,
          pageLength:10,
          systemTagSexId:'',
          systemTagStyleId:'',
          systemTagSeasonId:'',
          startTime:'',
          endTime:''
        },
        //详情弹框
        value1:0,
        cadDetail:false,
        templetDetailData:{},
        descriptExplain:'',
        ownType:false,
      }
    },
    filters : {
      picSrc (v) {
        let picSrcVal='';
        picSrcVal =  v.split(',');
        return picSrcVal[0];

      }
    },
    mounted () {
      let sessionSearch = this.$sessionStore.get('templet_index_search');
      this.getSearchTagList();
      if(!_.isEmpty(sessionSearch)){
        this.templetSearch = sessionSearch;
      }
        this.getTemplateList();
    },
    methods: {
      //标签
      getSearchTagList () {
        this.ajax.get('/v3/store/tag/getSearchTagList').then( res => {
          this.tagData.sex = res.filter(item => item.tagType == 1);
          this.tagData.style = res.filter(item => item.tagType == 2);
          this.tagData.season = res.filter (item => item.tagType == 3);
          this.templetLoading = false;
        })
      },
      getTemplateList (page) {
        if(_.isNumber(page)){
          this.templetSearch.page  = page - 1;
        }
        this.templetLoading = true;
        this.ajax.post('/v3/store/plateType/list',this.templetSearch).then(res => {
          this.templeData = res;
          this.$sessionStore.set('templet_index_search',this.templetSearch);
          this.templetLoading = false;
        }).catch(() => {
          this.templetLoading = false;
        })
      },
      changePageSize (len) {
        this.templetSearch.pageLength = len;
        this.templetSearch.page = 0;
        this.getTemplateList();
      },
      handleReset (name) {
        this.templetSearch = this.$options.data().templetSearch;
        this.getTemplateList();
      },
      download (url) {
        window.open( url);
      },
      //弹框
      templetDetail (id,own) {
        this.templetDetailLoading = true;
        this.cadDetail = true;
        this.ownType = own;
        this.ajax.post('/v3/store/plateType/getPlateTypeInfo',{id:id}).then( res =>{
          this.templetDetailData = res;
          this.descriptExplain = this.$htmlToText (res.description);
          this.templetDetailLoading = false;
        }).catch( () =>{
          this.templetDetailLoading = false;
        })

      },
      //版式图
      templetListAdd () {
        this.$router.push({path:'/templet/edit',query:{type:1}});
      },
      templetEdit (id) {
        this.$router.push({path:'/templet/edit',query:{id:id,type:2}});
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .templet-cardList{
  }
  .templet-cardList .card{
    width:310px;
    height: 352px;
    background-color: #FCFCFC;
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 12px;
    overflow: hidden;
  }
  .templet-cardList .coverPhoto{
    width: 100%;
    height:200px ;
    margin-bottom: 10px;
  }
  .templet-cardList .coverPhoto img{
    width: 100%;
    height: 100%;
  }
  .templet-cardList li {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-bottom: 10px;
  }
  .cardEdit{
    color:#2d8cf0;
    cursor: pointer;
  }
  /*弹框*/
  .cadDetail-left{
    width: 840px;
    height: 595px;
    display: inline-block;
    overflow: hidden;
  }
  .cadDetail-left .carousel-box{
    width: 100%;
    height: 100%;
  }
  .carousel-box .carousel img{
    width: 100%;
    height: 100%;
  }
  .cadDetail-right{
    width: 312px;
    display: inline-block;
    height: 590px;
    overflow: hidden;
  }
  .sizeItem{
    display: inline-block;
    flex: 1;
    width: 280px;
    height: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap:break-word;
    word-break:break-all;
  }
</style>
<style>
  .cadDetail-right .desInput textarea{
    font-size: 12px;
  }
  .cadDetail-right .desInput textarea[disabled]{
    color:#495060;
    background-color: #fff;
  }
</style>
