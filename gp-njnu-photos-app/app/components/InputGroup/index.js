import React from 'react'
import {Map} from 'immutable'
import css from './style.less'



export default ({btnText="确定", btnProps={}, inputProps={}, showBtn=true, showIpt=true}) =>
    <div className={css.main}>
        {showIpt && <input style={showBtn?{}:{paddingRight: 0, marginRight: 0}} {...inputProps}/>}
        {showBtn && <span style={showIpt?{}:{padding: '0px 26px', width: 'auto'}} className={css.btn} {...btnProps}>{btnText}</span>}
    </div>