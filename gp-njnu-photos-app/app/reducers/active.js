
export const initState={
    title: "学生签到",
    subtitle: "人脸识别，判断是否为本校学生",
    path: '/',
    bg: "https://ooo.0o0.ooo/2017/01/18/587eea50913fd.jpg"
}


const getNewRouteState = (path) => {
    // debugger;
    switch(path) {
        case '/': 
            return initState;
        case '/about': 
            return {title: '关于', subtitle: '关于本系统', path, bg: "https://ooo.0o0.ooo/2017/01/19/5880a68dc28c2.jpg"}
        case '/audio-import':
        	return {title: '语音录入', subtitle: '本系统还提供语音识别，提高识别正确率', path, bg: "https://ooo.0o0.ooo/2017/01/19/5880a6a5743d4.jpg"}
        case '/face-import':
            return {title: '人脸录入', subtitle: '为了提高识别率，提供了最新的人脸录入功能', path, bg: "https://ooo.0o0.ooo/2017/01/19/5880a6d1b00b9.jpg"}
        case '/admin':
            return {title: '管理员界面', subtitle: '', path, bg: "https://ooo.0o0.ooo/2017/01/19/5880a6f147f67.jpg"}
        case '/admin/login':
            return {title: '管理员登录', subtitle: '', path, bg: "https://ooo.0o0.ooo/2017/01/19/5880a71d0e946.jpg"}
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