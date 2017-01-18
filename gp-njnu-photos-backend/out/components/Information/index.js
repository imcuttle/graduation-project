import React from 'react';
import { Map } from 'immutable';
import css from './style.less';

const _default = ({ img = "", keys = [], vals = [] }) => React.createElement(
    'div',
    { className: css.main },
    !!img && React.createElement(
        'div',
        { className: css.img },
        React.createElement('img', { src: img })
    ),
    React.createElement(
        'ul',
        { className: css.info + ' ' + (!img ? css.noimg : '') },
        keys.map((k, i) => React.createElement(
            'li',
            { key: i },
            React.createElement(
                'span',
                { className: css.left },
                k
            ),
            React.createElement(
                'span',
                { className: css.right },
                vals[i]
            )
        ))
    )
);

export default _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(_default, 'default', '../gp-njnu-photos-app/app/components/Information/index.js');
}();

;