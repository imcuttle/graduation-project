
import React from 'react'
import {Map} from 'immutable'

import {isBrowser} from '../../common/utils'
const css = isBrowser ? require('./style.less') : require('./style.less')


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
		const {type='default', text='', ...props} = this.props

		return (
			<span className={`${css.btn} ${css[type]}`} {...props} >{text}</span>
		)
	}
}
