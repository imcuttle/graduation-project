
const initState={
	title: "学生签到",
	subtitle: "三种方式获取图像，判断是否为本校学生",
	path: '/'
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
		case 'PUSH_ROUTE': 
			return {...newState, ...getNewRouteState(action.path)}
		default:
			return newState;
	}
}