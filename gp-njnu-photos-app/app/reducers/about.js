import {Map} from 'immutable'
// import fetch from 'isomorphic-fetch';

var realMarked = require('marked');
var highlight = require('highlight.js')
var renderer = new realMarked.Renderer();
export const mdtextUrl = "https://raw.githubusercontent.com/moyuyc/blogsource/master/source/_articles/njnu-stuents-faces-recognition.md";

renderer.heading = function (text, level) {
    var escapedText = text; //.toLowerCase().replace(/[^\w]+/g, '-');

    return '<h' + level + '><a name="' +
        escapedText +
        '" class="anchor" href="#' +
        escapedText +
        '"><span class="header-link"></span></a>' +
        text + '</h' + level + '>';
}
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
realMarked.setOptions({
    highlight: function (code, lang, callback) {
        highlight.highlightAuto(code).value
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
<center>加载中...</center>
<div style="height: 200px;"></div>
`
export const marked = (md) => realMarked(md, {renderer})


export const initState={
    isRemote: false,
    html: realMarked(markdown, {renderer})
}



export default function (state=initState, action) {
    let newState = {...state};
    const {type, ...other} = action
    switch(type) {
        case 'SET_ABOUT_HTML':
            return {...newState, html: action.html}
        case 'SET_ABOUT_ISREMOTE':
            return {...newState, isRemote: action.isRemote}
        default:
            return newState;
    }
}