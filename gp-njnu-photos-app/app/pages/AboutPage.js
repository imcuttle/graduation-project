import React from 'react'
import {render} from 'react-dom'
import Tabs from '../components/TabNav'
import InputGroup from '../components/InputGroup'
import TabNav from '../components/TabNav'
import PhotosFall from '../components/PhotosFall'
import Information from '../components/Information'

const db = require('../common/storage')
const utils = require('../common/utils')


export default class extends React.Component {

    constructor(props) {
        super(props);
    }
    static contextTypes={
        router: React.PropTypes.object.isRequired
    }

    render() {
        const {actions, state} = this.props
        const {about} = state
        const {html} = about;
        return (
            <div style={{backgroundColor: '#fff', padding: '16px 10px'}}>
                <div style={{padding: '20px 34px'}} className="markdown-body animated fadeIn" dangerouslySetInnerHTML={{__html: html}} >
                    
                </div>
            </div>
        )
    }
}
