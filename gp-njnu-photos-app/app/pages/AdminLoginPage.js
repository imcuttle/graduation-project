import React from 'react'
import {render} from 'react-dom'
import Tabs from '../components/TabNav'
import InputGroup from '../components/InputGroup'

const db = require('../common/storage')
const utils = require('../common/utils')


export default class extends React.Component {

    constructor(props) {
        super(props);
        this.getTabsProps=this.getTabsProps.bind(this)
        this.checkLogined = this.checkLogined.bind(this)
        this.clickLoginBtn=this.clickLoginBtn.bind(this)
        this.keyPressInput=this.keyPressInput.bind(this)
    }
    static contextTypes={        
        router: React.PropTypes.object.isRequired
    }
    keyPressInput(e) {
        if(e.charCode === 13)
            this.clickLoginBtn();
    }
    clickLoginBtn(e) {
        const {actions, state} = this.props
        const {admin} = state
        const {router} = this.context;
        const {username, password, isLogined} = admin;
        actions.fetchAdminLogin(username, password)
    }

    getTabsProps() {
        const {actions, state} = this.props
        const {upface} = state
        const {activeSrc} = upface

        return [
            {text: '摄像头', active: activeSrc==='camera', onClick: activeSrc!=='camera'?()=>actions.switchUpFaceSrc('camera'):null},
            // {text: '上传图片', active: activeSrc==='file', onClick: activeSrc!=='file'?()=>actions.switchUpFaceSrc('file'):null},
            // {text: '网络图片', active: activeSrc==='network', onClick: activeSrc!=='network'?()=>actions.switchUpFaceSrc('network'):null}
        ]
    }

    checkLogined() {
        const {actions, state} = this.props
        const {admin} = state
        const {router} = this.context;
        const {username, password, isLogined} = admin;
        if(isLogined) {
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
        const {actions, state} = this.props
        const {admin} = state
        const {username, password, isLogined} = admin;

        return (
            <div style={{backgroundColor: '#fff', padding: '16px 10px'}}>
                <div style={{width: '55%', maxWidth: 520, margin: 'auto'}}>
                    <InputGroup showBtn={false} inputProps={{placeholder: '管理员帐号', defaultValue: username, onKeyPress: this.keyPressInput, onChange: e=>actions.setAdminUser(e.target.value)}}/>
                    <InputGroup showBtn={false} inputProps={{placeholder: '管理员密码', defaultValue: password, onKeyPress: this.keyPressInput, onChange: e=>actions.setAdminPwd(e.target.value), type: 'password'}}/>
                    <InputGroup showIpt={false} btnProps={{style: {float: 'right'}, onClick: this.clickLoginBtn}} btnText="登录"/>
                </div>
            </div>
        )
    }
}
