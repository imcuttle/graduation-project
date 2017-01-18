import React from 'react';
import { Map } from 'immutable';
import css from './style.less';

const renderItem = (item, i) => {
    if (item.sublist) {
        return React.createElement(
            'li',
            { className: `${ css.dropdown } ${ item.active ? css.active : '' }`, key: i },
            React.createElement(
                'span',
                null,
                React.createElement(
                    'span',
                    null,
                    item.text
                ),
                React.createElement('i', { className: css.icon })
            ),
            React.createElement(
                'ul',
                null,
                item.sublist.map((item, i) => React.createElement(
                    'li',
                    { key: i, onClick: item.onClick },
                    React.createElement(
                        'span',
                        null,
                        item.text
                    )
                ))
            )
        );
    }
    if (item.type === 'btn') {
        return React.createElement(
            'li',
            { key: i },
            React.createElement(
                'span',
                { onClick: item.onClick, className: css.btn },
                item.text
            )
        );
    }
    return React.createElement(
        'li',
        { key: i, className: `${ item.active ? css.active : '' }`, onClick: item.onClick },
        React.createElement(
            'span',
            null,
            item.text
        )
    );
};

const _default = ({ showLogo = true, logo = "", leftItems = [{ text: '学生签到', active: true }, { text: '关于' }],
    rightItems = [{ text: '关于' }, { text: '管理员入口', type: 'btn' }] }) => React.createElement(
    'header',
    { className: css.main },
    showLogo && React.createElement(
        'span',
        { className: css.logo },
        logo
    ),
    React.createElement(
        'ul',
        { className: css.left },
        leftItems.map(renderItem)
    ),
    React.createElement(
        'ul',
        { className: css.right },
        rightItems.map(renderItem)
    )
);

export default _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(renderItem, 'renderItem', '../gp-njnu-photos-app/app/components/Header/index.js');

    __REACT_HOT_LOADER__.register(_default, 'default', '../gp-njnu-photos-app/app/components/Header/index.js');
}();

;