import React from 'react'
import {render} from 'react-dom'
import Tabs from '../components/TabNav'
import InputGroup from '../components/InputGroup'
import TabNav from '../components/TabNav'
import PhotosFall from '../components/PhotosFall'
import Information from '../components/Information'

const db = require('../common/storage')
const utils = require('../common/utils')


export default class extends React.Component {

    constructor(props) {
        super(props);
        this.getTabsProps=this.getTabsProps.bind(this)
        this.checkLogined=this.checkLogined.bind(this)
        this.InputBlur = this.InputBlur.bind(this)
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
        const {admin} = state
        const {src} = admin

        return [
            {text: '样本查看', active: src==='faceImport', onClick: src!=='faceImport'?()=>actions.setAdminSrc('faceImport'):null},
            {text: '学生信息', active: src==='stuInfo', onClick: src!=='stuInfo'?()=>actions.setAdminSrc('stuInfo'):null},
            // {text: '网络图片', active: activeSrc==='network', onClick: activeSrc!=='network'?()=>actions.switchUpFaceSrc('network'):null}
        ]
        
    }
    InputBlur() {
        const {actions, state} = this.props
        const {admin} = state
        const {src, faceImport} = admin;
        const {id: faceInId, photos: faceInPhotos} = faceImport;
        actions.fetchAdminFaceImportList(faceInId);
    }

    render() {
        const {actions, state} = this.props
        const {admin} = state
        const {src, faceImport, stuInfo} = admin;
        const {id: faceInId, photos: faceInPhotos} = faceImport;
        const {id: stuInfoId, ...info} = stuInfo;

        return (
            <div style={{backgroundColor: '#fff', padding: '16px 10px'}}>
                {<Tabs items={this.getTabsProps()} />}
                <div style={{width: '60%', maxWidth: 800, margin: '23px auto'}}>
                    {src === 'faceImport' &&
                        <div>
                        <div style={{width: '40%', maxWidth: 500, margin: '12px auto'}}>
                            <InputGroup showBtn={false} 
                                inputProps={{
                                    placeholder: '输入学号', defaultValue: faceInId, 
                                    onBlur: this.InputBlur,
                                    onKeyPress: e => e.charCode === 13 && this.InputBlur(e),
                                    onChange: e => actions.setAdminFaceInId(e.target.value)
                                }}
                            />
                        </div>
                        <PhotosFall photos={faceInPhotos}/>
                        </div>
                    }
                    {src === 'stuInfo' &&
                        <div>
                        <div style={{width: '40%', maxWidth: 500, margin: '12px auto'}}>
                            <InputGroup showBtn={false}
                                inputProps={{
                                    placeholder: '学生学号', defaultValue: stuInfoId,
                                    onBlur: e=>actions.fetchAdminStuInfo(stuInfoId),
                                    onKeyPress: e => e.charCode === 13 && actions.fetchAdminStuInfo(stuInfoId),
                                    onChange: e => actions.setAdminStuInfoId(e.target.value)
                                }}
                            />
                        </div>
                        <Information {...info}/>
                        </div>
                    }
                </div>
                
            </div>
        )
    }
}
