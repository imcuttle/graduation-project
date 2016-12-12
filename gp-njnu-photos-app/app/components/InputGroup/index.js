import React from 'react'
import {Map} from 'immutable'
import css from './style.less'



export default class extends React.Component{

	render() {
		const {btnText="确定", btnProps={}, inputProps={}, showBtn=true, showIpt=true} = this.props
		return (
			<div className={css.main}>
		        {showIpt && <input ref={r=>this.input=r} style={showBtn?{}:{paddingRight: 0, marginRight: 0}} {...inputProps}/>}
		        {showBtn && <span ref={r=>this.btn=r} style={showIpt?{}:{padding: '0px 26px', width: 'auto'}} className={css.btn} {...btnProps}>{btnText}</span>}
		    </div>
		)
	}
}