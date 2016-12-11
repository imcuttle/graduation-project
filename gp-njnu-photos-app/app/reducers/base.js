
const initState={
	toast: {
		text: '欢迎来到学生签到系统',
		show: false,
		tp: 'success'
	}
}


const getNewRouteState = (path) => {
	switch(path) {
		case '/': 
			return initState;
		case '/about': 
			return {title: '关于', subtitle: '关于本系统', path}
		default: 
			return {title: '', subtitle: '', path}
	}
}


export default function (state=initState, action) {
	let newState = {...state}
	
	switch(action.type) {
		case 'SHOW_TOAST': 
			return {...newState, toast: {text: action.text, tp: action.tp, show: true}}
		case 'HIDE_TOAST': 
			return {...newState, toast: Object.assign({}, newState.toast, {show: false}) }
		default:
			return newState;
	}
}