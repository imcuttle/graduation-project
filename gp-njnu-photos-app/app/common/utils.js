export const showToast = (actions, text, tp) => {
    actions.showToast(text, tp);
    
    window.toast_timer && clearTimeout(window.toast_timer)
    
    window.toast_timer = setTimeout(actions.hideToast, 2000);
}