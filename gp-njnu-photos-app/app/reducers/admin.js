import {Map, List} from 'immutable'
const db = require('../common/storage')

export const initState={
    
    username: db.sGet('admin_user') || '',
    password: db.sGet('admin_pwd') || '',
    isLogined: Boolean(db.sGet('admin_islogined')) || false,
    src: 'faceImport',
    faceImport: {
        id: '',
        photos: []
    }
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
    let newState = {...state};
    const {type, ...other} = action
    switch(type) {
        case 'SET_ADMIN_USER': 
            db.sSet('admin_user', action.username);
            return {...newState, username: action.username}
        case 'SET_ADMIN_PWD': 
            db.sSet('admin_pwd', action.password);
            return {...newState, password: action.password}
        case 'SET_ADMIN_ISLOGIN': 
            db.sSet('admin_islogined', action.isLogined?'1':'0');
            return {...newState, isLogined: action.isLogined}
        case 'SET_ADMIN_SRC':
            return {...newState, src: action.src}
        case 'SET_ADMIN_FACEIN_ID':
            return updateState(state, 'faceImport', 'id', action.id);
        case 'SET_ADMIN_FACEIN_PHOTOS':
            return updateState(state, 'faceImport', 'photos', action.photos)
        case 'DEL_ADMIN_FACEIN_PHOTO':
            newState.faceImport.photos = rmList(newState.faceImport.photos, 'key', action.key)
            return newState;
        default:
            return newState;
    }
}