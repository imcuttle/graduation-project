const realFetch = require('isomorphic-fetch')
import {isBrowser, localIp} from '../common/utils';
import {marked, mdtextUrl} from './about'

const fetch = isBrowser
    ? (url, options={}) => realFetch(url, {...options, credentials: 'same-origin'}).catch(err => console.error)
    : (relaUrl, option) => {
        var url = relaUrl.startsWith('http') ? relaUrl : ( localIp + ( relaUrl.startsWith('/') ? relaUrl : ('/'+relaUrl) ) );
        return realFetch(url, option);
    }

const _type = (type, obj) => {
    return Object.assign({}, {
        type: type,
        ...obj
    })
}

const urlStringify = require('../common/utils').urlStringify
const uShowToast = require('../common/utils').showToast
const uShowModal = require('../common/utils').showModal
const md5Hex = require('../common/utils').md5Hex
// import fetch from 'iso'

const umap = {
    stuInfo: '/api/njnu/info',
    predict_base64: '/api/up/predict/base64',
    face_import: '/api/up/face-import/base64',
    face_import_get: '/api/get/face-import/',
    face_import_delete: '/api/do/face-import/delete'
}
const toastError = data => {
    if(data.code!==200) {
        uShowToast(data.result)
        return true
    }
    return false
}

export const fetchRemoteMdText = () =>
    (dispatch, getState) => {
        const state = getState();
        const {about} = state;
        const {isRemote} = about
        if (!isRemote) {
            return fetch(mdtextUrl, {
                mode: 'cors'
            })
            .then(r => {
                if (r.status === 200) {
                    return r.text();
                }
            })
            .then(md => md && marked(md.replace(/---[\s\S]+?---/, '')))
            .then(html => html && dispatch(setAboutHTML(html)) && dispatch(setAboutIsRemote(true)))
        }
    }

var stuPredictPending = false;
export const fetchStuPredict = (cls, data) =>
    (dispatch, getState) => {
        if(stuPredictPending) {
            return;
        }
        stuPredictPending = true;
        fetch(umap.predict_base64, {
            method: 'POST',
            headers: {'content-type': 'application/json;charset=utf-8'},
            body: JSON.stringify({cls, data})
        })
        .then(res=>res.json())
        .then(data=> {
            stuPredictPending = false;
            !toastError(data) && uShowToast('我们认为你是'+data.result+'号学生', 'success')
        })
    }

export const fetchStuInfo = (id, pwd) => 
    (dispatch, getState)=>
        fetch(umap.stuInfo+'?'+urlStringify({id, pwd}))
        .then(res=>res.json())
        .then(data=> !toastError(data) 
            ? dispatch(setFaceInStuInfo(data.result)) 
            : dispatch(clearFaceInStuInfo()) )


export const fetchFaceImportList = (stuno, pwd) => 
    (dispatch) => 
        fetch(umap.face_import_get+stuno+'?'+urlStringify({pwd}))
        .then(r => r.json())
        .then(json => !toastError(json) 
            ? dispatch(setFaceInFaces(json.result))
            : dispatch(setFaceInFaces([])) )

export const fetchFaceImport = (data, stuno, stupwd) => 
    (dispatch, getState) => {
        dispatch(setFaceInImporting(true));
        dispatch(showLoading('上传样本中...'));
        fetch(umap.face_import, {
            method: 'POST',
            headers: {'content-type': 'application/json;charset=utf-8'},
            body: JSON.stringify({data, stupwd, stuno})
        })
        .then(res => res.json())
        .then(json=> {
            dispatch(setFaceInImporting(false));
            dispatch(hideLoading());
            !toastError(json) && dispatch(setFaceInCameraData(data)) 
            && dispatch(appendFaceInFace({
                face_url: json.result.url,
                hash: json.result.hash
            }))
        })
    }

