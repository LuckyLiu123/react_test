import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Switch, } from 'react-router-dom'
import Router from '@/routes'

ReactDOM.render(
    <HashRouter>
        <Switch>
            <Router />
        </Switch>
    </HashRouter>,
    document.getElementById('root')
)