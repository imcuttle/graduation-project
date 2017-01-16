
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
		const {photos=[]} = this.props

		return (
			<div className={css.main}>
				{photos.map(photo => <div key={photo.key} className={css.photo}>{photo.onClose && <span onClick={photo.onClose} className={css.close}>x</span>}<img src={photo.url}/></div>)}
			</div>
		)
	}
}
