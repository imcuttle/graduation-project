const _type = (type, obj) => {
    return Object.assign({}, {
        type: type,
        ...obj
    })
}

const urlStringify = require('../common/utils').urlStringify
const uShowToast = require('../common/utils').showToast


const umap = {
    stuInfo: '/api/njnu/info',
    predict_base64: '/api/up/predict/base64'
}
const toastError = data => {
    if(data.code!==200) {
        uShowToast(data.result)
        return true
    }
    return false
}

export const fetchStuPredict = (cls, data) =>
    (dispatch, getState)=>
        fetch(umap.predict_base64, {
            method: 'POST',
            headers: {'content-type': 'application/json;charset=utf-8'},
            body: JSON.stringify({cls, data})
        })
        .then(res=>res.json())
        .then(data=> !toastError(data) && dispatch(showToast(JSON.stringify(data.result))))

export const fetchStuInfo = (id, pwd) => 
    (dispatch, getState)=>
    fetch(umap.stuInfo+'?'+urlStringify({id, pwd}))
    .then(res=>res.json())
    .then(data=> !toastError(data) && dispatch(setAudioStuInfo(data.result)))



export const pushRoute = (path) => _type("PUSH_ROUTE", {path});

export const switchUpFaceSrc = (src) => _type("SWITCH_UPFACE_SRC", {src});

export const setUpFaceStart = (isStart) => _type("SET_UPFACE_START", {isStart});
export const setSearchText = (text) => _type("CHANGE_SEARCHTEXT", {text});
export const setCameraData = (data) => _type("SET_CAMERA_DATA", {data});
export const setFileData = (data) => _type("SET_FILE_DATA", {data});
export const setNetUrl = (url) => _type("SET_NET_URL", {url});

export const setAudioData = (data) => _type("SET_AUDIO_DATA", {data});
export const setAudioSrc = (src) => _type("SWITCH_AUDIO_SRC", {src});
export const setAudioId = (id) => _type("SET_AUDIO_ID", {id});
export const setAudioPwd = (pwd) => _type("SET_AUDIO_PWD", {pwd});
export const setAudioImporting = (importing) => _type("SET_AUDIO_IMPORTING", {importing});
export const setAudioFileData = (data) => _type("SET_AUDIO_FILE_DATA", {data});

export const setAudioStuInfo = (info) => _type("SET_AUDIO_STUINFO", {...info});



export const hideToast = () => _type("HIDE_TOAST");
export const showToast = (text, tp="error") => _type("SHOW_TOAST", {tp, text});

export const showModal = (content, onOk, onCancel, title="", size="sm") => _type("SHOW_MODAL", {onOk, onCancel, content, title, size});
export const hideModal = () => _type("HIDE_MODAL");
