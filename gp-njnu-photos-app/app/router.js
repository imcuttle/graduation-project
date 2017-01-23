import React from 'react'
import {routerReducer, syncHistoryWithStore, routerMiddleware} from 'react-router-redux'
import { Router, Route, IndexRoute, Redirect, IndexRedirect, browserHistory, hashHistory, useRouterHistory } from 'react-router'
import { combineReducers, createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import loggerMiddleware from 'redux-logger'
import {createHashHistory, createBrowserHistory} from 'history'

import App from './App'
import appReducers, {initState} from './reducers/appReducers'
import StuSignPage from './pages/StuSignPage'
import AudioImportPage from './pages/AudioImportPage'
import FaceImportPage from './pages/FaceImportPage'
import AdminPage from './pages/AdminPage'
import AboutPage from './pages/AboutPage'
import AdminLoginPage from './pages/AdminLoginPage'

import {isBrowser} from './common/utils'

export const configureStore = (initialState, middleware) => {
    let store = createStore(
        appReducers, initialState,
        applyMiddleware(
            // reduxRouterMiddleware,
            thunkMiddleware, // 允许我们 dispatch() 函数
            // loggerMiddleware // 一个很便捷的 middleware，用来打印 action 日志
        )
    );
    /*
    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./reducers/appReducers', () => {
            const nextRootReducer = require('./reducers/appReducers');
            store.replaceReducer(nextRootReducer);
        });
    }*/

    return store;
}

var _initState = isBrowser && window.__INITIAL_STATE__ || initState

const store = configureStore(
    _initState
)

const history = browserHistory; 

export default (
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App} >
                <IndexRoute component={StuSignPage} title="学生签到"/>
                <Route path="about" component={AboutPage} title="关于该系统" />
                <Route path="admin" component={AdminPage} title="管理员界面" />
                <Route path="admin/login" component={AdminLoginPage} title="管理员登录" />
                <Route path="audio-import" component={AudioImportPage}  />
                <Route path="face-import" component={FaceImportPage} title="人脸录入" />
                <Route path="*" onEnter={(loc, replace) => replace('/')} />
            </Route>
        </Router>
    </Provider>
)
