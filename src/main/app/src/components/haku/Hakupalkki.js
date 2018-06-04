import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Hakurajain from './Hakurajain';
import {observer, inject} from 'mobx-react';

@inject ("hakuStore")
@observer
class Hakupalkki extends Component {

    constructor(props){
        super(props);
        this.state = {
            input: '',
            redirect: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.filterAction = this.filterAction.bind(this);
    }

    isValidKeyword() {
        return this.state.input && this.state.input.length > 2;
    }

    handleChange(event) {
        this.setState({input: event.target.value})
    }

    handleSubmit(event) {
        if(this.isValidKeyword() || this.props.hakuStore.filterSet) {
            this.props.hakuStore.updateFilterSet();
            this.props.hakuStore.keyword = this.state.input;
            if(this.props.searchAction) {
                this.props.searchAction()
            } else {
                this.setState({redirect: true})
            }
       } else {
            event.preventDefault();
        }
    }

    filterAction() {
        this.props.hakuStore.updateFilterSet();
        if(this.props.searchAction) {
            this.props.searchAction(true)
        } else {
            this.setState({redirect: true})
        }
    }

    render() {
        if(this.state.redirect) {
            return <Redirect push to={this.props.hakuStore.createHakuUrl}/>
        }
        return (
            <React.Fragment>
                <div className="container-fluid" id={this.props.main ? "call-to-action" : "call-to-action-secondary"}>
                    <div className="jumbotron">
                        <div className="container">
                            <div className="row">
                                <div className={"col-xs-12 col-md-8 header-search" + (this.props.main ? " main" : "")}>
                                    <div className="search">
                                        <input id="regular-input" className="oph-input" type="text"
                                               placeholder="Etsi ja vertaile koulutuksia ja oppilaitoksia"
                                               defaultValue={this.props.hakuStore.keyword}
                                               onChange={this.handleChange} onKeyPress={(e) => { if(e.key === 'Enter'){ this.handleSubmit(e)}}}/>
                                        <a role="button" onClick={this.handleSubmit} className="search-button">ETSI</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Hakurajain filterAction={this.filterAction}/>
            </React.Fragment>
        );
    }
}

export default Hakupalkki;