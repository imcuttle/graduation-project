
export const set = (key, val) => window.localStorage.setItem(key, val)

export const get = (key) => window.localStorage.getItem(key)

export const remove = (key) => window.localStorage.removeItem(key)

export const sSet = (key, val) => window.sessionStorage.setItem(key, val)

export const sGet = (key) => window.sessionStorage.getItem(key)

export const sRemove = (key) => window.sessionStorage.removeItem(key)