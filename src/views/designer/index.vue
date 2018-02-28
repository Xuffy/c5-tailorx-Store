<template>
  <div class="desinger-index tx-container">
    <div class="tx-form-search">
      <Form :label-width="96" inline>
        <FormItem label="关键字">
          <Input placeholder="姓名/ID" v-model="params.name"></Input>
        </FormItem>
        <FormItem label="等级">
          <Select clearable style="width:240px" v-model="params.level">
            <Option value="高级设计师">高级设计师</Option>
            <Option value="中级设计师">中级设计师</Option>
            <Option value="初级设计师">初级设计师</Option>
          </Select>
        </FormItem>
        <FormItem label="成交量">
          <Row>
            <Col span="11">
            <Input placeholder="请输入" v-model="params.minOrderCount"></Input>
            </Col>
            <Col span="2" style="text-align: center">~</Col>
            <Col span="11">
            <Input placeholder="请输入" v-model="params.maxOrderCount"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="收益金额">
          <Row>
            <Col span="11">
            <Input placeholder="请输入" v-model="params.minAmount"></Input>
            </Col>
            <Col span="2" style="text-align: center">~</Col>
            <Col span="11">
            <Input placeholder="请输入" v-model="params.maxAmount"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="每日最大设计量">
          <Row>
            <Col span="11">
            <Input placeholder="请输入" v-model="params.maxDesign1"></Input>
            </Col>
            <Col span="2" style="text-align: center">~</Col>
            <Col span="11">
            <Input placeholder="请输入" v-model="params.maxDesign2"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="在职状态">
          <Select clearable style="width:240px" v-model="params.status">
            <Option value=1>在职</Option>
            <Option value=0>已离职</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="getInitList()">查询</Button>
          <Button type="ghost" @click="handleReset(params)">重置</Button>
        </FormItem>
      </Form>
    </div>
    <div>
      <div style="margin-bottom: 10px;">
        <Button @click="adddesinger = true">新增设计师</Button>
      </div>
      <Table :columns="desingerColumns" :data="desingerData"></Table>
    </div>
    <div style="text-align: right;width: 100%;margin-top: 30px;">
      <Page :total="pageTotal" show-elevator show-sizer show-total :current="params.page+1" placement="top" @on-change="getInitList" @on-page-size-change="changePageSize"></Page>
    </div>
    <!--添加设计师-->
    <Modal
      title="添加设计师"
      v-model="adddesinger"
      :styles="{top: '40px'}">
      <div style="margin:0 auto;width: 70%" >
        <div style="margin-bottom: 20px;">
          <Icon type="person" size="20"></Icon><span class="add-icon">姓名：</span>
          <div class="add-input">
            <input v-model="addDesingerParam.name">
          </div>
        </div>
        <div style="margin-bottom: 20px;">
          <Icon type="android-phone-portrait" size="20"></Icon><span class="add-icon">电话：</span>
          <div class="add-input">
            <input v-model="addDesingerParam.phone">
          </div>
        </div>

      </div>
      <div slot="footer">
        <Button type="text" @click="adddesinger = false">取消</Button>
        <Button type="primary" @click="addDesingInfo" :loading="addDesLoading">确定</Button>
      </div>
    </Modal>
    <Spin size="large" fix v-if="desIndexLoading"></Spin>
  </div>

</template>

