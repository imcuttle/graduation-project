var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';
import { Map } from 'immutable';
import css from './style.less';

const _default = class extends React.Component {

	render() {
		const { btnText = "确定", btnProps = {}, inputProps = {}, showBtn = true, showIpt = true } = this.props;
		return React.createElement(
			'div',
			{ className: css.main },
			showIpt && React.createElement('input', _extends({ ref: r => this.input = r, style: showBtn ? {} : { paddingRight: 0, marginRight: 0 } }, inputProps)),
			showBtn && React.createElement(
				'span',
				_extends({ ref: r => this.btn = r, style: showIpt ? {} : { padding: '0px 26px', width: 'auto' }, className: css.btn }, btnProps),
				btnText
			)
		);
	}
};

export default _default;
;

var _temp = function () {
	if (typeof __REACT_HOT_LOADER__ === 'undefined') {
		return;
	}

	__REACT_HOT_LOADER__.register(_default, 'default', '../gp-njnu-photos-app/app/components/InputGroup/index.js');
}();

;