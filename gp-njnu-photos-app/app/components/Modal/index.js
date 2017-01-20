import React from 'react'
import {Map} from 'immutable'
import {isBrowser} from '../../common/utils'
const css = isBrowser ? require('./style.less') : require('./style.less')

//http://v3.bootcss.com/javascript/#modals

export default ({title="modal", content="content", show=false, onCancel, onOk, size="sm"}) =>
    <div className={css.main} style={{display: !show?'none':'block'}}>
        <div className={css.backdrop}></div>
        
        <div className={css.dialog+" animated fadeIn"} style={{animationDuration: '300ms', width: size==='sm'?400:680}}>
            <div className={css.content}>
                <div className={css.header}>
                    <span onClick={onCancel} className={css.close}>
                        <span aria-hidden="true">×</span>
                    </span>
                    <h4 className={css.title}>{title}</h4>
                </div>
                <div className={css.body}>{content}</div>
                <div className={css.footer}>
                    <button className={css.default} onClick={onCancel}>取消</button>
                    <button className={css.primary} onClick={onOk}>确定</button>
                </div>
            </div>
        </div>
    </div>