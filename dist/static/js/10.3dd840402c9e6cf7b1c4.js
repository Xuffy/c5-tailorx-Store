webpackJsonp([10],{"+Mie":function(t,e,i){var a=i("ZOyh");"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);i("8bSs")("8855bcb8",a,!1)},"/Vwx":function(t,e,i){"use strict";(function(t){var a=i("2Dkn"),o=i("7quG"),s=i("04QK");e.a={name:"commonUpload",props:{readonly:{type:Boolean,default:!1},dataList:{type:[Array,String]},valueKey:String,maxNum:{type:Number,default:1},width:{type:Number,default:80},height:{type:Number,default:80}},components:{VImage:s.a,VPreviewImage:o.a},data:function(){return{uploadList:[],uploadParams:{data:{type:1},action:a.a.ENV.api+"/v2/store/file/uploadFiles",headers:{"utouu-open-client-ticket":this.$localStore.get("ticket")}}}},mounted:function(){var e=this,i=t.clone(this.dataList);t.isString(i)&&(i=i?[this.dataList]:[]),this.uploadList=t.map(t.compact(i),function(t){return{url:e.valueKey?t[e.valueKey]:t}})},watch:{dataList:function(e){var i=this;t.isString(e)&&(e=e?[e]:[]),this.uploadList=t.map(t.compact(e),function(t){return{url:i.valueKey?t[i.valueKey]:t}})}},methods:{getData:function(e){return t.map(this.uploadList,function(t){return t.url}).join(e||",")},validate:function(){return t.isEmpty(this.uploadList)?(this.$Message.warning("请上传图片"),!1):!(this.uploadList.length>this.maxNum)||(this.$Message.warning("图片上传异常，请重新上传！"),!1)},uploadDelete:function(e){this.uploadList=t.filter(this.uploadList,function(t){return t.url!==e.url})},uploadBefore:function(){if(this.uploadList.length>=this.maxNum&&1!==this.maxNum)return this.$alert("只能上传"+this.maxNum+"张图片"),!1},uploadProgress:function(){var e=this;1===this.maxNum&&this.$refs.commonUpload.fileList.length>0?this.uploadList=[t.last(this.$refs.commonUpload.fileList)]:t.map(this.$refs.commonUpload.fileList,function(i){if(e.uploadList.length>=e.maxNum&&1!==e.maxNum)return e.$alert("只能上传"+e.maxNum+"张图片"),!1;t.findWhere(e.uploadList,{uid:i.uid})||e.uploadList.push(i)})},uploadSuccess:function(e,i){i.url=e.data[0],this.$refs.commonUpload.fileList=t.filter(this.$refs.commonUpload.fileList,function(t){return"finished"!==t.status})}}}}).call(e,i("u47Y"))},"04QK":function(t,e,i){"use strict";function a(t){r||i("+Mie")}var o=i("ZMJk"),s=i("zQ7w"),r=!1,n=i("/Xao"),c=a,l=n(o.a,s.a,!1,c,"data-v-44ba65cc",null);l.options.__file="src\\components\\common\\image.vue",l.esModule&&Object.keys(l.esModule).some(function(t){return"default"!==t&&"__"!==t.substr(0,2)})&&console.error("named exports are not supported in *.vue files."),e.a=l.exports},"1pFO":function(t,e,i){"use strict";var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"tx-order-preview-image"},[t.imageModal?i("div",{staticClass:"image-carousel",on:{click:function(e){t.imageModal=!1}}},[i("div",{staticClass:"carousel-box",on:{click:function(e){e.stopPropagation(),t.imageModal=!0}}},[i("Carousel",{attrs:{loop:"",dots:1===t.dataList.length?"none":"outside",value:t.index,arrow:1===t.dataList.length?"never":"hover"}},t._l(t.dataList,function(e,a){return i("CarouselItem",{key:a},[i("div",{staticClass:"image-box"},[i("img",{staticStyle:{"max-width":"800px"},style:{"max-height":.9*t.windowHeight+"px"},attrs:{src:t.valueKey?e[t.valueKey]:e}})])])}))],1)]):t._e()])},o=[];a._withStripped=!0;var s={render:a,staticRenderFns:o};e.a=s},"3MfA":function(t,e,i){e=t.exports=i("BkJT")(!1),e.push([t.i,".common-upload-list[data-v-20d91652]{display:inline-block;text-align:center;border:1px solid transparent;border-radius:4px;overflow:hidden;background:#fff;position:relative;-webkit-box-shadow:0 1px 1px rgba(0,0,0,.2);box-shadow:0 1px 1px rgba(0,0,0,.2);margin-right:10px;margin-bottom:10px}.common-upload-list img[data-v-20d91652]{width:100%;height:100%}.common-upload-list-cover[data-v-20d91652]{display:none;position:absolute;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,.6)}.common-upload-list:hover .common-upload-list-cover[data-v-20d91652]{display:block}.common-upload-list-cover .icon-box[data-v-20d91652]{color:#fff;position:absolute;top:50%;left:25%;line-height:1;cursor:pointer;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.common-upload-list-cover .icon-box[data-v-20d91652]:last-child{left:65%}.common-upload-list-cover span.readonly[data-v-20d91652]{width:100%;left:0;text-align:center}",""])},"4Y2J":function(t,e,i){t.exports=i.p+"static/img/store_cover.db95b1e.png"},"5H2H":function(t,e,i){var a=i("3MfA");"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);i("8bSs")("0d7755c6",a,!1)},"7quG":function(t,e,i){"use strict";function a(t){r||(i("voQX"),i("WIru"))}var o=i("H3hZ"),s=i("1pFO"),r=!1,n=i("/Xao"),c=a,l=n(o.a,s.a,!1,c,"data-v-7117b9f8",null);l.options.__file="src\\components\\common\\previewImage.vue",l.esModule&&Object.keys(l.esModule).some(function(t){return"default"!==t&&"__"!==t.substr(0,2)})&&console.error("named exports are not supported in *.vue files."),e.a=l.exports},Cod1:function(t,e,i){"use strict";var a=i("04QK"),o=i("Zok3");e.a={components:{VImage:a.a,VUpload:o.a},data:function(){return{pics:{coverUrl:i("4Y2J"),banner:i("YSGI")},picsData:{}}},created:function(){this.getPics()},methods:{getPics:function(){var t=this;this.ajax.post("/v2/store/myStore/findStoreDecorate").then(function(e){t.picsData=e})},saveDec:function(){if(!this.$refs.coverImage.validate())return!1;if(!this.$refs.picHeader.validate())return!1;var t=this.$refs.coverImage.getData(),e=this.$refs.picHeader.getData().replace(/,/g,";");this.ajax.post("/v2/store/myStore/addStoreDecorate",{coverImage:t,images:e}).then(function(t){})}}}},DFHZ:function(t,e,i){var a=i("RenH");"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);i("8bSs")("668afd48",a,!1)},FSDW:function(t,e,i){"use strict";var a=function(){var t=this,e=this,i=e.$createElement,a=e._self._c||i;return a("div",{staticClass:"tx-order-common-upload"},[e.readonly?e._e():a("Upload",{ref:"commonUpload",staticStyle:{display:"inline-block",position:"relative","vertical-align":"top","margin-right":"10px"},style:{width:e.width-2+"px"},attrs:{name:"files",format:["jpg","jpeg","png"],"max-size":2048,action:e.uploadParams.action,data:e.uploadParams.data,headers:e.uploadParams.headers,"show-upload-list":!1,"on-success":e.uploadSuccess,"on-format-error":function(){t.$alert("请上传图片文件！")},"on-exceeded-size":function(){t.$alert("请上传2MB以内的图片！")},"before-upload":e.uploadBefore,"on-progress":e.uploadProgress,multiple:1!==e.maxNum,type:"drag"}},[a("div",{style:{width:e.width-2+"px",height:e.height-2+"px","line-height":e.height-2+"px"}},[a("Icon",{attrs:{type:"images",size:parseInt(.3*e.width)}})],1),e._v(" "),a("span",{staticStyle:{"font-size":"14px",position:"absolute",bottom:"0",left:"0",color:"#999",width:"100%","text-align":"center"}},[e._v("\n      "+e._s(e.uploadList.length)+" / "+e._s(e.maxNum))])]),e._v(" "),e._l(e.uploadList,function(t,i){return a("div",{staticClass:"common-upload-list",style:{width:e.width+"px",height:e.height+"px","font-size":parseInt(.2*(e.width>e.height?e.width:e.height))+"px"}},[t.status&&"finished"!==t.status?a("div",{style:{"line-height":e.height+"px"}},[t.showProgress?a("Progress",{attrs:{percent:t.percentage,"hide-info":""}}):e._e()],1):[a("v-image",{attrs:{src:t.url,width:e.width,height:e.height}}),e._v(" "),a("div",{staticClass:"common-upload-list-cover",style:{"line-height":e.height+"px"}},[a("span",{staticClass:"icon-box",class:{readonly:e.readonly},on:{click:function(t){e.$refs.previewImage.show(e.uploadList,"url",i)}}},[a("Icon",{attrs:{type:"ios-eye-outline"}})],1),e._v(" "),a("span",{staticClass:"icon-box",on:{click:function(i){e.uploadDelete(t)}}},[e.readonly?e._e():a("Icon",{attrs:{type:"ios-trash-outline"}})],1)])]],2)}),e._v(" "),a("v-preview-image",{ref:"previewImage"})],2)},o=[];a._withStripped=!0;var s={render:a,staticRenderFns:o};e.a=s},GruV:function(t,e,i){e=t.exports=i("BkJT")(!1),e.push([t.i,".tx-order-preview-image .ivu-carousel-track{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center}",""])},H3hZ:function(t,e,i){"use strict";(function(t){e.a={name:"previewImage",props:{},data:function(){return{dataList:[],valueKey:null,index:0,imageModal:!1,windowHeight:window.innerHeight}},created:function(){},methods:{show:function(e,i,a){if(!t.isArray(e)&&!t.isString(e))throw Error("v-preview-image params error");t.isString(e)&&(e=[e]),t.isString(i)?this.valueKey=i:t.isNumber(i)&&(this.index=i),t.isNumber(a)&&(this.index=a),this.dataList=e,this.imageModal=!0}}}}).call(e,i("u47Y"))},RenH:function(t,e,i){e=t.exports=i("BkJT")(!1),e.push([t.i,"ul[data-v-04cf8748]{list-style-type:none;padding:0}li[data-v-04cf8748]{display:inline-block;margin:0 10px}a[data-v-04cf8748]{color:#42b983}",""])},UTGT:function(t,e,i){"use strict";var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"tx-container",attrs:{id:"store-decorate"}},[i("div",{staticClass:"tx-content"},[i("h2",{staticClass:"tx-title"},[t._v("门店封面图")]),t._v(" "),i("div",{staticClass:"tx-content-box"},[i("p",{staticStyle:{color:"#42aef4","margin-bottom":"10px"}},[t._v("示例图")]),t._v(" "),i("v-image",{attrs:{src:t.pics.coverUrl,width:400,height:252}}),t._v(" "),i("p",{staticStyle:{color:"#42aef4","margin-top":"20px","margin-bottom":"10px"}},[t._v("上传封面图")]),t._v(" "),i("v-upload",{ref:"coverImage",attrs:{width:240,height:180,"data-list":t.picsData.coverImage}})],1),t._v(" "),i("h2",{staticClass:"tx-title"},[t._v("门店头图")]),t._v(" "),i("div",{staticClass:"tx-content-box"},[i("p",{staticStyle:{color:"#42aef4","margin-bottom":"10px"}},[t._v("示例图")]),t._v(" "),i("v-image",{attrs:{src:t.pics.banner,width:400,height:252}}),t._v(" "),i("p",{staticStyle:{color:"#42aef4","margin-top":"20px","margin-bottom":"10px"}},[t._v("上传头图")]),t._v(" "),i("p",{staticStyle:{color:"#ccc","font-size":"12px","margin-bottom":"10px"}},[t._v("注：建议图片尺寸比例为3:4，限制为JPG PNG BMP格式")]),t._v(" "),i("v-upload",{ref:"picHeader",attrs:{"max-num":20,width:240,height:180,"data-list":t.picsData.images}})],1),t._v(" "),i("Button",{attrs:{type:"primary"},on:{click:function(e){t.saveDec()}}},[t._v("保存")])],1)])},o=[];a._withStripped=!0;var s={render:a,staticRenderFns:o};e.a=s},WIru:function(t,e,i){var a=i("GruV");"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);i("8bSs")("f61e895a",a,!1)},YSGI:function(t,e,i){t.exports=i.p+"static/img/store_banner.08d19eb.png"},ZMJk:function(t,e,i){"use strict";e.a={name:"commonImage",props:{src:{type:String},width:{type:Number,default:0},height:{type:Number,default:0},round:{type:Boolean,default:!1},icon:{type:String,default:"image"},backColor:{type:String,default:"#F4F4F4"},fill:{type:Boolean,default:!0}},data:function(){return{imgSrc:"",isComplete:!1}},mounted:function(){this.imgSrc=this.ossFilter(this.src)},watch:{src:function(t){this.imgSrc=this.ossFilter(t)}},methods:{getData:function(t){},ossFilter:function(t){var e=this;return this.$nextTick(function(){e.$refs.image.onload=function(){e.isComplete=!0}}),!t||t.indexOf("tailorx.cn")<0||!this.width&&!this.height?t:(t+=t.indexOf("?")>-1?"&":"?",t.replace("https://","//"),t.replace("http://","//"),this.isComplete=!1,t+"x-oss-process=image/resize,w_"+this.width+",h_"+this.height+(this.fill?",m_fill":""))}}}},ZOyh:function(t,e,i){e=t.exports=i("BkJT")(!1),e.push([t.i,".tx-order-common-image[data-v-44ba65cc]{text-align:center;position:relative;display:inline-block}.tx-order-common-image img[data-v-44ba65cc]{max-width:100%;max-height:100%}.tx-order-common-image i[data-v-44ba65cc],.tx-order-common-image img[data-v-44ba65cc]{position:absolute;left:50%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.tx-order-common-image i[data-v-44ba65cc]{color:#eaeaea}.tx-order-common-image.no-url[data-v-44ba65cc]{background:none!important}.tx-order-common-image.no-url i[data-v-44ba65cc]{color:#f4f4f4}.tx-order-common-image.isRound[data-v-44ba65cc],.tx-order-common-image.isRound img[data-v-44ba65cc]{border-radius:50%}",""])},Zok3:function(t,e,i){"use strict";function a(t){r||i("5H2H")}var o=i("/Vwx"),s=i("FSDW"),r=!1,n=i("/Xao"),c=a,l=n(o.a,s.a,!1,c,"data-v-20d91652",null);l.options.__file="src\\components\\common\\upload.vue",l.esModule&&Object.keys(l.esModule).some(function(t){return"default"!==t&&"__"!==t.substr(0,2)})&&console.error("named exports are not supported in *.vue files."),e.a=l.exports},qXLy:function(t,e,i){"use strict";function a(t){r||i("DFHZ")}Object.defineProperty(e,"__esModule",{value:!0});var o=i("Cod1"),s=i("UTGT"),r=!1,n=i("/Xao"),c=a,l=n(o.a,s.a,!1,c,"data-v-04cf8748",null);l.options.__file="src\\views\\store\\decorate.vue",l.esModule&&Object.keys(l.esModule).some(function(t){return"default"!==t&&"__"!==t.substr(0,2)})&&console.error("named exports are not supported in *.vue files."),e.default=l.exports},voQX:function(t,e,i){var a=i("xTDf");"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);i("8bSs")("6b2b77d2",a,!1)},xTDf:function(t,e,i){e=t.exports=i("BkJT")(!1),e.push([t.i,".tx-order-preview-image .image-carousel[data-v-7117b9f8]{position:fixed;width:100%;height:100%;top:0;left:0;z-index:9999;text-align:center;background-color:rgba(0,0,0,.7)}.tx-order-preview-image .carousel-box[data-v-7117b9f8]{max-width:800px;width:800px;position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}",""])},zQ7w:function(t,e,i){"use strict";var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"tx-order-common-image",class:{"no-url":!t.imgSrc,isRound:t.round},style:{width:0===t.width?"100%":t.width+"px",height:0===t.height?"100%":t.height+"px","background-color":t.backColor}},[t.isComplete?t._e():i("Icon",{style:{"font-size":t.width/2+"px"},attrs:{type:t.icon}}),t._v(" "),i("img",{directives:[{name:"show",rawName:"v-show",value:t.isComplete,expression:"isComplete"}],ref:"image",attrs:{src:t.imgSrc}})],1)},o=[];a._withStripped=!0;var s={render:a,staticRenderFns:o};e.a=s}});