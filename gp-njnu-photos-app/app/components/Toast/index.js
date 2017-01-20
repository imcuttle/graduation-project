import React from 'react'
import {Map} from 'immutable'

import {isBrowser} from '../../common/utils'
const css = isBrowser ? require('./style.less') : require('./style.less')


export default ({text="toast", tp="success", show=false}) =>
    <div className={`${css.main} ${css[tp]} ${show?css.active:''}`}>
        {text}
    </div>