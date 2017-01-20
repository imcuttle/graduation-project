var isBrowser = (() => !(typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node !== 'undefined'))();

export const set = isBrowser ? window.localStorage.setItem.bind(window.localStorage) : () => {}

export const get = isBrowser ? window.localStorage.getItem.bind(window.localStorage) : () => {}

export const remove = isBrowser ? window.localStorage.removeItem.bind(window.localStorage) : () => {}

export const sSet = isBrowser ? window.sessionStorage.setItem.bind(window.sessionStorage) : () => {}

export const sGet = isBrowser ? window.sessionStorage.getItem.bind(window.sessionStorage) : () => {}

export const sRemove = isBrowser ? window.sessionStorage.removeItem.bind(window.sessionStorage) : () => {}