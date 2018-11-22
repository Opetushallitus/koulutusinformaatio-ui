import React, { Component } from 'react';
import Hakupalkki from './haku/Hakupalkki'
import { Route } from 'react-router-dom'
import {observer, inject} from 'mobx-react';

@inject("hakuStore")
@inject("hakuehtoStore")
@observer
class Etusivu extends Component {

    componentDidMount() {
        this.props.hakuehtoStore.clearHakuehdot();
        this.props.hakuStore.clearHaku();
    }

    render() {
        return (
            <Route exact path='/' render={() => <Hakupalkki main={true}/>}/>
        );
    }
}

export default Etusivu;