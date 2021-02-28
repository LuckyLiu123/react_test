import React, { Component } from 'react'
import Router from '@/routes'

export default class extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return (<div>
            <div className="header">
                <p>头部</p>
            </div>
            <div className="main-layout">
                <div>
                    <Router/>
                </div>
            </div>
        </div>)
    }
}