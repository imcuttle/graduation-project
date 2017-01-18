function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { Map, List } from 'immutable';
const db = require('../common/storage');

export const initState = {
    activeSrc: 'camera',
    id: db.get('faceimport_id') || '',
    pwd: '',
    importing: false,
    camera: {
        data: ''
    },
    file: {
        data: ''
    },
    stuInfo: {},
    faces: []
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
    let newState = Map(state);
    const { type } = action;

    const other = _objectWithoutProperties(action, ['type']);

    switch (type) {
        case 'SWITCH_FACE_IN_SRC':
            return newState.set('activeSrc', action.src).toObject();
        case 'SET_FACE_IN_ID':
            db.set('faceimport_id', action.id);
            return newState.set('id', action.id).toObject();
        case 'SET_FACE_IN_PWD':
            return newState.set('pwd', action.pwd).toObject();
        case 'SET_FACE_IN_IMPORTING':
            return newState.set('importing', action.importing).toObject();
        case 'SET_FACE_IN_CAMERA_DATA':
            return updateState(state, 'camera', 'data', action.data);
        case 'SET_FACE_IN_FILE_DATA':
            return updateState(state, 'file', 'data', action.data);
        case 'SET_FACE_IN_STUINFO':
            return updateState(state, 'stuInfo', '*', other);
        case 'CLEAR_FACE_IN_STUINFO':
            return newState.set('stuInfo', {}).toObject();
        case 'SET_FACE_IN_FACES':
            return newState.set('faces', action.faces).toObject();
        case 'APP_FACE_IN_FACE':
            return newState.set('faces', newState.get('faces').concat(action.face)).toObject();
        case 'DEL_FACE_IN_FACE':
            return newState.set('faces', rmList(state.faces, 'hash', action.hash)).toObject();
        default:
            return newState.toObject();
    }
};

export default _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(initState, 'initState', '../gp-njnu-photos-app/app/reducers/faceImport.js');

    __REACT_HOT_LOADER__.register(updateState, 'updateState', '../gp-njnu-photos-app/app/reducers/faceImport.js');

    __REACT_HOT_LOADER__.register(rmList, 'rmList', '../gp-njnu-photos-app/app/reducers/faceImport.js');

    __REACT_HOT_LOADER__.register(_default, 'default', '../gp-njnu-photos-app/app/reducers/faceImport.js');
}();

;