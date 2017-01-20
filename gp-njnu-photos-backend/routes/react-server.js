const reactServer = require('express')();
const path = require('path');
const fs = require('fs');
const url = require('url');

import React from 'react';
import {renderToString} from 'react-dom/server'
import createMemoryHistory from 'history/createMemoryHistory'
import reactRouter, {match, RouterContext} from 'react-router'
import {Provider} from 'react-redux'

import {pushRoute, adminLogined, checkAdminLogined} from '../../gp-njnu-photos-app/app/reducers/actions'
import MyRouter, {configureStore} from '../../gp-njnu-photos-app/app/router'
const fePath = path.resolve(__dirname, '..', '..', 'gp-njnu-photos-app', 'build');
reactServer.use(handleRender)

// This is fired every time the server side receives a request

function handleRender(req, res, next) {
    // console.log(req.url, req.originalUrl);
    match({ routes: MyRouter, location: req.url }, function(error, redirectLocation, renderProps) {
        if (error) {
            res.status(500).send(error.stack);
        } else if (redirectLocation) {
            if(req.url.startsWith('/api') || fs.existsSync(path.join(fePath, url.parse(req.url).pathname)) ) {
                next();
            } else {
                res.redirect(302, redirectLocation.pathname + redirectLocation.search);
            }
        } else if (renderProps) {
            // var history = createMemoryHistory();
            var store = configureStore();
            // console.log(renderProps, store);
            // we can invoke some async operation(eg. fetchAction or getDataFromDatabase)
            // call store.dispatch(Action(data)) to update state.
            store.dispatch(pushRoute(req.url))
            //const data = await store.dispatch(checkAdminLogined( req.headers ))
            const html = renderToString(
                <Provider store={store}>
                    <RouterContext {...renderProps} />
                </Provider>
            );
            res.header('content-type', 'text/html; charset=utf-8')
            res.send(renderFullPage('南师大刷脸签到系统', html, store.getState()))
        } else {
            res.status(404).send('Not found')
        }
    })
}
const htmlPath = path.join(fePath, 'index.html');
var html = fs.readFileSync(htmlPath).toString();
fs.watch(htmlPath, () => {
    console.log('html changed')
    html = fs.readFileSync(htmlPath).toString();
})


function renderFullPage(title, partHtml, initialState) {
    // <!--HTML-->
    var allHtml = html;
    if(initialState) {
        allHtml = allHtml.replace(/\/\*\s*?INITIAL_STATE\s*?\*\//, `window.__INITIAL_STATE__=${JSON.stringify(initialState)}`)
    }
    if(title) {
        allHtml = allHtml.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
    }
    return allHtml.replace(/<!--\s*?HTML\s*?-->/, partHtml);

}

module.exports = reactServer
