var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp;

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import { Map } from 'immutable';

import css from './style.less';

const _default = (_temp = _class = class _default extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentWillMount() {}
	componentDidMount() {}
	componentWillReceiveProps(newProps) {}
	shouldComponentUpdate(newProps, newState, newContext) {
		return !Map(this.props).equals(Map(newProps));
	}
	componentWillUpdate(newProps, newState, newContext) {}
	componentDidUpdate(oldProps, oldState, oldContext) {}
	componentWillUnmount() {}

	render() {
		const { type = 'default', text = '' } = this.props;

		const props = _objectWithoutProperties(this.props, ['type', 'text']);

		return React.createElement(
			'span',
			_extends({ className: `${ css.btn } ${ css[type] }` }, props),
			text
		);
	}
}, _class.defaultProps = {}, _class.propTypes = {}, _temp);

export default _default;
;

var _temp2 = function () {
	if (typeof __REACT_HOT_LOADER__ === 'undefined') {
		return;
	}

	__REACT_HOT_LOADER__.register(_default, 'default', '../gp-njnu-photos-app/app/components/Button/index.js');
}();

;