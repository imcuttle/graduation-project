import React from 'react'
import {render} from 'react-dom'
import Tabs from '../components/TabNav'
import InputGroup from '../components/InputGroup'
import TakePhoto from '../components/TakePhoto'
import Information from '../components/Information'

const db = require('../common/storage')
const utils = require('../common/utils')


export default class extends React.Component {

    constructor(props) {
        super(props);
        this.getTabsProps = this.getTabsProps.bind(this)
        this.inputBlur = this.inputBlur.bind(this)
    }
    getTabsProps() {
        const {actions, state} = this.props
        const {faceImport} = state
        const {activeSrc} = faceImport
        return [
            {text: '摄像头', active: activeSrc==='camera', onClick: activeSrc!=='camera'?()=>actions.setFaceInSrc('camera'):null},
            {text: '文件导入', active: activeSrc==='file', onClick: activeSrc!=='file'?()=>actions.setFaceInSrc('file'):null},
        ]        
    }

    inputBlur(e) {
        const {actions, state} = this.props
        const {id: eId, pwd: ePwd} = this
        const {upface, faceImport} = state
        const {activeSrc, pwd, id, importing, camera, file, stuInfo} = faceImport

        setTimeout(()=>{ 
            const activeElement = document.activeElement // without timeout, = body
            if(!!id.trim() && !!pwd.trim() && activeElement!==eId && activeElement!==ePwd) {
                actions.fetchStuInfo(id.trim(), pwd.trim(), actions.setFaceInStuInfo)
            }
        }, 100)
    }

    getInformationProps(info={}) {
        return {
            img: info.img,
            keys: ["姓名", "班级", "学院"],
            vals: [info.name, info.classNo, info.department]
        }
    }

    render() {
        const {actions, state} = this.props
        const {upface, faceImport} = state
        const {activeSrc, pwd, id, importing, camera, file, stuInfo} = faceImport
        // console.log(audioImport)
        return (
            <div style={{backgroundColor: '#fff', padding: '16px 10px'}}>
                
                <div className="animated pulse" style={{ display: 'flex', marginTop: 20, justifyContent: 'center'}}>
                    <div style={{display: 'inline-block', width: '31%', padding: 12, boxSizing: 'border-box'}}>
                        <InputGroup ref={r=>{if(r) this.id=r.input}} showBtn={false} inputProps={{
                            placeholder: '学号', value: id,
                            onChange: e=>{
                                actions.setFaceInId(e.target.value)
                            },
                            onBlur: this.inputBlur
                        }}/>
                    </div>
                    <div style={{display: 'inline-block', width: '31%', padding: 12, boxSizing: 'border-box'}}>
                        <InputGroup ref={r=>{if(r) this.pwd=r.input}} showBtn={false} inputProps={{
                            placeholder: '密码(教务系统)', value: pwd, type: 'password',
                            onChange: e=>{
                                actions.setFaceInPwd(e.target.value)
                            },
                            onBlur: this.inputBlur
                        }}/>
                    </div>
                    <div style={{display: 'inline-block', boxSizing: 'border-box', padding: 12}}>
                        <InputGroup showIpt={false} btnText="录入" btnProps={{}}/>
                    </div>
                </div>

                <div className="animated fadeIn" style={{width: '53%', margin: '10px auto 10px', display: Object.getOwnPropertyNames(stuInfo).length?'':'none'}}>
                    <Information {...this.getInformationProps(stuInfo)}/>
                </div>

                <Tabs items={this.getTabsProps()}/>
                <div style={{minHeight: 400, margin: '30px auto auto auto', textAlign: 'center'}}>
                {activeSrc==='camera' && <TakePhoto />}

                {activeSrc==='file' && <InputGroup />}
                </div>
                <hr/>
                
            </div>
        )
    }
}