import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Switch, Route, } from 'react-router-dom'
import App from './app'
import Test from './view/test'

ReactDOM.render(
    <Router>
        <Switch>
            <Route path="/app" component={App}/>
            <Route path="/test" component={Test}/>
        </Switch>
    </Router>,
    document.getElementById('root')
)