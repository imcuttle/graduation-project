const reactServer = require('express')();
const path = require('path');
const fs = require('fs');

import React from 'react';
import {renderToString} from 'react-dom/server'
import createMemoryHistory from 'history/createMemoryHistory'
import reactRouter, {match, RouterContext} from 'react-router'
// import {Provider} = from 'react-redux'


import MyRouter, {configureStore} from '../../gp-njnu-photos-app/app/router'


// This is fired every time the server side receives a request

function handleRender(req, res) {
    var history = createMemoryHistory()
    var store = configureStore(undefined, history)

    match({ routes: routes, location: req.url }, function(error, redirectLocation, renderProps) {
        if (error) {
            res.status(500).send(error.stack)
        } else if (redirectLocation) {
            res.redirect(302, redirectLocation.pathname + redirectLocation.search)
        } else if (renderProps) {
            var initialState
            var reactHtml
            var Router = React.createElement(RouterContext, renderProps)
            var RouterWrapper = React.createElement('div', {}, Router)
            models.loadMustData(req.url)
                .then(function(data) {
                    console.log(req.url)
                    var s = store.getState()
                    s.routing.location.pathname = req.url

                    store.dispatch(loadMustDataAction(data))
                    initialState = store.getState()

                    var Root = React.createElement(Provider, {store: store}, RouterWrapper)
                    reactHtml = renderToString(Root)

                    // 把渲染后的页面内容发送给客户端
                    res.send(renderFullPage(GLOBAL.blog.title, reactHtml, initialState))
                })
                .catch(function(error) {
                    if (error) {
                        console.log('error stack:', error.stack)
                        var title = 'error'
                        reactHtml = 'error: this page has error, click this return to <a href="/">home page</a>'
                        res.send(renderFullPage(title, reactHtml))
                    }
                })

        }
        else {
            res.status(404).send('Not found')
        }
    })
}

const htmlPath = path.resolve(__dirname, '..', '..', 'gp-njnu-photos-app', 'build', 'index.html')
const html = fs.readFileSync(htmlPath).toString();

function renderFullPage(title, html, initialState) {
    ///*INITIAL_STATE*/
    // <!--HTML-->
    return html.replace(/\/\*\s*?INITIAL_STATE\s*?\*\//, `window.__INIT_SATATE="${JSON.stringify(initialState)}"`)
        .replace(/<!--\s*?HTML\s*?-->/, html)
        .replace(/<!--\s*?TITLE\s*?-->/, title)
}

module.exports = reactServer
