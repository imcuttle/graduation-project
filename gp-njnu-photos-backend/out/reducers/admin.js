var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { Map, List } from 'immutable';
const db = require('../common/storage');

export const initState = {

    username: db.sGet('admin_user') || '',
    password: db.sGet('admin_pwd') || '',
    isLogined: Boolean(db.sGet('admin_islogined')) || false,
    src: 'faceImport',
    faceImport: {
        id: '',
        photos: []
    },
    stuInfo: {}
};

const updateState = (state, key, subKey, newVal) => {
    let newState = Map(state);
    if (subKey === '*') return newState.set(key, Object.assign({}, newState.get(key), newVal)).toObject();
    return newState.set(key, Map(newState.get(key)).set(subKey, newVal).toObject()).toObject();
};

const rmList = (list, keyname, keyval) => {
    let newList = List(list);
    let i = newList.findIndex(x => x[keyname] === keyval);
    return i >= 0 ? newList.remove(i).toArray() : newList.toArray();
};

const _default = function (state = initState, action) {
    let newState = _extends({}, state);
    const { type } = action;

    const other = _objectWithoutProperties(action, ['type']);

    switch (type) {
        case 'SET_ADMIN_USER':
            db.sSet('admin_user', action.username);
            return _extends({}, newState, { username: action.username });
        case 'SET_ADMIN_PWD':
            db.sSet('admin_pwd', action.password);
            return _extends({}, newState, { password: action.password });
        case 'SET_ADMIN_ISLOGIN':
            db.sSet('admin_islogined', action.isLogined ? '1' : '0');
            return _extends({}, newState, { isLogined: action.isLogined });
        case 'SET_ADMIN_SRC':
            return _extends({}, newState, { src: action.src });
        case 'SET_ADMIN_FACEIN_ID':
            return updateState(state, 'faceImport', 'id', action.id);
        case 'SET_ADMIN_FACEIN_PHOTOS':
            return updateState(state, 'faceImport', 'photos', action.photos);
        case 'DEL_ADMIN_FACEIN_PHOTO':
            newState.faceImport.photos = rmList(newState.faceImport.photos, 'key', action.key);
            return newState;
        case 'SET_ADMIN_STUINFO':
            return _extends({}, newState, { stuInfo: _extends({}, newState.stuInfo, action.info) });
        case 'SET_ADMIN_STUINFO_ID':
            return updateState(state, 'stuInfo', 'id', action.id);
        default:
            return newState;
    }
};

export default _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(initState, 'initState', '../gp-njnu-photos-app/app/reducers/admin.js');

    __REACT_HOT_LOADER__.register(updateState, 'updateState', '../gp-njnu-photos-app/app/reducers/admin.js');

    __REACT_HOT_LOADER__.register(rmList, 'rmList', '../gp-njnu-photos-app/app/reducers/admin.js');

    __REACT_HOT_LOADER__.register(_default, 'default', '../gp-njnu-photos-app/app/reducers/admin.js');
}();

;