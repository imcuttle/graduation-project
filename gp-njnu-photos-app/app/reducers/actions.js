const _type = (type, obj) => {
    return Object.assign({}, {
        type: type,
        ...obj
    })
}


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

