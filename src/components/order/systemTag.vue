<template>
  <div class="tx-order-system-tag" v-if="tagList.sex || tagList.style || tagList.season">
    <Form :label-width="90">
      <FormItem label="性别标签：" style="margin-bottom: 10px">
        <Tag v-if="readonly" color="default">{{sexTagId}}</Tag>
        <RadioGroup v-if="!readonly" v-model="sexTagId">
          <Radio style="margin-right: 20px" v-for="(item,index) in tagList.sex" :key="item.id"
                 :label="item.id">
            {{item.tagName}}
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="款式标签：" style="margin-bottom: 10px">
        <Tag v-if="readonly" color="default">{{styleTagId}}</Tag>
        <RadioGroup v-if="!readonly" v-model="styleTagId">
          <Radio style="margin-right: 20px" v-for="item in tagList.style" :key="item.id"
                 :label="item.id">{{item.tagName}}
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="季节标签：" style="margin-bottom: 10px">
        <Tag v-if="readonly" color="default">{{seasonTagId}}</Tag>
        <RadioGroup v-if="!readonly" v-model="seasonTagId">
          <Radio style="margin-right: 20px" v-for="item in tagList.season" :key="item.id"
                 :label="item.id">{{item.tagName}}
          </Radio>
        </RadioGroup>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  // 选择系统标签组件
  export default {
    name: 'systemTag',
    props: {
      readonly: { // 只读
        type: Boolean,
        default: false
      },
      sexTag: String,
      styleTag: String,
      seasonTag: String
    },
    data () {
      return {
        tagList: {},
        sexTagId: this.sexTag || '',
        styleTagId: this.styleTag || '',
        seasonTagId: this.seasonTag || ''
      }
    },
    mounted() {
      this.$getTags(1).then(data => {
        this.tagList = data;
      });
    },
    watch: {
      sexTag(val) {
        this.sexTagId = val || '';
      },
      styleTag(val) {
        this.styleTagId = val || '';
      },
      seasonTag(val) {
        this.seasonTagId = val || '';
      }
    },
    methods: {
      getData(){
        return {
          sexTagId: this.sexTagId,
          styleTagId: this.styleTagId,
          seasonTagId: this.seasonTagId
        }
      },
      validate(){
        if (!this.sexTagId) {
          this.$Message.warning('请选择性别标签');
          return false;
        }
        if (!this.styleTagId) {
          this.$Message.warning('请选择款式标签');
          return false;
        }
        if (!this.seasonTagId) {
          this.$Message.warning('请选择季节标签');
          return false;
        }
        return true;
      }
    }
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
