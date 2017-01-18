var _class, _temp;

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
		const { photos = [] } = this.props;

		return React.createElement(
			'div',
			{ className: css.main },
			photos.map(photo => React.createElement(
				'div',
				{ key: photo.key, className: css.photo },
				photo.onClose && React.createElement(
					'span',
					{ onClick: photo.onClose, className: css.close },
					'x'
				),
				React.createElement('img', { src: photo.url })
			))
		);
	}
}, _class.defaultProps = {}, _class.propTypes = {}, _temp);

export default _default;
;

var _temp2 = function () {
	if (typeof __REACT_HOT_LOADER__ === 'undefined') {
		return;
	}

	__REACT_HOT_LOADER__.register(_default, 'default', '../gp-njnu-photos-app/app/components/PhotosFall/index.js');
}();

;