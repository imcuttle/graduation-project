import {Map} from 'immutable'
const db = require('../common/storage')

export const initState={
    
    username: db.sGet('admin_user') || '',
    password: db.sGet('admin_pwd') || '',
    isLogined: Boolean(db.sGet('admin_islogined')) || false
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
        default:
            return newState;
    }
}