import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'

class Etusivu extends Component {

    constructor(props) {
        super(props);
        super(props);
        this.state = { keyword : '', redirect: false };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({keyword: event.target.value, redirect: false});
    }

    handleSubmit(event) {
        this.setState({keyword: event.target.value, redirect: true});
    }

    render() {
        if(this.state.redirect) {
            return <Redirect push to={{ pathname: '/haku/' + this.state.keyword}}/>
        }
        return (
            <div class="container-fluid" id="call-to-action">
                <div class="jumbotron">
                    <div class="container">
                        <div class="row">
                            <div class="col-xs-12 col-md-8 header-search main">
                                <div class="search">
                                    <input id="regular-input" class="oph-input" type="text" placeholder="Etsi ja vertaile koulutuksia ja oppilaitoksia"
                                           onChange={this.handleChange} onKeyPress={(e) => { if(e.key === 'Enter'){ this.handleSubmit(e)}}}/>
                                    <Link to={{ pathname: '/haku/' + this.state.keyword }} class="search-button"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Etusivu;