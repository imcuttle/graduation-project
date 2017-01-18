
export const initState={
    title: "学生签到",
    subtitle: "三种方式获取图像，判断是否为本校学生",
    path: '/',
    bg: "https://ooo.0o0.ooo/2017/01/18/587eea50913fd.jpg"
}


const getNewRouteState = (path) => {
    // debugger;
    switch(path) {
        case '/': 
            return initState;
        case '/about': 
            return {title: '关于', subtitle: '关于本系统', path, bg: "http://cn.technode.com/files/2016/09/shutterstock_379199359.jpg"}
        case '/audio-import':
        	return {title: '语音录入', subtitle: '本系统还提供语音识别，提高识别正确率', path, bg: "http://dingyue.nosdn.127.net/46Ns54pGkSRgsD5MnbZPq4Eq8sE1UYTUF1iAEOdhwBQ5i1467960737268compressflag.jpg"}
        case '/face-import':
            return {title: '人脸录入', subtitle: '为了提高识别率，提供了最新的人脸录入功能', path, bg: "http://www.ezhuoteng.com/Public/upload/20150730/14382434051352.jpg"}
        case '/admin':
            return {title: '管理员界面', subtitle: '', path, bg: "http://www.ezhuoteng.com/Public/upload/20150730/14382434051352.jpg"}
        case '/admin/login':
            return {title: '管理员登录', subtitle: '', path, bg: "http://www.ezhuoteng.com/Public/upload/20150730/14382434051352.jpg"}
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