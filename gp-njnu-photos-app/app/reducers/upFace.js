import {Map, List} from 'immutable'
const db = require('../common/storage')

const initState={
	activeSrc: 'camera',
	searchText: db.get('search-text') || '',
	searching: false,
	camera: {
		data: ''
	},
	file: {
		uploading: false
	},
	network: {
		uploading: false
	}
}

const updateState = (state, key, subKey, newVal) => {
	let newState = Map(state)
	return newState.set(key, Map(newState.get(key)).set(subKey, newVal).toObject()).toObject()
}

export default function (state=initState, action) {
	let newState = Map(state)
	switch(action.type) {
		case 'SWITCH_UPFACE_SRC':
			return newState.set('activeSrc', action.src).toObject()
		case 'CHANGE_SEARCHTEXT':
			return newState.set('searchText', action.text).toObject()
		case 'SET_CAMERA_DATA': 
			return updateState(state, 'camera', 'data', action.data)
		default:
			return newState.toObject();
	}
}