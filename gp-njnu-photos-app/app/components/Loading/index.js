
import React from 'react'
import {Map} from 'immutable'

import css from './style.less'


export default class extends React.Component {
	constructor(props) {
		super(props)
	}
	componentWillMount() {}
	componentDidMount() {}
	componentWillReceiveProps(newProps) {}
	shouldComponentUpdate(newProps, newState, newContext) {
		return !Map(this.props).equals(Map(newProps))
	}
	componentWillUpdate(newProps, newState, newContext) {}
	componentDidUpdate(oldProps, oldState, oldContext) {}
	componentWillUnmount() {}
	static defaultProps = {}
    state = {}
    static propTypes = {}
	render() {
		const {text=''} = this.props

		return (
			<div className={css.main}>
				<div className={css.object+' '+css.object_one} ></div>
				<div className={css.object+' '+css.object_two} ></div>
				<div className={css.object+' '+css.object_three}></div>
				<h3 className={css.text}>{text}</h3>
			</div>
		)
	}
}
