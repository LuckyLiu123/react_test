import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Switch, Route } from 'react-router-dom'
import asyncComponent from '@/asyncComponent';

const Layout = asyncComponent(() => import(/* webpackChunkName: "Layout"*/'@/layout'))

ReactDOM.render(
    <HashRouter>
        <Switch>
            <Route key="/Layout" path="/*" component={Layout} />
        </Switch>
    </HashRouter>,
    // <p>Hello World!</p>,
    document.getElementById('root')
)