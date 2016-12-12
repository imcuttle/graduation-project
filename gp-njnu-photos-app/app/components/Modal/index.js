import React from 'react'
import {Map} from 'immutable'
import css from './style.less'

//http://v3.bootcss.com/javascript/#modals

export default ({title="modal", tp="success", show=false}) =>
    <div className={css.main}>
        <div className={css.backdrop}></div>
        <div className={css.dialog}>
            <div className={css.content}>
                <div className={css.header}><h4>{title}</h4></div>
                <div className={css.body}></div>
                <div className={css.footer}></div>
            </div>
        </div>
    </div>