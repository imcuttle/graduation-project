import React from 'react'
import {render} from 'react-dom'
import { bindActionCreators } from 'redux'
import {Link} from 'react-router'
import { connect } from 'react-redux'
import {Map} from 'immutable'

import Jumbotron from './components/Jumbotron'
import Header from './components/Header'
import Toast from './components/Toast'

const utils = require('./common/utils')

class App extends React.Component {
    constructor(props) {
        super(props);
        this.getHeaderPorps = this.getHeaderPorps.bind(this)
    }

    static contextTypes={
        router: React.PropTypes.object.isRequired
    }
    
    componentDidMount() {
        const {actions, state} = this.props
        setTimeout(utils.showToast.bind(null, actions, '欢迎来到学生签到系统', 'success'), 100)
        
    }
    getHeaderPorps() {
        const {actions, state} = this.props
        const {router} = this.context
        const {active} = state
        const {title, path} = active;    const titlePath = {
            '学生签到': '/',
            '关于': '/about'
        }
        const dataMap = (text)=> {
            return {
                text,
                active: title===text, onClick: title===text?null:()=>{router.push(titlePath[text])} 
            }
        }
        
        
        return {
            leftItems: [dataMap('学生签到')],
            rightItems: [ dataMap('关于'),  {text: '管理员入口', type: 'btn'}]
        }
    }
    componentWillReceiveProps(nextProps) {
        const {actions, state, location} = nextProps
        const {active} = state
        const {path} = active
        const {pathname} = location
        
        if(pathname!==path) {

            actions.pushRoute(pathname)
        }
    }

    render() {
        const {children} = this.props
        const {actions, state} = this.props
        const {active, base} = state
        const {path, ...other} = active
        const {toast} = base
        const {text, show, type} = toast

        return (
            <div>
                <Toast {...toast}/>
                <Header {...this.getHeaderPorps()}/>
                <Jumbotron {...other}/>
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