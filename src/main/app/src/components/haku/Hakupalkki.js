import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'

class Hakupalkki extends Component {

    constructor(props){
        super(props);
        this.state = {
            input: '',
            redirect: false
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

    render() {
        if(this.state.redirect) {
            return <Redirect push to={'/haku/' + this.state.input}/>
        }
        return (
            <div class="container-fluid" id={this.props.main ? "call-to-action" : "call-to-action-secondary"}>
                <div class="jumbotron">
                    <div class="container">
                        <div class="row">
                            <div class={"col-xs-12 col-md-8 header-search" + (this.props.main ? " main" : "")}>
                                <div class="search">
                                    <input id="regular-input" class="oph-input" type="text" placeholder="Etsi ja vertaile koulutuksia ja oppilaitoksia"
                                           onChange={this.handleChange} onKeyPress={(e) => { if(e.key === 'Enter'){ this.handleSubmit(e)}}}/>
                                    <Link to={'/haku/' + this.state.input} onClick={this.handleSubmit} class="search-button"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*<div class="container"> //TODO rajaimet
                        <div class="row">
                            <div class="col-xs-12">
                                <div class="filter-button" role="button">
                                </div>
                            </div>
                        </div>
                    </div>*/}
                </div>
            </div>
        );
    }
}

export default Hakupalkki;