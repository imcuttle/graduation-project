
import { render } from 'react-dom';
import './common/css/base.global.less';

import MyRouters, { configureStore } from './router';

render(MyRouters, document.getElementById('app'));
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }
}();

;