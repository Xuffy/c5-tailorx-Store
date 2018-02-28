//
//  config.js
//  调试路径
//
//  Created by YSD on 2017-02-07.
//  Copyright 2017 YSD. All rights reserved.
//

//本地环境
/*var headUrl = {
 headIp: "http://192.168.11.215:",
 headPort: "30704",
 headUrl: "http://192.168.11.215:30704"
 }*/
//pangzi
/*var headUrl = {
 headIp:"http://192.168.51.86:",
 headPort:"30704",
 headUrl:"http://192.168.51.86:30704"
 }*/
//caikunxiang
/*var headUrl = {
 headIp:"http://192.168.11.215:",
 headPort:"30704",
 headUrl:"http://192.168.11.215:30704"
 }*/
/*var headUrl = {
 headIp:"http://192.168.11.233:",
 headPort:"30704",
 headUrl:"http://192.168.11.233:30704"
 }*/
//测试环境
/*var headUrl = {
 headIp: "http://store.test.tailorx.cn/api",
 headPort: "",
 headUrl: "http://store.test.tailorx.cn/api"
 };*/
//正式环境
/*var headUrl = {
 headIp: "https://store.tailorx.cn/api",
 headPort: "",
 headUrl: "https://store.tailorx.cn/api"
 };*/
//开发环境
/*var headUrl = {
 headIp:"https://store.dev.tailorx.cn/api",
 headPort:"",
 headUrl:"https://store.dev.tailorx.cn/api"
 };*/

var headUrl = {
  headIp: window.parent.TxConfig.ENV.api,
  headPort: "",
  headUrl: window.parent.TxConfig.ENV.api
};

