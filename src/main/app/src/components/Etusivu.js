import React, { Component } from 'react';
import Hakupalkki from './haku/Hakupalkki'
import { Route } from 'react-router-dom'

class Etusivu extends Component {

    render() {
        return (
            <Route exact path='/' render={() => <Hakupalkki main={true}/>}/>
        );
    }
}

export default Etusivu;