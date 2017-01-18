import React from 'react';
import { render } from 'react-dom';
import Tabs from '../components/TabNav';
import InputGroup from '../components/InputGroup';
import TakePhoto from '../components/TakePhoto';
import Information from '../components/Information';

const db = require('../common/storage');
const utils = require('../common/utils');

const _default = class extends React.Component {

    constructor(props) {
        super(props);
        this.getTabsProps = this.getTabsProps.bind(this);
        this.inputBlur = this.inputBlur.bind(this);
    }

    getTabsProps() {
        const { actions, state } = this.props;
        const { upface, audioImport } = state;
        const { activeSrc } = audioImport;
        return [{ text: '话筒导入', active: activeSrc === 'audio', onClick: activeSrc !== 'audio' ? () => actions.setAudioSrc('audio') : null }, { text: '文件导入', active: activeSrc === 'file', onClick: activeSrc !== 'file' ? () => actions.setAudioSrc('file') : null }];
    }

    inputBlur(e) {
        const { actions, state } = this.props;
        const { id: eId, pwd: ePwd } = this;
        const { upface, audioImport } = state;
        const { activeSrc, pwd, id, importing, audio, file, stuInfo } = audioImport;

        setTimeout(() => {
            const activeElement = document.activeElement; // without timeout, = body
            if (!!id.trim() && !!pwd.trim() && activeElement !== eId && activeElement !== ePwd) {
                actions.fetchStuInfo(id.trim(), pwd.trim(), actions.setAudioStuInfo);
            }
        }, 100);
    }

    getInformationProps(info = {}) {
        return {
            img: info.img,
            keys: ["姓名", "班级", "学院"],
            vals: [info.name, info.classNo, info.department]
        };
    }

    render() {
        const { actions, state } = this.props;
        const { upface, audioImport } = state;
        const { activeSrc, pwd, id, importing, audio, file, stuInfo } = audioImport;
        // console.log(audioImport)
        return React.createElement(
            'div',
            { style: { backgroundColor: '#fff', padding: '16px 10px' } },
            React.createElement(
                'div',
                { className: 'animated pulse', style: { display: 'flex', marginTop: 20, justifyContent: 'center' } },
                React.createElement(
                    'div',
                    { style: { display: 'inline-block', width: '31%', padding: 12, boxSizing: 'border-box' } },
                    React.createElement(InputGroup, { ref: r => {
                            if (r) this.id = r.input;
                        }, showBtn: false, inputProps: {
                            placeholder: '学号', value: id,
                            onChange: e => {
                                actions.setAudioId(e.target.value);
                            },
                            onBlur: this.inputBlur
                        } })
                ),
                React.createElement(
                    'div',
                    { style: { display: 'inline-block', width: '31%', padding: 12, boxSizing: 'border-box' } },
                    React.createElement(InputGroup, { ref: r => {
                            if (r) this.pwd = r.input;
                        }, showBtn: false, inputProps: {
                            placeholder: '密码(教务系统)', value: pwd, type: 'password',
                            onChange: e => {
                                actions.setAudioPwd(e.target.value);
                            },
                            onBlur: this.inputBlur
                        } })
                ),
                React.createElement(
                    'div',
                    { style: { display: 'inline-block', boxSizing: 'border-box', padding: 12 } },
                    React.createElement(InputGroup, { showIpt: false, btnText: '\u5F55\u5165', btnProps: {} })
                )
            ),
            React.createElement(
                'div',
                { className: 'animated fadeIn', style: { width: '53%', margin: '10px auto 10px', display: Object.getOwnPropertyNames(stuInfo).length ? '' : 'none' } },
                React.createElement(Information, this.getInformationProps(stuInfo))
            ),
            React.createElement(Tabs, { items: this.getTabsProps() }),
            React.createElement(
                'div',
                { style: { minHeight: 400, margin: '30px auto auto auto', textAlign: 'center' } },
                activeSrc === 'audio' && React.createElement(InputGroup, null),
                activeSrc === 'file' && React.createElement(InputGroup, null)
            ),
            React.createElement('hr', null)
        );
    }
};

export default _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(_default, 'default', '../gp-njnu-photos-app/app/pages/AudioImportPage.js');
}();

;