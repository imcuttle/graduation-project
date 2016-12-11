import React from 'react'
import {Map} from 'immutable'
import css from './style.less'



export default ({btnText="确定", btnProps={}, inputProps={}}) =>
	<div className={css.main}>
		<input {...inputProps}/>
		<span className={css.btn} {...btnProps}>{btnText}</span>
	</div>