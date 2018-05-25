import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Hakurajain from './Hakurajain';

class Hakupalkki extends Component {

    constructor(props){
        super(props);
        this.state = {
            input: '',
            redirect: false,
            rajainOpen: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    isValidKeyword() {
        return this.state.input && this.state.input.length > 2;
    }

    handleChange(event) {
        this.setState({input: event.target.value})
    }

    handleSubmit(event) {
        if(this.isValidKeyword()) {
            if(this.props.searchAction) {
                this.props.searchAction(this.state.input)
            } else {
                this.setState({redirect: true})
            }
       } else {
            event.preventDefault();
        }
    }

    openRajain() {
        this.setState({rajainOpen: !this.state.rajainOpen});
        console.log(this.state);
    }

    render() {
        if(this.state.redirect) {
            return <Redirect push to={'/haku/' + this.state.input}/>
        }
        return (
            <div className="container-fluid" id={this.props.main ? "call-to-action" : "call-to-action-secondary"}>
                <div className="jumbotron">
                    <div className="container">
                        <div className="row">
                            <div className={"col-xs-12 col-md-8 header-search" + (this.props.main ? " main" : "")}>
                                <div className="search">
                                    <input id="regular-input" className="oph-input" type="text" placeholder="Etsi ja vertaile koulutuksia ja oppilaitoksia"
                                           onChange={this.handleChange} onKeyPress={(e) => { if(e.key === 'Enter'){ this.handleSubmit(e)}}}/>
                                    <Link to={'/haku/' + this.state.input} onClick={this.handleSubmit} className="search-button"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12">
                        <div className={"filter-button " + (this.state.rajainOpen ? "sulje" : "")} onClick={() => this.openRajain()} role="button">
                        </div>
                    </div>
                </div>
                {this.state.rajainOpen &&
                    <Hakurajain hakuStore={this.props.hakuStore}/>
                }
            </div>
        );
    }
}

export default Hakupalkki;