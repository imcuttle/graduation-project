import { Map, List } from 'immutable';
const db = require('../common/storage');

export const initState = {
    activeSrc: 'camera',
    searchText: db.get('search_text') || '',
    searching: false,
    camera: {
        data: ''
    },
    file: {
        data: ''
    },
    network: {
        url: ''
    },
    isStart: false,
    signId: ''
};

const updateState = (state, key, subKey, newVal) => {
    let newState = Map(state);
    return newState.set(key, Map(newState.get(key)).set(subKey, newVal).toObject()).toObject();
};

const _default = function (state = initState, action) {
    let newState = Map(state);
    switch (action.type) {
        case 'SWITCH_UPFACE_SRC':
            return newState.set('activeSrc', action.src).toObject();
        case 'CHANGE_SEARCHTEXT':
            db.set('search_text', action.text);
            return newState.set('searchText', action.text).toObject();
        case 'SET_UPFACE_START':
            return newState.set('isStart', action.isStart).toObject();
        case 'SET_CAMERA_DATA':
            return updateState(state, 'camera', 'data', action.data);
        case 'SET_FILE_DATA':
            return updateState(state, 'file', 'data', action.data);
        case 'SET_NET_URL':
            return updateState(state, 'network', 'url', action.url);
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

    __REACT_HOT_LOADER__.register(initState, 'initState', '../gp-njnu-photos-app/app/reducers/upFace.js');

    __REACT_HOT_LOADER__.register(updateState, 'updateState', '../gp-njnu-photos-app/app/reducers/upFace.js');

    __REACT_HOT_LOADER__.register(_default, 'default', '../gp-njnu-photos-app/app/reducers/upFace.js');
}();

;