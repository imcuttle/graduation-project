export const localIp = (() => process.env.NODE_ENV == 'dev' ? ('http://localhost:'+process.env.PORT) : ('https://face.moyuyc.xyz'))()

export const showToast = (text, tp) => {
    const actions = window.actions
    // debugger;
    actions.showToast(text, tp);
    
    window.toast_timer && clearTimeout(window.toast_timer)
    
    window.toast_timer = setTimeout(actions.hideToast, 2000);

    return true;
}

export const isBrowser = (() => !(typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node !== 'undefined'))();


export const showModal = (content, onOk, onCancel=hideModal, title, size) => {
    const actions = window.actions
    var _onOk=onOk
    if(_onOk) {
        _onOk = () => {
            onOk();
            hideModal()
        }
    }
    actions.showModal(content, _onOk, onCancel, title, size);
}

export const objIsEmpty = obj => Object.keys(obj).length === 0

export const hideModal = () => {
    const actions = window.actions
    
    actions.hideModal();
}

export const md5Hex = (text) => require('crypto').createHash('md5').update(text, 'utf-8').digest('hex');

export const urlStringify = json => Object.getOwnPropertyNames(json).map(k=>k+'='+(!!json[k]?json[k]:'')).join('&')


