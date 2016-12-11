import React from 'react'
import {Map} from 'immutable'
import css from './style.less'


export default ({text="toast", tp="success", show=false}) =>
	<div className={`${css.main} ${css[tp]} ${show?css.active:''}`}>
		{text}
	</div>