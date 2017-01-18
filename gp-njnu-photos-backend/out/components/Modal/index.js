import React from 'react';
import { Map } from 'immutable';
import css from './style.less';

//http://v3.bootcss.com/javascript/#modals

const _default = ({ title = "modal", content = "content", show = false, onCancel, onOk, size = "sm" }) => React.createElement(
    'div',
    { className: css.main, style: { display: !show ? 'none' : 'block' } },
    React.createElement('div', { className: css.backdrop }),
    React.createElement(
        'div',
        { className: css.dialog + " animated fadeIn", style: { animationDuration: '300ms', width: size === 'sm' ? 400 : 680 } },
        React.createElement(
            'div',
            { className: css.content },
            React.createElement(
                'div',
                { className: css.header },
                React.createElement(
                    'span',
                    { onClick: onCancel, className: css.close },
                    React.createElement(
                        'span',
                        { 'aria-hidden': 'true' },
                        '\xD7'
                    )
                ),
                React.createElement(
                    'h4',
                    { className: css.title },
                    title
                )
            ),
            React.createElement(
                'div',
                { className: css.body },
                content
            ),
            React.createElement(
                'div',
                { className: css.footer },
                React.createElement(
                    'button',
                    { className: css.default, onClick: onCancel },
                    '\u53D6\u6D88'
                ),
                React.createElement(
                    'button',
                    { className: css.primary, onClick: onOk },
                    '\u786E\u5B9A'
                )
            )
        )
    )
);

export default _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(_default, 'default', '../gp-njnu-photos-app/app/components/Modal/index.js');
}();

;