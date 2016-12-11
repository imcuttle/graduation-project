import React from 'react'
import {Map} from 'immutable'
import css from './style.less'

export default ({title="titles", subtitle="subtitle"}) =>
	<div className={css.main}>
		<h1 className={css.title}>{title}</h1>
		<p className={css.subtitle}>{subtitle}</p>
	</div>