import {Map, List} from 'immutable'
const db = require('../common/storage')

export const initState={
    activeSrc: 'camera',
    id: '',
    pwd: '',
    importing: false,
    camera: {
        data: ''
    },
    file: {
        data: ''
    },
    stuInfo: {
        
    },
    faces: []
}

const updateState = (state, key, subKey, newVal) => {
    let newState = Map(state)
    if(subKey === '*') 
        return newState.set(key, Object.assign({}, newState.get(key), newVal)).toObject()
    return newState.set(key, Map(newState.get(key)).set(subKey, newVal).toObject()).toObject()
}

const rmList = (list, keyname, keyval) => {
    let newList = List(list);
    let i = newList.findIndex(x=>x[keyname]===keyval)    
    return i>=0 ? newList.remove(i).toArray() : newList.toArray()
}


export default function (state=initState, action) {
    let newState = Map(state)
    const {type, ...other} = action
    switch(type) {
        case 'SWITCH_FACE_IN_SRC':
            return newState.set('activeSrc', action.src).toObject()
        case 'SET_FACE_IN_ID':
            return newState.set('id', action.id).toObject()
        case 'SET_FACE_IN_PWD':
            return newState.set('pwd', action.pwd).toObject()
        case 'SET_FACE_IN_IMPORTING':
            return newState.set('importing', action.importing).toObject()
        case 'SET_FACE_IN_CAMERA_DATA': 
            return updateState(state, 'camera', 'data', action.data)
        case 'SET_FACE_IN_FILE_DATA': 
            return updateState(state, 'file', 'data', action.data)
        case 'SET_FACE_IN_STUINFO': 
            return updateState(state, 'stuInfo', '*', other)
        case 'CLEAR_FACE_IN_STUINFO': 
            return newState.set('stuInfo', {}).toObject()
        case 'SET_FACE_IN_FACES':
            return newState.set('faces', action.faces).toObject()
        case 'APP_FACE_IN_FACE':
            return newState.set('faces', newState.get('faces').concat(action.face)).toObject()
        case 'DEL_FACE_IN_FACE':
            return newState.set('faces', rmList(state.faces, 'hash', action.hash)).toObject()
        default:
            return newState.toObject();
    }
}