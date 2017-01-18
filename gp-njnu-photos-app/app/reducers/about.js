import {Map} from 'immutable'
var marked = require('marked');
var renderer = new marked.Renderer();

// renderer.heading = function (text, level) {
//     var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

//     return '<h' + level + '><a name="' +
//         escapedText +
//         '" class="anchor" href="#' +
//         escapedText +
//         '"><span class="header-link"></span></a>' +
//         text + '</h' + level + '>';
// }
renderer.link = (href, title, text) => `<a href=${href} target="_blank">${text}</a>`
    
renderer.listitem = function(text) {
    if (/^\s*\[[x ]\]\s*/.test(text)) {
        text = text
            .replace(/^\s*\[ \]\s*/, '<input style="vertical-align: middle;" type="checkbox" disabled/> ')
            .replace(/^\s*\[x\]\s*/, '<input style="vertical-align: middle;" type="checkbox" checked="true" disabled/> ');
        return '<li style="list-style: none">' + text + '</li>';
    } else {
        return '<li>' + text + '</li>';
    }
};
marked.setOptions({
    highlight: function (code, lang, callback) {
        require('highlight.js').highlightAuto(code).value
    },
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
});

const markdown = `
# 关于本系统

## 背景
作为本人大学本科生毕设，关于本人 => [GitHub](https://github.com/moyuyc), [Blog](https://moyuyc.github.io)

## 刷脸签到系统设计与实现

### 简介
相信有不少人有过丢失邀请函、替换或借用身份牌参会的经历。可对于部分高端会议或国家级会展活动来说，确认参会人员的身份十分关键，传统的签到模式无疑给了盗用身份参会者钻空子的机会。但是随着人脸识别技术水平的不断提升，其应用领域越来越广，效率也越来越高。使得人脸识别能够很有效的解决签到问题。

### 任务概要
本刷脸系统主要分为学生签到、管理员模块。管理员模块，可以对学生的签到信息，学生的基本信息进行增删改查；该系统核心模块：学生签到，将动态监控摄像头，一旦识别出人脸便向服务器发出请求进行人脸搜索。该系统将采用Web架构实现，前端使用react+redux+router+webpack技术栈，结构清晰，复用率高；后端将采用nodejs+express搭建服务器，C++实现核心人脸识别比对算法，通过js调用C++核心算法；后续可以使用electron将前端界面打包成跨平台app，方便师生使用。


[学习与编程记录](https://github.com/moyuyc/graduation-project/blob/master/gp-record.md)

### 开源地址
[GitHub](https://github.com/moyuyc/graduation-project)

`

export const initState={
    html: marked(markdown, {renderer})
}



export default function (state=initState, action) {
    let newState = {...state};
    const {type, ...other} = action
    switch(type) {
        default:
            return newState;
    }
}