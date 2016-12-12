import fetch from 'isomorphic-fetch'

export const showToast = (text, tp) => {
    const actions = window.actions
    // debugger;
    actions.showToast(text, tp);
    
    window.toast_timer && clearTimeout(window.toast_timer)
    
    window.toast_timer = setTimeout(actions.hideToast, 2000);
}

const umap = {
    stuInfo: '/api/njnu/info'
}
export const urlStringify = json => Object.getOwnPropertyNames(json).map(k=>k+'='+(!!json[k]?json[k]:'')).join('&')


const toastError = data => {
    if(data.code!==200) {
        showToast(data.result)
        return true
    }
    return false
}

export const fetchStuInfo = (id, pwd) => 
    fetch(umap.stuInfo+'?'+urlStringify({id, pwd}))
    .then(res=>res.json())
    .then(data=> !toastError(data) && data.result)