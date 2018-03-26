import React, { Component } from 'react';
import Search from "./Search";
import Index from "./Index";
import '../assets/css/oph-styles-min.css';
import '../assets/css/styles.css';
import '../assets/css/font-awesome.min.css'
import '../assets/css/bootstrap.min.css'
import { Switch, Route } from 'react-router-dom'

class Main extends Component {
    render() {
        return (
            <Switch>
                <Route exact path='/' component={Index}/>
                <Route path='/search' component={Search}/>
            </Switch>
        );
    }
}

export default Main;