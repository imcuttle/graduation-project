
export const set = (key, val) => window.localStorage.setItem(key, val)

export const get = (key) => window.localStorage.getItem(key)

export const remove = (key) => window.localStorage.removeItem(key)