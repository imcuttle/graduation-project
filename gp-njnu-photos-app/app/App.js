import React from 'react'
import {render} from 'react-dom'
import { bindActionCreators } from 'redux'
import {Link} from 'react-router'
import { connect } from 'react-redux'
import {Map} from 'immutable'

import Jumbotron from './components/Jumbotron'
import Header from './components/Header'
import Toast from './components/Toast'
import Modal from './components/Modal'
import Loading from './components/Loading'

// global tracking
import 'tracking'
import 'tracking/build/data/face'

const utils = require('./common/utils')

class App extends React.Component {
    constructor(props) {
        super(props);
        this.getHeaderPorps = this.getHeaderPorps.bind(this)
    }

    
    componentWillMount() {
        const {actions, state} = this.props
        actions.checkAdminLogined();
    }

    componentDidMount() {
        const {actions, state} = this.props
        window.actions = actions;
        setTimeout(utils.showToast.bind(null, '欢迎来到学生签到系统', 'success'), 120)
    }
    getHeaderPorps() {
        const {actions, state} = this.props
        const {router} = this.context
        const {active, admin} = state;
        const {isLogined, username} = admin;
        const {title, path} = active;    
        const titlePath = {
            '学生签到': '/',
            '关于': '/about',
            '语音录入': '/audio-import',
            '人脸录入': '/face-import',
            '管理员入口': '/admin/login'
        }
        titlePath[username] = '/admin';
        const dataMap = (text, type, disabled=false, click)=> {
            return {
                text,
                type,
                active: title===text, 
                onClick: (title===text||disabled)?null
                    : ( typeof click === 'function' ? click : ()=>router.push(titlePath[text]) ) 
            }
        }
        let rightItems = [ dataMap('关于') ];
        rightItems = rightItems.concat(
            !isLogined 
            ? dataMap('管理员入口', 'btn')
            : [dataMap(username, null), dataMap('退出', null, false, e=>actions.adminLogout())]
        )
        
        return {
            leftItems: [dataMap('学生签到'), dataMap('人脸录入')/*, dataMap('语音录入')*/],
            rightItems
        }
    }
    componentWillReceiveProps(nextProps) {
        const {actions, state, location} = nextProps
        const {active} = state
        const {path} = active
        const {pathname} = location
        // debugger;
        if(pathname!==path) {
            actions.pushRoute(pathname);
        }
    }

    render() {
        const {children} = this.props
        const {actions, state} = this.props
        const {active, base} = state
        const {path, ...other} = active
        const {toast, modal, loading} = base
        const {text, show, type} = toast
        // const {size, content, title, show} = modal
        return (
            <div>
                {loading && <Loading />}
                <Toast {...toast}/>
                <Modal {...modal} />
                <Header logo="南师大刷脸签到系统" {...this.getHeaderPorps()}/>
                <div className="animated lightSpeedIn"><Jumbotron {...other}/></div>
                {
                    React.Children.map(children, (child, i) =>
                        React.cloneElement(child, Object.assign({
                            key: i,
                        }, {...this.props}))
                    )
                }
            </div>
        )
    }
}

App.contextTypes={
    router: React.PropTypes.object.isRequired
}

function MapStateToProps(state) {
    return {
        state
    }
}

function MapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(require('./reducers/actions'), dispatch)
    }
}

module.exports = connect(
    MapStateToProps,
    MapDispatchToProps
)(App)