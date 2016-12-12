const request = require('http').request
const FormData = require('form-data')

const spider = require('./spider')

const api_key = "I4RH5IHCM6qak-wt3dHuva0JB1D4WPvv"
const api_secret = "2ye0IiKDWqIA_nCGZT1jA2YaBSlkOZrw"

const DETECT_URL = "https://api-cn.faceplusplus.com/facepp/v3/detect"
const FACESET_CREATE_URL = "https://api-cn.faceplusplus.com/facepp/v3/faceset/create"
const FACESET_ADDFACE_URL = "https://api-cn.faceplusplus.com/facepp/v3/faceset/addface"

const _keySecret = (obj)=> {
    return {
        ...obj,
        api_key,
        api_secret
    }
}

const facepp = {
    detectImgUrl(image_url) {
        return spider.post(DETECT_URL, _keySecret({image_url}))
        // .then(text=>JSON.parse(text))
        .then(console.log)
        .catch(console.error)
    },

    faceSetCreate(display_name, outer_id) {
        return spider.post(FACESET_CREATE_URL, _keySecret({display_name, outer_id}))
        .then(console.log)
        .catch(console.error)
    },

    faceSetAddFace(outer_id, face_tokens) {
        return spider.post(FACESET_ADDFACE_URL, _keySecret({display_name, outer_id}))
        .then(console.log)
        .catch(console.error)
    }
}



module.exports = facepp