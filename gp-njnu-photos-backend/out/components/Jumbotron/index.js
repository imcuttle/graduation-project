import React from 'react';
import { Map } from 'immutable';
import css from './style.less';

const _default = ({ title = "titles", bg = "", subtitle = "subtitle" }) => React.createElement(
    'div',
    { className: css.container },
    React.createElement('figure', { style: bg ? { backgroundImage: `url(${ bg })` } : {}, className: css.main }),
    React.createElement(
        'div',
        { style: { position: 'relative', zIndex: 2 } },
        React.createElement(
            'h1',
            { className: css.title },
            title
        ),
        React.createElement(
            'p',
            { className: css.subtitle },
            subtitle
        )
    )
);

export default _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(_default, 'default', '../gp-njnu-photos-app/app/components/Jumbotron/index.js');
}();

;