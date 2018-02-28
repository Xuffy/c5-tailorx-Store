<template>
  <!--1查看详情   2修改-->
  <div class="desinger-detail tx-container">
    <div class="tx-content">

      <h2 class="tx-title">基本信息</h2>
      <div class="tx-content-box">
        <Card class="des-detail-card">
          <p slot="title">详细信息</p>
          <div style="display: flex; flex-direction:column">
            <ul>
              <li style="display: flex;flex-wrap: nowrap;">
                <div>头像设置：</div>
                <div>
                  <v-upload ref="headerImage" :width="80" :height="80"
                            :data-list="initData.photo" :readonly="desingerType === 1"></v-upload>
                </div>

              </li>
              <li class="infoLeft-item">
                <div>姓&emsp;&emsp;名：</div>
                <Input v-if="desingerType === 2" style="flex:1" v-model="initData.name"></Input>
                <span class="readonly" v-if="desingerType === 1">{{initData.name}}</span>
              </li>
              <li class="infoLeft-item">
                <div>等&emsp;&emsp;级：</div>
                <Select v-if="desingerType === 2" clearable style="flex:1" v-model="initData.level">
                  <Option value="高级设计师">高级设计师</Option>
                  <Option value="中级设计师">中级设计师</Option>
                  <Option value="初级设计师">初级设计师</Option>
                </Select>
                <span class="readonly" v-if="desingerType === 1">{{initData.level}}</span>
              </li>
              <li class="infoLeft-item">
                <div>QQ号码&ensp;：</div>
                <Input v-if="desingerType === 2" style="flex:1" v-model="initData.qq"></Input>
                <span class="readonly" v-if="desingerType === 1">{{initData.qq}}</span>
              </li>
              <li class="infoLeft-item">
                <div>手机号码：</div>
                <Input v-if="desingerType === 2" style="flex:1" v-model="initData.phone"></Input>
                <span class="readonly" v-if="desingerType === 1">{{initData.phone}}</span>
              </li>
              <li class="infoLeft-item">
                <div>微信号码：</div>
                <Input v-if="desingerType === 2" style="flex:1" v-model="initData.weChat"></Input>
                <span class="readonly" v-if="desingerType === 1">{{initData.weChat}}</span>
              </li>
            </ul>
          </div>

        </Card>
        <Card class="des-detail-card">
          <p slot="title">个人简介</p>
          <Input type="textarea" :rows="14" placeholder="请输入500字以内个人简介..." style="width: 100%;"
                 v-model="initData.introduction" :disabled="desingerType === 1"></Input>
          <!-- <div v-if="desingerType === 1" style="width: 100%">{{initData.introduction}}</div>-->
        </Card>

        <Card class="des-detail-card">
          <p slot="title">工作经历</p>


          <ul style="margin-bottom: 50px" v-for="(item,index) in workExperience" :key="index">
            <li class="infoLeft-item">
              <div>公司名称：</div>
              <Input v-if="desingerType === 2" style="flex:1" v-model="item.position"></Input>
              <span class="readonly" v-if="desingerType === 1">{{item.position}}</span>
            </li>
            <li class="infoLeft-item">
              <div>曾任职位：</div>
              <Input v-if="desingerType === 2" style="flex:1;" v-model="item.company"></Input>
              <span class="readonly" v-if="desingerType === 1">{{item.company}}</span>
            </li>
          </ul>
        </Card><br>
        <Card class="des-detail-card">
          <p slot="title">教育经历</p>
          <ul v-for="(item,index) in eduExperience" :key="index">
            <li class="infoLeft-item">
              <div>就读专业：</div>
              <Input v-if="desingerType === 2" style="flex:1" v-model="item.specialty"></Input>
              <span class="readonly" v-if="desingerType === 1 && item.specialty">{{item.specialty}}</span>
            </li>
            <li class="infoLeft-item">
              <div>毕业院校：</div>
              <Input v-if="desingerType === 2" style="flex:1;" v-model="item.school"></Input>
              <span class="readonly" v-if="desingerType === 1">{{item.school}}</span>
            </li>
          </ul>
        </Card>

        <Card class="des-detail-card">
          <p slot="title">工作成绩</p>
          <div class="workResult">
            <div class="workResult earnings">
              <div>
                <p style="text-align: center;font-size: 22px">{{initData.deal_count}}</p>
                <p style="text-align: center;font-size: 14px;margin-top: 5px;">收益金额</p>
              </div>
            </div>
          </div>
          <div class="earnings-bottom">
            <div>
              <p style="text-align: center;font-size: 20px">{{initData.order_count}}</p>
              <p style="text-align: center;font-size: 14px;margin-top: 5px;">成交量</p>
            </div>
            <div>
              <p style="text-align: center;font-size: 20px">{{initData.appointmentAmount}}</p>
              <p style="text-align: center;font-size: 14px;margin-top: 5px;">预约量</p>
            </div>
          </div>
        </Card>
        <Card class="des-detail-card">
          <p slot="title">擅长风格</p>
          <div>
            <Tag v-if="desingerType === 2" style="margin-top: 15px;" v-for="(item,index) in count" :key="item"
                 :name="item" type="border" closable color="yellow" @on-close="handleCloseTag">{{item}}
            </Tag>
            <Tag checkable color="green" style="margin-top: 15px;" v-if="desingerType === 1"
                 v-for="(item,index) in count" :key="item" :name="item">{{item}}
            </Tag>
            <Button v-if="!count || count.length <= 4" style="margin-top: 15px;" icon="ios-plus-empty" type="dashed"
                    size="small" @click="addTagPop = true">添加标签
            </Button>
          </div>
          <div style="margin-top: 60px;padding-top:20px;border-top:1px dashed #eee">
            <p style=";">每日最大设计单量</p>
            <div style="margin-top: 10px">
              <Input style="width: 150px" v-model="initData.max_design" :readonly="desingerType === 1">
              <span slot="append">单/天</span>
              </Input>
            </div>
          </div>

        </Card>
      </div>

      <h2 class="tx-title">作品展示</h2>
      <div class="tx-content-box">
        <p style="color:#8c8c8c;margin-bottom: 20px;">注：作品图片尺寸仅支持4:3（最小尺寸800*600）、16:9（最小尺寸800*450）两种比例，且不超过10M</p>
        <v-upload ref="designUpload" :max-num="20" :width="200"
                  :height="150" :data-list="designPicList" :readonly="desingerType === 1"></v-upload>
      </div>

      <Button v-if="desingerType === 2" type="primary" @click="sumbitBtn">提交</Button>
      <Button v-if="desingerType === 1" type="primary" @click="editBtn">编辑</Button>

      <Spin size="large" fix v-if="desDetailLoading"></Spin>
    </div>
    <!--添加标签-->
    <Modal
      title="添加标签"
      v-model="addTagPop"
      :width="400"
      class-name="vertical-center-modal">
      <div style="text-align: center">
        <span>标签名称：</span>
        <Input placeholder="4个字以内" style="width: 220px" v-model="tagName"></Input>
      </div>
      <div slot="footer">
        <Button>取消</Button>
        <Button type="primary" @click="addSure()" :loading="tagAddLoading">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import VUpload from 'components/common/upload'

  export default {
    components: {
      VUpload
    },
    data(){
      return {
        desDetailLoading: false,
        tagAddLoading: false,
        desingerId: this.$route.query.designerId,
        desingerType: Number(this.$route.query.type),
        initData: {},
        workExperience: [{'position': '', 'company': ''}, {'position': '', 'company': ''}],//工作经历
        eduExperience: [{'specialty': '', 'school': ''}],//教育经历
        designPicList: [], //设计作品
        count: [], //标签名称
        addTagPop: false,  //添加标签的按钮
        tagName: ''
      }
    },
    created(){
      this.designerList();
    },
    methods: {
      designerList(){
        this.desDetailLoading = true;
        this.designPicList = [];
        this.ajax.post('/v2/store/designer/getDesignerInfo', {designerId: this.desingerId}).then(res => {
          this.desDetailLoading = false;
          this.initData = res;
          if (res.workExperience) {
            this.workExperience = JSON.parse(res.workExperience);
          }
          if (res.educationExperience) {
            this.eduExperience = JSON.parse(res.educationExperience);
          }
          _.map(res.designerProductions, val => {
            val.productionImg && this.designPicList.push(val.productionImg);
          });
          if (res.styleArray) {
            this.count = _.clone(res.styleArray);
          }

        })
      },
      handleCloseTag(event, name){
        const index = this.count.indexOf(name);
        this.count.splice(index, 1);
      },
      addSure(){
        let val = this.tagName.replace(/["'\\、]/g, "");
        let valReduce = val.replace(/\s+/g, "");
        if (_.isEmpty(valReduce) || parseInt(valReduce.length) > 4) {
          this.$Message.warning('请填写4个字以内正确的标签名称！');
          return;
        }
        ;

        //判断是重复
        if (parseInt(_.indexOf(this.count, valReduce)) !== -1) {
          this.$Message.warning('标签已存在！');
          return;
        } else {
          this.tagAddLoading = true;
          this.count.push(valReduce);
          this.addTagPop = false;
          this.tagAddLoading = false;
        }
      },
      //提交
      sumbitBtn(){
        if (_.isEmpty(this.initData.name) || parseInt(this.initData.name.length) > 6) {
          this.$Message.warning("请输入6个字以内的设计师名字！");
          return;
        }
        if (_.isEmpty(this.initData.introduction) || parseInt(this.initData.introduction.length) > 500) {
          this.$Message.warning("请输入500个字以内的个人简介！");
          return;
        }
        if (_.isEmpty(this.count)) {
          this.$Message.warning("请填写至少一个设计师擅长风格！");
          return;
        }
        if (this.initData.max_design < 0 || this.initData.max_design > 10000) {
          this.$Message.warning("设计师每日最大设计量在0-10000之间！");
          return;
        }
        this.desDetailLoading = true;
        let subPar = {}
          , subpic = this.$refs.designUpload.getData();
        subPar.id = this.desingerId;
        subPar.name = this.initData.name;
        subPar.level = this.initData.level;
        subPar.phone = this.initData.phone;
        subPar.qq = this.initData.qq;
        subPar.weChat = this.initData.weChat;
        subPar.introduction = this.initData.introduction;
        subPar.photo = this.$refs.headerImage.getData();
        subPar.workExperience = JSON.stringify(this.workExperience);
        subPar.educationExperience = JSON.stringify(this.eduExperience);
        subPar.goodStyle = this.count.join('、');
        subPar.max_design = this.initData.max_design;
        subPar.pros = JSON.stringify(subpic.split(','));

        this.ajax.post('/v2/store/designer/updateDesignerInfo', subPar).then(res => {
          this.desDetailLoading = false;
          this.desingerType = 1
          this.designerList();
        })


      },
      editBtn(){
        this.desingerType = 2;
        this.designerList();
      }
    },

  }
</script>
<style scoped type="text/less">
  .des-detail-card {
    width: 320px;
    display: inline-block;
    overflow: hidden;
    margin: 10px 10px 10px 0;
    height: 400px;
  }

  .des-detail-card .infoLeft-item {
    align-items: center;
    flex: 1;
    display: flex;
    flex-wrap: nowrap;
    margin-top: 10px;
  }

  .des-detail-card .workResult {
    display: flex;
    justify-content: center
  }

  .des-detail-card .earnings {
    margin-top: 20px;
    width: 150px;
    height: 150px;
    border-radius: 50% 50%;
    border: 2px solid green;
    align-items: center;
  }

  .des-detail-card .earnings-bottom {
    padding: 20px;
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
  }

  .vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal {
      top: 0;
    }
  }

  .readonly {
    display: inline-block;
    height: 32px;
    line-height: 1.5;
    padding: 8px 7px;
    font-size: 12px;
  }

</style>
<style>
  /*设计师 个人简介*/
  .desinger-detail .ivu-input[disabled]{
    background-color: #fff;
    opacity: 1;
    cursor: not-allowed;
    color: #888;
  }
</style>
