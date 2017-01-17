import {routerReducer, syncHistoryWithStore} from 'react-router-redux'
import { combineReducers, createStore, applyMiddleware } from 'redux'

import active from './active'
import upface from './upFace'
import base from './base'

import audioImport from './audioImport'
import faceImport from './faceImport'
import admin from './admin'



export const initState = {
    base: require('./base').initState,
    active: require('./active').initState,
    upface: require('./upFace').initState,
    audioImport: require('./audioImport').initState,
    faceImport: require('./faceImport').initState,
    admin: require('./admin').initState
}
export default combineReducers({
    routing: routerReducer,
    active,
    upface,
    base,
    audioImport,
    faceImport,
    admin
});