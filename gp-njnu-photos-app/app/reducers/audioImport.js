import {Map, List} from 'immutable'
const db = require('../common/storage')

const initState={
    activeSrc: 'audio',
    id: '',
    pwd: '',
    importing: false,
    audio: {
        data: ''
    },
    file: {
        data: ''
    },
    stuInfo: {
        
    }
}

const updateState = (state, key, subKey, newVal) => {
    let newState = Map(state)
    if(subKey === '*') 
        return newState.set(key, Object.assign({}, newState.get(key), newVal)).toObject()
    return newState.set(key, Map(newState.get(key)).set(subKey, newVal).toObject()).toObject()
}

export default function (state=initState, action) {
    let newState = Map(state)
    const {type, ...other} = action
    switch(type) {
        case 'SWITCH_AUDIO_SRC':
            return newState.set('activeSrc', action.src).toObject()
        case 'SET_AUDIO_ID':
            return newState.set('id', action.id).toObject()
        case 'SET_AUDIO_PWD':
            return newState.set('pwd', action.pwd).toObject()
        case 'SET_AUDIO_IMPORTING':
            return newState.set('importing', action.importing).toObject()
        case 'SET_AUDIO_DATA': 
            return updateState(state, 'audio', 'data', action.data)
        case 'SET_AUDIO_FILE_DATA': 
            return updateState(state, 'file', 'data', action.data)
        case 'SET_AUDIO_STUINFO': 
            return updateState(state, 'stuInfo', '*', other)
        default:
            return newState.toObject();
    }
}