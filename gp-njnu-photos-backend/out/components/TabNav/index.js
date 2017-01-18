import React from 'react';
import { Map } from 'immutable';
import classname from 'classname';
import css from './style.less';

const _default = ({ items = [] }) => React.createElement(
    'ul',
    { className: css.main },
    items.map((item, i) => React.createElement(
        'li',
        { className: css.item + " " + (item.active ? css.active : ''), key: i },
        React.createElement(
            'span',
            { onClick: item.onClick },
            item.text
        )
    ))
);

export default _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(_default, 'default', '../gp-njnu-photos-app/app/components/TabNav/index.js');
}();

;