export const fetchFaceImportDelete = (hash, stuno, pwd) => 
    (dispatch, getState) => {
        fetch(umap.face_import_delete, {
            method: 'POST',
            headers: {'content-type': 'application/json;charset=utf-8'},
            body: JSON.stringify({hash, pwd, stuno})
        })
        .then(res => res.json())
        .then(json=> !toastError(json) 
            && uShowToast(json.result, 'success')
            && dispatch(delFaceInFace(hash))
        )
    }

export const feachDelFaceInAllFaces = (stuno, pwd) => 
    (dispatch, getState) => 
        fetch(umap.face_import_delete, {
            method: 'POST',
            headers: {'content-type': 'application/json;charset=utf-8'},
            body: JSON.stringify({hash: '*', pwd, stuno})
        })
        .then(res => res.json())
        .then(json=> !toastError(json) 
            && uShowToast(json.result, 'success')
            && dispatch(setFaceInFaces([]))
        )

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

export const setFaceInSrc = (src) => _type("SWITCH_FACE_IN_SRC", {src});
export const setFaceInCameraData = (data) => _type("SET_FACE_IN_CAMERA_DATA", {data});
export const setFaceInId = (id) => _type("SET_FACE_IN_ID", {id});
export const setFaceInPwd = (pwd) => _type("SET_FACE_IN_PWD", {pwd});
export const setFaceInImporting = (importing) => _type("SET_FACE_IN_IMPORTING", {importing});
export const setFaceInFileData = (data) => _type("SET_FACE_IN_FILE_DATA", {data});
export const clearFaceInStuInfo = () => _type('CLEAR_FACE_IN_STUINFO', {});
export const setFaceInStuInfo = (info) => _type("SET_FACE_IN_STUINFO", {...info});
export const setFaceInFaces = (faces) => _type("SET_FACE_IN_FACES", {faces});
export const appendFaceInFace = (face) => _type("APP_FACE_IN_FACE", {face});
export const delFaceInFace = (hash) => _type("DEL_FACE_IN_FACE", {hash});

export const setAboutHTML = html => _type("SET_ABOUT_HTML", {html})
export const setAboutIsRemote = isRemote => _type("SET_ABOUT_ISREMOTE", {isRemote})

export const setAdminPwd = password => _type('SET_ADMIN_PWD', {password});
export const setAdminUser = username => _type('SET_ADMIN_USER', {username});
export const fetchAdminLogin = (user='', pwd='') => 
    dispatch => {
        if(!pwd.trim() || !user.trim()) {
            uShowToast('用户名与密码不能空');
            return;
        }
        dispatch(showLoading('管理员登录中...'));
        fetch('/api/do/admin/login', {
            method: 'POST',
            headers: {
                'content-type': 'application/json;charset=utf-8',
                'auth': md5Hex(JSON.stringify({pwd, user}))
            }            
        }).then(r => r.json())
        .then(json=> dispatch(hideLoading()) && !toastError(json) && dispatch(adminLogined()) && uShowToast(json.result, 'success'))
    }

export const checkAdminLogined = (headers) =>
    (dispatch, getState) => {
        const state = getState();
        const pwd = state.admin.password, user = state.admin.username;
        return fetch('/api/do/admin/getname', {
            method: 'POST',
            headers: {
                ...headers,
                'content-type': 'application/json;charset=utf-8',
                'auth': md5Hex(JSON.stringify({pwd, user}))
            }
        }).then(r => {
            return r.json();
        })
        .then(json=> {
            if(json.code === 200) {
                dispatch(setAdminUser(json.result))
                dispatch(adminLogined())
            } else {
                dispatch(adminNotLogined())
            }
        }).catch(e=>{
            console.error(e);
        })
    }

