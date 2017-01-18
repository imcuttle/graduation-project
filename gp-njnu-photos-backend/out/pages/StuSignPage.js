import React from 'react';
import { render } from 'react-dom';
import Tabs from '../components/TabNav';
import InputGroup from '../components/InputGroup';
import TakePhoto from '../components/TakePhoto';
import FaceRec from '../components/FaceRec';

const db = require('../common/storage');
const utils = require('../common/utils');

const _default = class extends React.Component {

    constructor(props) {
        super(props);
        this.getTabsProps = this.getTabsProps.bind(this);
    }
    getTabsProps() {
        const { actions, state } = this.props;
        const { upface } = state;
        const { activeSrc } = upface;

        return [{ text: '摄像头', active: activeSrc === 'camera', onClick: activeSrc !== 'camera' ? () => actions.switchUpFaceSrc('camera') : null }];
    }

    render() {
        const { actions, state } = this.props;
        const { upface } = state;
        const { activeSrc, searchText, searching, camera, file, network, signId, isStart } = upface;
        const { data } = camera;
        const { data: fData } = file;
        const { url } = network;

        console.log(state);
        return React.createElement(
            'div',
            { style: { backgroundColor: '#fff', padding: '16px 10px' } },
            React.createElement(Tabs, { items: this.getTabsProps() }),
            React.createElement(
                'div',
                { style: { minHeight: 520, overflowX: 'hidden' } },
                activeSrc === 'camera' && React.createElement(
                    'div',
                    { className: 'animated fadeInLeft' },
                    React.createElement(FaceRec, { onDataCallback: data => {
                            isStart && actions.fetchStuPredict(searchText, data);
                        }, data: data })
                ),
                activeSrc === 'file' && React.createElement(
                    'div',
                    { className: 'animated fadeInDown', style: { width: 500, textAlign: 'center', margin: '30px auto auto' } },
                    React.createElement(InputGroup, { ref: r => this.file = r, btnText: '\u4E0A\u4F20\u56FE\u7247',
                        btnProps: {
                            disabled: !isStart || !fData,
                            onClick: () => {
                                // const {input, btn} = this.file
                                // input.click()
                                isStart && actions.fetchStuPredict(searchText, fData);
                            }
                        },
                        inputProps: {
                            disabled: false, accept: "image/*", style: { textIndent: 0, lineHeight: '33px' }, type: "file", placeholder: "选择文件",
                            onChange: e => {
                                const { input, btn } = this.file;
                                const file = input.files[0];
                                if (!file) return;
                                const size = file.size;
                                if (size > 1024 * 1024 * 2) {
                                    utils.showToast("文件大小不能大于2M");
                                    return;
                                }

                                const fr = new FileReader();
                                fr.readAsDataURL(file);
                                fr.onload = () => {
                                    actions.setFileData(fr.result);
                                };
                            }
                        } }),
                    React.createElement('img', { style: { marginTop: 15, maxWidth: '100%' }, src: fData })
                ),
                activeSrc === 'network' && React.createElement(
                    'div',
                    { className: 'animated fadeInRight', style: { width: 500, textAlign: 'center', margin: '30px auto auto' } },
                    React.createElement(InputGroup, { showBtn: false, btnText: '\u7F51\u7EDC\u56FE\u7247',
                        inputProps: {
                            disabled: false, value: url, placeholder: "图片URL",
                            onChange: e => {
                                actions.setNetUrl(e.target.value);
                            }
                        }
                    }),
                    React.createElement('img', { style: { maxWidth: '100%' }, src: url })
                )
            ),
            React.createElement('hr', null),
            React.createElement(
                'div',
                { style: { margin: 'auto', display: 'flex', justifyContent: 'center' } },
                React.createElement(
                    'div',
                    { style: { display: 'inline-block', width: 460, marginRight: 20 } },
                    React.createElement(InputGroup, { btnText: !isStart ? "开始签到" : "结束签到",
                        btnProps: {
                            onClick: () => {
                                if (!isStart) {
                                    if (searchText.trim() !== '') {
                                        actions.setUpFaceStart(!isStart);
                                    } else {
                                        utils.showToast('请输入签到的班级或课程号');
                                    }
                                } else {
                                    utils.showModal("是否确定结束签到？", () => {
                                        if (!searching) {
                                            actions.setUpFaceStart(!isStart);
                                        } else {
                                            utils.showToast('请稍等，有同学在签到中');
                                        }
                                    });
                                }
                            }
                        },
                        inputProps: {
                            disabled: isStart, value: searchText,
                            onChange: e => {
                                actions.setSearchText(e.target.value);
                            },
                            placeholder: '输入班级号或者课程号（如191301）'
                        } })
                ),
                React.createElement(InputGroup, { showIpt: false, showBtn: false, btnText: '\u7B7E\u5230', btnProps: {
                        disabled: !(isStart && !searching),
                        onClick: () => {
                            if (searchText.trim() !== '') db.set('search-text', searchText);else utils.showToast('不能为空');
                        }
                    } })
            )
        );
    }
};

export default _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(_default, 'default', '../gp-njnu-photos-app/app/pages/StuSignPage.js');
}();

;