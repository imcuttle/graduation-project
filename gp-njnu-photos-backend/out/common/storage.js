
export const set = (key, val) => window.localStorage.setItem(key, val);

export const get = key => window.localStorage.getItem(key);

export const remove = key => window.localStorage.removeItem(key);

export const sSet = (key, val) => window.sessionStorage.setItem(key, val);

export const sGet = key => window.sessionStorage.getItem(key);

export const sRemove = key => window.sessionStorage.removeItem(key);
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(set, "set", "../gp-njnu-photos-app/app/common/storage.js");

  __REACT_HOT_LOADER__.register(get, "get", "../gp-njnu-photos-app/app/common/storage.js");

  __REACT_HOT_LOADER__.register(remove, "remove", "../gp-njnu-photos-app/app/common/storage.js");

  __REACT_HOT_LOADER__.register(sSet, "sSet", "../gp-njnu-photos-app/app/common/storage.js");

  __REACT_HOT_LOADER__.register(sGet, "sGet", "../gp-njnu-photos-app/app/common/storage.js");

  __REACT_HOT_LOADER__.register(sRemove, "sRemove", "../gp-njnu-photos-app/app/common/storage.js");
}();

;