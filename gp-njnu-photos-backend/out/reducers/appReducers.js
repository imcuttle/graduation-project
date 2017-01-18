import { routerReducer, syncHistoryWithStore } from 'react-router-redux';
import { combineReducers, createStore, applyMiddleware } from 'redux';

import active from './active';
import upface from './upFace';
import base from './base';

import audioImport from './audioImport';
import faceImport from './faceImport';
import admin from './admin';
import about from './about';

export const initState = {
    base: require('./base').initState,
    active: require('./active').initState,
    upface: require('./upFace').initState,
    audioImport: require('./audioImport').initState,
    faceImport: require('./faceImport').initState,
    admin: require('./admin').initState,
    about: require('./admin').initState
};

const _default = combineReducers({
    routing: routerReducer,
    active,
    about,
    upface,
    base,
    audioImport,
    faceImport,
    admin
});

export default _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(initState, 'initState', '../gp-njnu-photos-app/app/reducers/appReducers.js');

    __REACT_HOT_LOADER__.register(_default, 'default', '../gp-njnu-photos-app/app/reducers/appReducers.js');
}();

;