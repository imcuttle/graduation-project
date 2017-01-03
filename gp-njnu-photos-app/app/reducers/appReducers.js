import {routerReducer, syncHistoryWithStore} from 'react-router-redux'
import { combineReducers, createStore, applyMiddleware } from 'redux'

import active from './active'
import upface from './upFace'
import base from './base'
import audioImport from './audioImport'
import faceImport from './faceImport'

export default combineReducers({
    routing: routerReducer,
    active,
    upface,
    base,
    audioImport,
    faceImport
});