import {Map} from 'immutable'

export const initState={
    toast: {
        text: '欢迎来到学生签到系统',
        show: false,
        tp: 'success'
    },
    modal: {
    	title: '',
    	size: 'sm',
    	content: ' ',
    	show: false,
    	onCancel: null,
    	onOk: null
    },
    loading: false,
    loadingText: ''
}



export default function (state=initState, action) {
    let newState = {...state};
    const {type, ...other} = action
    switch(type) {
        case 'SHOW_TOAST': 
            return {...newState, toast: {...other, show: true}}
        case 'HIDE_TOAST': 
            return {...newState, toast: Object.assign({}, newState.toast, {show: false}) }
        case 'SHOW_MODAL': 
            return {...newState, modal: {...other, show: true} }
        case 'HIDE_MODAL': 
            return {...newState, modal: Object.assign({}, newState.modal, {show: false}) }
        case 'SET_LOADING':
            return {...newState, loading: action.loading, loadingText: action.loadingText}
        default:
            return newState;
    }
}