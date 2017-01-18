var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { Map } from 'immutable';

export const initState = {
    toast: {
        text: '欢迎来到学生签到系统',
        show: false,
        tp: 'success'
    },
    modal: {
        title: '',
        size: 'sm',
        content: ' ',
        show: false,
        onCancel: null,
        onOk: null
    },
    loading: false,
    loadingText: ''
};

const _default = function (state = initState, action) {
    let newState = _extends({}, state);
    const { type } = action;

    const other = _objectWithoutProperties(action, ['type']);

    switch (type) {
        case 'SHOW_TOAST':
            return _extends({}, newState, { toast: _extends({}, other, { show: true }) });
        case 'HIDE_TOAST':
            return _extends({}, newState, { toast: Object.assign({}, newState.toast, { show: false }) });
        case 'SHOW_MODAL':
            return _extends({}, newState, { modal: _extends({}, other, { show: true }) });
        case 'HIDE_MODAL':
            return _extends({}, newState, { modal: Object.assign({}, newState.modal, { show: false }) });
        case 'SET_LOADING':
            return _extends({}, newState, { loading: action.loading, loadingText: action.loadingText });
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

    __REACT_HOT_LOADER__.register(initState, 'initState', '../gp-njnu-photos-app/app/reducers/base.js');

    __REACT_HOT_LOADER__.register(_default, 'default', '../gp-njnu-photos-app/app/reducers/base.js');
}();

;