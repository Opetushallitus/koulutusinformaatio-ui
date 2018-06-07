import React, { Component } from 'react';
import Hakurajain from './Hakurajain';
import {observer, inject} from 'mobx-react';
import { Link, withRouter } from 'react-router-dom'

@inject ("hakuStore")
@observer
class Hakupalkki extends Component {

    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        if(event.target.value) {
            this.props.hakuStore.keyword = event.target.value
        } else {
            this.props.hakuStore.keyword = ''
        }
    }

    handleSubmit(event) {
        this.handleChange(event)
        event.preventDefault();
        this.props.history.push(this.props.hakuStore.createHakuUrl);
    }

    render() {
        const link = '/haku/' + this.props.hakuStore.keyword;
        const search = this.props.hakuStore.search;
        const value = this.props.hakuStore.keyword ? this.props.hakuStore.keyword : '';
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
                                               value={value}
                                               onChange={this.handleChange}
                                               onKeyPress={(e) => { if(e.key === 'Enter'){ this.handleSubmit(e)}}}/>
                                        <Link role="button" to={{
                                            pathname: link,
                                            search: search
                                        }} className="search-button">ETSI</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Hakurajain/>
            </React.Fragment>
        );
    }
}

export default withRouter(Hakupalkki);