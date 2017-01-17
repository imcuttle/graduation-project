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
        this.checkLogined=this.checkLogined.bind(this)
    }
    static contextTypes={
        router: React.PropTypes.object.isRequired
    }
    checkLogined() {
        const {actions, state} = this.props
        const {admin} = state
        const {router} = this.context;
        const {username, password, isLogined} = admin;
        if(!isLogined) {
            router.push('/admin/login');
        }
    }
    componentDidUpdate() {
        this.checkLogined();
    }
    componentWillMount() {
        this.checkLogined();
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

    render() {
        const {actions, state} = this.props
        const {upface} = state
        const {activeSrc, searchText, searching, camera, file, network, signId, isStart} = upface
        const {data} = camera
        const {data: fData} = file
        const {url} = network

        return (
            <div style={{backgroundColor: '#fff', padding: '16px 10px'}}>
                {/*<Tabs items={this.getTabsProps()} />*/}
                
            </div>
        )
    }
}