<script>
//  import env_config from 'service/config'
import VImage from 'components/common/image'

  export default {
    name: 'picture',
    components:{
      VImage
    },
    data(){
      return{
        desIndexLoading:false,
        addDesLoading:false,
        adddesinger:false,
        addDesingerParam:{
          name:'',
          phone:''
        },
        desingerColumns:[
          {
            title:'头像',
            align:'center',
            render: (h,param) =>{
              return h(VImage,{
                props:{
                  src: param.row.photo,
                  width:70,
                  height:50
                }
              })
            }
          },
          {
            title:'姓名（ID）',
            align:'center',
            render: (h,param) => {
              return param.row.name +'('+param.row.id +')'
            }
          },
          {
            title:'等级',
            align:'center',
            key:'level',
          },
          {
            title:'成交量',
            align:'center',
            key:'order_count',
          },
          {
            title:'收益金额',
            align:'center',
            render: (h,param) => {
              return '¥' + param.row.deal_count
            }
          },
          {
            title:'每日最大设计量',
            align:'center',
            key:'max_design',
          },
          {
            title:'添加时间',
            align:'center',
            render:(h,param) =>{
              let dataTime = this.$dateFormat(param.row.createDate,'yyyy-mm-dd');
              return dataTime;
            }
          },
          {
            title:'预约量',
            align:'center',
            key:'appointmentAmount'
          },
          {
            title:'在职状态',
            align:'center',
            key:'status',
            render: (h,param) => {
              return param.row.status === 1 ? '在职' : ( param.row.status === 0 ? '已离职':'')
            }
          },
          {
            title:'操作',
            align:'center',
            width:'130',
            render:(h,param) => {
              let btns = []
                ,item = param.row;
              btns.push(this.createBtn(h,'编辑',()=>{
                  this.$router.push({path:'/designer/detail',query:{designerId:item.id,type:2}});
              }));
              btns.push(this.createBtn(h,'删除',()=>{
                  this.deleteDesinger(item.id);
              }));
              btns.push(this.createBtn(h,'查看详情',()=>{
                  this.$router.push({path:'/designer/detail',query:{designerId:item.id,type:1}})
              }));
              if(item.status === 1){
                btns.push(this.createBtn(h,'离职',()=>{
                    this.editDesinger(item.id,item.status)
                }));
              }else if(item.status === 0){
                btns.push(this.createBtn(h,'在职',()=>{
                  this.editDesinger(item.id,item.status)
                }));
              }
              return h('div', btns);
            }
          }
        ],
        desingerData:[],
        params:{
          name:'',
          level:'',
          status:'',
          minOrderCount:'',
          maxOrderCount:'',
          minAmount:'',
          maxAmount:'',
          maxDesign1:'',
          maxDesign2:'',
          page:0,
          pageLength:10
        },
        pageTotal:0,
      }
    },
    created () {
        this.getInitList();
    },
    methods:{
       getInitList(page){
        this.desIndexLoading = true;
        if(_.isNumber(page)){
          this.params.page = page - 1
        }
        this.ajax.post('/v2/store/designer/findDesignerList',this.params).then(res =>{
          this.desIndexLoading = false;
          this.desingerData = res.data;
          this.pageTotal = res.totalSize;
        })
      },
      handleReset(name){
this.params = this.$options.data().params;
        this.getInitList();
      },
      changePageSize(len){
        this.params.pageLength = len;
        this.params.page = 0;
        this.getInitList();
      },
      createBtn(render,label,callback){
        return render ('Button',{
          props: {
            type:'text',
            size:'small',
          },
          on:{
            click:() =>{
              callback && callback();
            }
          }
        },label)
      },
      editDesinger(id,status){
        let title;
        if(status === 1 ){
          title = '确认离职该员工？';
          status = 0
        }else if(status === 0 ){
          title = '确认该员工已在职？';
          status = 1
        }
        this.$Modal.confirm({
          title: '操作提示',
          content: title,
          onOk: () => {
            this.desIndexLoading = true;
            this.ajax.post('/v2/store/designer/updateStatus',{designerId:id,status:status}).then(res => {
              this.$Message.info('操作成功！');
              this.getInitList();
            });

          },
        });
      },
      deleteDesinger(id){
        this.$Modal.confirm({
          title:'提示操作',
          content:'确认删除该设计师？',
          onOk: () => {
            this.desIndexLoading = true;
            this.ajax.post('/v2/store/designer/deleteDesigner',{designerId: id}).then(res => {
              this.$Message.info('操作成功！');
              this.getInitList();
            })
          }
        })
      },
      addDesingInfo(){
        if(_.isEmpty(this.addDesingerParam.name)){
          this.$Message.warning('请填写添加设计师名字！');
          return false;
        }
        if(_.isEmpty(this.addDesingerParam.phone)){
          this.$Message.warning('请填写联系方式！');
          return false;
        }
        let myreg = /(1[3-9]\d{9}$)/;
        if(!myreg.test(this.addDesingerParam.phone)){
          this.$Message.error('手机格式输入有误！');
          return false;
        }
        this.addDesLoading = true;
        this.ajax.post('/v2/store/designer/addDesigner',this.addDesingerParam).then(res =>{
          this.adddesinger = false;
          this.desIndexLoading = false;
          this.getInitList();
        })
      },
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
  .add-icon{
    display: inline-block;
    width: 50px;
    text-align: right;
  }
.add-input{
  display: inline-block;
  border-bottom: 1px solid #eee;
}
  .add-input input{
    width: 250px;
    height: 32px;
    line-height: 1.5;
    padding: 4px 7px;
    font-size: 12px;
    border: none;
    border-radius: 4px;
    color: #495060;
    background-color: #fff;
    background-image: none;
    position: relative;
    cursor: text;
  }

</style>
