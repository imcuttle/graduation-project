
import {render} from 'react-dom'
import './common/css/base.global.less'

import MyRouters, {configureStore} from './router'


render((
    MyRouters
), document.getElementById('app'))

