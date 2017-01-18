import React from 'react'
import {Map} from 'immutable'
import css from './style.less'


export default ({img="", keys=[], vals=[]}) =>
    <div className={css.main}>
        {!!img && <div className={css.img} ><img src={img} /></div>}
        <ul className={css.info+' '+(!img?css.noimg:'')}>
            {
                keys.map((k, i)=>
                    <li key={i}>
                        <span className={css.left}>{k}</span>
                        <span className={css.right}>{vals[i]}</span>
                    </li>
                )
            }
        </ul>
    </div>