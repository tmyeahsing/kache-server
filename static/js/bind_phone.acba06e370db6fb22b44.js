!function(e){function t(i){if(o[i])return o[i].exports;var s=o[i]={exports:{},id:i,loaded:!1};return e[i].call(s.exports,s,s.exports,t),s.loaded=!0,s.exports}var o={};return t.m=e,t.c=o,t.p="/static/",t(0)}({0:function(e,t,o){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}var s=o(78),n=i(s);o(1),new Vue({el:"body",components:{Hello:n["default"]},data:{phone:"",code:""},methods:{sendMsg:function(){},validateCode:function(){AV.Cloud.verifySmsCode(this.code,this.phone).then(function(e){console.log("success"),console.log(e)},function(e){console.log(e)})}}})},1:function(e,t){},41:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t["default"]={props:{show:{type:Boolean,required:!0,twoWay:!0},menus:{type:Object,required:!1,"default":function(){return{}}},actions:{type:Object,required:!1,"default":function(){return{}}}},methods:{dispatchEvent:function(e,t){switch(this.$dispatch(e,t),e){case"weui-menu-click":console.log(t);break;case"weui-action-click":this.hideActionSheet()}},hideActionSheet:function(){this.show=!1}}}},77:function(e,t){e.exports=' <div class=actionsheet_wrap> <div class=weui_mask_transition :class="{\'weui_fade_toggle\': show}" :style="{display: show ? \'block\' : \'none\'}" @click=hideActionSheet></div> <div class=weui_actionsheet :class="{\'weui_actionsheet_toggle\': show}"> <div class=weui_actionsheet_menu> <div class=weui_actionsheet_cell v-for="(key, text) in menus" @click="dispatchEvent(\'weui-menu-click\', key)"> {{{text}}} </div> </div> <div class=weui_actionsheet_action> <div class=weui_actionsheet_cell v-for="(key, text) in actions" @click="dispatchEvent(\'weui-action-click\', key)"> {{{text}}} </div> </div> </div> </div> '},78:function(e,t,o){var i,s;i=o(41),s=o(77),e.exports=i||{},e.exports.__esModule&&(e.exports=e.exports["default"]),s&&(("function"==typeof e.exports?e.exports.options||(e.exports.options={}):e.exports).template=s)}});