export const fetchAdminFaceImportList = (stuno='') => 
    (dispatch, getState) => {
        stuno = stuno.trim();
        if (!stuno) {
            return;
        }
        const state = getState();
        const pwd = state.admin.password, user = state.admin.username;
        fetch('/api/get/face-import/admin/'+stuno.trim(), {
            headers: {'auth': md5Hex(JSON.stringify({pwd, user}))}
        }).then(r => r.json())
        .then(json=> {
            if(!toastError(json)) {
                if(json.result.length === 0) {
                    uShowToast('未发现样品图片');
                } else {
                    dispatch(
                        setAdminFaceInPhotos(
                            json.result.map(x=> {
                                return {
                                    key: x.hash,
                                    url: x.face_url,
                                    onClose: ()=>{uShowModal('确定删除该样本吗？', () => {
                                        dispatch(fetchDelAdminFaceInPhoto(x.hash))
                                        dispatch(delAdminFaceInPhoto(x.hash))
                                    })}
                                }
                            }
                        ))
                    )
                }
                
            }
        })
    }

export const fetchDelAdminFaceInPhoto = (hash='') => 
    (dispatch, getState) => {
        hash = hash.trim();
        if(!hash) {
            return;
        }
        const state = getState();
        const pwd = state.admin.password, user = state.admin.username;
        fetch('/api/do/admin/del-face/'+hash, {
            method: 'POST',
            headers: {
                'content-type': 'application/json;charset=utf-8',
                'auth': md5Hex(JSON.stringify({pwd, user}))
            }
        }).then(r => r.json())
        .then(json => !toastError(json) && uShowToast(json.result))
    }

export const adminLogout = () =>
    dispatch => 
        dispatch(showLoading()) &&
        fetch('/api/do/admin/logout', {method: 'POST'})
        .then(r => r.json())
        .then(json => 
            uShowToast(json.result, 'success') && dispatch(setAdminPwd(''))
            && dispatch(adminNotLogined()) && dispatch(hideLoading())
        )

export const fetchAdminStuInfo = (stuno='') => 
    (dispatch, getState) => {
        stuno = stuno.trim();
        if(!stuno) {
            return;
        }
        const state = getState();
        const pwd = state.admin.password, user = state.admin.username;
        fetch('/api/get/stu-info/admin/'+stuno, {headers: {'auth': md5Hex(JSON.stringify({pwd, user}))}})
        .then(r => r.json())
        .then(json => 
            !toastError(json) 
            && dispatch(setAdminStuInfo({
                img: json.result.face_url,
                keys: ['姓名', '学号', '级别', '学院', '性别', '生日', '在校地址'],
                vals: [
                    json.result.name, stuno, json.result.rank, json.result.department,
                    json.result.gender, json.result.birth, json.result.address
                ],
            }))
        )
    }


export const adminLogined = () => _type('SET_ADMIN_ISLOGIN', {isLogined: true});
export const adminNotLogined = () => _type('SET_ADMIN_ISLOGIN', {isLogined: false});
export const setAdminSrc = (src) => _type('SET_ADMIN_SRC', {src});
export const setAdminFaceInPhotos = (photos) => _type('SET_ADMIN_FACEIN_PHOTOS', {photos});
export const setAdminFaceInId = (id) => _type('SET_ADMIN_FACEIN_ID', {id});
export const delAdminFaceInPhoto = (key) => _type('DEL_ADMIN_FACEIN_PHOTO', {key});
export const setAdminStuInfo = (info) => _type('SET_ADMIN_STUINFO', {info});
export const setAdminStuInfoId = (id) => _type('SET_ADMIN_STUINFO_ID', {id});

export const hideToast = () => _type("HIDE_TOAST");
export const showToast = (text, tp="error") => _type("SHOW_TOAST", {tp, text});
export const showLoading = (loadingText='') => _type('SET_LOADING', {loading: true, loadingText});
export const hideLoading = () => _type('SET_LOADING', {loading: false});
export const showModal = (content, onOk, onCancel, title="", size="sm") => _type("SHOW_MODAL", {onOk, onCancel, content, title, size});
export const hideModal = () => _type("HIDE_MODAL");
