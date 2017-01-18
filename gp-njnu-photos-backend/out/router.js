import React from 'react';
import { routerReducer, syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import { Router, Route, IndexRoute, Redirect, IndexRedirect, browserHistory, hashHistory, useRouterHistory } from 'react-router';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import { createHashHistory, createBrowserHistory } from 'history';

import App from './App';
import appReducers, { initState } from './reducers/appReducers';
import StuSignPage from './pages/StuSignPage';
import AudioImportPage from './pages/AudioImportPage';
import FaceImportPage from './pages/FaceImportPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';
import AdminLoginPage from './pages/AdminLoginPage';

export const configureStore = (rootReducer, initialState, middleware) => {
    let store = createStore(rootReducer, initialState, middleware);
    /*
    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./reducers/appReducers', () => {
            const nextRootReducer = require('./reducers/appReducers');
            store.replaceReducer(nextRootReducer);
        });
    }*/

    return store;
};

var _initState = window.__INIT_STATE__ || initState;

const store = configureStore(appReducers, _initState, applyMiddleware(
// reduxRouterMiddleware,
thunkMiddleware));

const history = syncHistoryWithStore(browserHistory, store);

const _default = React.createElement(
    Provider,
    { store: store },
    React.createElement(
        Router,
        { history: history },
        React.createElement(
            Route,
            { path: '/', component: App },
            React.createElement(IndexRoute, { component: StuSignPage }),
            React.createElement(Route, { path: 'about', component: AboutPage }),
            React.createElement(Route, { path: 'admin', component: AdminPage }),
            React.createElement(Route, { path: 'admin/login', component: AdminLoginPage }),
            React.createElement(Route, { path: 'audio-import', component: AudioImportPage }),
            React.createElement(Route, { path: 'face-import', component: FaceImportPage }),
            React.createElement(Route, { path: '*', onEnter: (loc, replace) => replace('/') })
        )
    )
);

export default _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(configureStore, 'configureStore', '../gp-njnu-photos-app/app/router.js');

    __REACT_HOT_LOADER__.register(_initState, '_initState', '../gp-njnu-photos-app/app/router.js');

    __REACT_HOT_LOADER__.register(store, 'store', '../gp-njnu-photos-app/app/router.js');

    __REACT_HOT_LOADER__.register(history, 'history', '../gp-njnu-photos-app/app/router.js');

    __REACT_HOT_LOADER__.register(_default, 'default', '../gp-njnu-photos-app/app/router.js');
}();

;