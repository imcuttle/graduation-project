import React from 'react';
import { Map } from 'immutable';
import css from './style.less';

const _default = ({ text = "toast", tp = "success", show = false }) => React.createElement(
    'div',
    { className: `${ css.main } ${ css[tp] } ${ show ? css.active : '' }` },
    text
);

export default _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(_default, 'default', '../gp-njnu-photos-app/app/components/Toast/index.js');
}();

;