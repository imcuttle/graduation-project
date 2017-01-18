var _class, _temp;

import React from 'react';
import { render } from 'react-dom';
import Tabs from '../components/TabNav';
import InputGroup from '../components/InputGroup';

const db = require('../common/storage');
const utils = require('../common/utils');

const _default = (_temp = _class = class _default extends React.Component {

    constructor(props) {
        super(props);
        this.getTabsProps = this.getTabsProps.bind(this);
        this.checkLogined = this.checkLogined.bind(this);
        this.clickLoginBtn = this.clickLoginBtn.bind(this);
        this.keyPressInput = this.keyPressInput.bind(this);
    }

    keyPressInput(e) {
        if (e.charCode === 13) this.clickLoginBtn();
    }
    clickLoginBtn(e) {
        const { actions, state } = this.props;
        const { admin } = state;
        const { router } = this.context;
        const { username, password, isLogined } = admin;
        actions.fetchAdminLogin(username, password);
    }

    getTabsProps() {
        const { actions, state } = this.props;
        const { upface } = state;
        const { activeSrc } = upface;

        return [{ text: '摄像头', active: activeSrc === 'camera', onClick: activeSrc !== 'camera' ? () => actions.switchUpFaceSrc('camera') : null }];
    }

    checkLogined() {
        const { actions, state } = this.props;
        const { admin } = state;
        const { router } = this.context;
        const { username, password, isLogined } = admin;
        if (isLogined) {
            router.push('/admin');
        }
    }
    componentDidUpdate() {
        this.checkLogined();
    }
    componentWillMount() {
        this.checkLogined();
    }

    render() {
        const { actions, state } = this.props;
        const { admin } = state;
        const { username, password, isLogined } = admin;

        return React.createElement(
            'div',
            { style: { backgroundColor: '#fff', padding: '16px 10px' } },
            React.createElement(
                'div',
                { style: { width: '55%', maxWidth: 520, margin: '23px auto' } },
                React.createElement(InputGroup, { showBtn: false, inputProps: { placeholder: '管理员帐号', defaultValue: username, onKeyPress: this.keyPressInput, onChange: e => actions.setAdminUser(e.target.value) } }),
                React.createElement(InputGroup, { showBtn: false, inputProps: { placeholder: '管理员密码', defaultValue: password, onKeyPress: this.keyPressInput, onChange: e => actions.setAdminPwd(e.target.value), type: 'password' } }),
                React.createElement(InputGroup, { showIpt: false, btnProps: { style: { float: 'right' }, onClick: this.clickLoginBtn }, btnText: '\u767B\u5F55' })
            )
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

    __REACT_HOT_LOADER__.register(_default, 'default', '../gp-njnu-photos-app/app/pages/AdminLoginPage.js');
}();

;