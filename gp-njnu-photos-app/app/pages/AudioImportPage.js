import React from 'react'
import {render} from 'react-dom'
import Tabs from '../components/TabNav'
import InputGroup from '../components/InputGroup'
import TakePhoto from '../components/TakePhoto'

const db = require('../common/storage')
const utils = require('../common/utils')


export default class extends React.Component {

    constructor(props) {
        super(props);
        
    }
    

    render() {
        const {actions, state} = this.props
        const {upface} = state
        const {activeSrc, searchText, searching} = upface
        console.log(state)

        return (
            <div style={{backgroundColor: '#fff', padding: '16px 10px'}}>
                
                <div className="animated pulse" style={{ display: 'flex', marginTop: 20, justifyContent: 'center'}}>
                    <div style={{display: 'inline-block', width: '31%', padding: 12, boxSizing: 'border-box'}}>
                        <InputGroup showBtn={false} inputProps={{placeholder: '学号'}}/>
                    </div>
                    <div style={{display: 'inline-block', width: '31%', padding: 12, boxSizing: 'border-box'}}>
                        <InputGroup showBtn={false} inputProps={{placeholder: '密码(教务系统)'}}/>
                    </div>
                    <div style={{display: 'inline-block', boxSizing: 'border-box', padding: 12}}>
                        <InputGroup showIpt={false} btnText="录入" btnProps={{}}/>
                    </div>
                </div>

                <Tabs items={[{text: '话筒导入', active: true}, {text: '文件导入'}]}/>
                <hr/>
                
            </div>
        )
    }
}