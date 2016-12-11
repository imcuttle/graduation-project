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
		this.getTabsProps=this.getTabsProps.bind(this)
	}
	getTabsProps() {
		const {actions, state} = this.props
		const {upface} = state
		const {activeSrc} = upface

		return [
			{text: '摄像头', active: activeSrc==='camera', onClick: activeSrc!=='camera'?()=>actions.switchUpFaceSrc('camera'):null},
			{text: '上传图片', active: activeSrc==='file', onClick: activeSrc!=='file'?()=>actions.switchUpFaceSrc('file'):null},
			{text: '网络图片', active: activeSrc==='network', onClick: activeSrc!=='network'?()=>actions.switchUpFaceSrc('network'):null}
		]
		
	}

	render() {
		const {actions, state} = this.props
		const {upface} = state
		const {activeSrc, searchText, searching} = upface
		console.log(state)
		return (
			<div style={{backgroundColor: '#fff', padding: '16px 10px'}}>
				<Tabs items={this.getTabsProps()} />
				<div style={{ minHeight: 400}}>
					<div style={{display: activeSrc!=='camera'?'none':''}}><TakePhoto onPhotoCallback={actions.setCameraData}/></div>
					{activeSrc==='file' && <div style={{width: 400, margin: '30px auto auto'}}>
						<InputGroup btnText="上传图片" inputProps={{disabled: true}}/>
					</div>}
					{activeSrc==='network' && <div style={{width: 400, margin: '30px auto auto'}}>
						<InputGroup btnText="网络图片" inputProps={{disabled: false}}/>
					</div>}
				</div>
				<hr/>
				<div style={{minWidth: 400, width: '67%', margin: 'auto'}}>
					<InputGroup btnText="签到" 
						btnProps={{
							disabled: searching,
							onClick: ()=>{
								if(searchText.trim()!=='') db.set('search-text', searchText);
								else utils.showToast(actions, '不能为空')
							}
						}}
						inputProps={{
							disabled: searching, value: searchText, 
							onChange: (e)=>{actions.setSearchText(e.target.value)},
							placeholder: '输入班级号或者课程号（如191301）'
						}} />
				</div>
			</div>
		)
	}
}