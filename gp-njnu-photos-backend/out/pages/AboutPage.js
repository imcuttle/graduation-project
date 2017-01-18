var _class, _temp;

import React from 'react';
import { render } from 'react-dom';
import Tabs from '../components/TabNav';
import InputGroup from '../components/InputGroup';
import TabNav from '../components/TabNav';
import PhotosFall from '../components/PhotosFall';
import Information from '../components/Information';

const db = require('../common/storage');
const utils = require('../common/utils');

const _default = (_temp = _class = class _default extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {
        const { actions, state } = this.props;
        const { about } = state;
        const { html } = about;
        return React.createElement(
            'div',
            { style: { backgroundColor: '#fff', padding: '16px 10px' } },
            React.createElement('div', { style: { padding: '20px 34px' }, className: 'markdown-body animated fadeIn', dangerouslySetInnerHTML: { __html: html } })
        );
    }
}, _class.contextTypes = {
    router: React.PropTypes.object.isRequired
}, _temp);

export default _default;
;

var _temp2 = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(_default, 'default', '../gp-njnu-photos-app/app/pages/AboutPage.js');
}();

;