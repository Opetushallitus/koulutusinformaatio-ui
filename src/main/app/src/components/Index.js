import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import '../assets/css/oph-styles-min.css';
import '../assets/css/styles.css';
import '../assets/css/font-awesome.min.css'
import '../assets/css/bootstrap.min.css'

class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search : ''
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({search: event.target.value});
    }

    render() {
        return (
            <div class="container-fluid" id="call-to-action">
                <div class="jumbotron">
                    <div class="container">
                        <div class="row">
                            <div class="col-xs-12 col-md-8 header-search main">
                                <div class="search">
                                    <input id="regular-input" class="oph-input" type="text" placeholder="Etsi ja vertaile koulutuksia ja oppilaitoksia" onChange={this.handleChange}/>
                                    <Link to={{ pathname: '/search', state: this.state }} class="search-button"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Index;