import React, { Component } from 'react';
import Hakupalkki from './haku/Hakupalkki'
import { Route } from 'react-router-dom'
import {observer, inject} from 'mobx-react';

@inject("hakuStore")
@inject("hakuehtoStore")
@observer
class Etusivu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFilterDisplayed: false
        };
        this.moveMainContent = this.moveMainContent.bind(this);
    }

    componentDidMount() {
        this.props.hakuehtoStore.clearHakuehdot();
        this.props.hakuStore.clearHaku();
    }

    moveMainContent() {
        this.setState({
            isFilterDisplayed: !this.state.isFilterDisplayed            
        })
    }

    render() {
        let moveMainContent =  this.state.isFilterDisplayed; 
        return (
            <React.Fragment>
                <Route exact path='/' render={() => <Hakupalkki isRajainVisible={this.moveMainContent} main={true}/>}/>
                <div id="main-content" className={`container ${moveMainContent ? "move-right" : "center-content"}`}>
                </div>
            </React.Fragment>
        );  
    }
}

export default Etusivu;