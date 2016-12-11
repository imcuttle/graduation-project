const _type = (type, obj) => {
    return Object.assign({}, {
        type: type,
        ...obj
    })
}


export const pushRoute = (path) => _type("PUSH_ROUTE", {path});

export const switchUpFaceSrc = (src) => _type("SWITCH_UPFACE_SRC", {src});

export const setSearchText = (text) => _type("CHANGE_SEARCHTEXT", {text});
export const setCameraData = (data) => _type("SET_CAMERA_DATA", {data});

export const hideToast = () => _type("HIDE_TOAST");
export const showToast = (text, tp="error") => _type("SHOW_TOAST", {tp, text});