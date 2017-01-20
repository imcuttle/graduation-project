import React from 'react'
import {Map} from 'immutable'
import {isBrowser} from '../../common/utils'
const css = isBrowser ? require('./style.less') : require('./style.less')

export default ({title="titles", bg="", subtitle="subtitle"}) => 
<div className={css.container}>
    <figure style={bg ? {backgroundImage: `url(${bg})`} : {} } className={css.main} >
    </figure>
    <div style={{position: 'relative', zIndex: 2}}>
        <h1 className={css.title}>{title}</h1>
        <p className={css.subtitle}>{subtitle}</p> 
    </div>
</div>