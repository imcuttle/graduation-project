import React from 'react'
import {render} from 'react-dom'
import { combineReducers, createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import {routerReducer, syncHistoryWithStore} from 'react-router-redux'
import { Router, Route, IndexRoute, Redirect, IndexRedirect, browserHistory, hashHistory, useRouterHistory } from 'react-router'
import thunkMiddleware from 'redux-thunk'
import loggerMiddleware from 'redux-logger'
import {createHashHistory} from 'history'

import './common/css/base.less'
import appReducers from './reducers/appReducers'
import App from './App'
import StuSignPage from './pages/StuSignPage'


function configureStore(rootReducer, initialState) {
    let store = createStore(rootReducer, initialState);

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./reducers/appReducers', () => {
            const nextRootReducer = require('./reducers/appReducers');
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}



const store = createStore(
    appReducers,
    applyMiddleware(
        thunkMiddleware, // 允许我们 dispatch() 函数
        // loggerMiddleware // 一个很便捷的 middleware，用来打印 action 日志
    )
)
const appHashHistory = useRouterHistory(createHashHistory)({ queryKey: false })
// ?? appHashHistory 不能渲染
// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(hashHistory, store)

render((
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute component={StuSignPage}/>
                <Route path="about" />
                <Route path="*" onEnter={(loc, replace) => replace('/')} />
            </Route>
        </Router>
    </Provider>
), document.getElementById('app'))