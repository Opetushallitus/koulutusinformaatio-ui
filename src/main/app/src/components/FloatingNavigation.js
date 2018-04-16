import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import '../assets/css/oph-styles-min.css';
import '../assets/css/styles.css';
import '../assets/css/font-awesome.min.css';
import '../assets/css/bootstrap.min.css';

class FloatingNavigation extends Component {
    render() {
        return (
            <div class="container-fluid app-navigation-bar">
                <div class="container">
                    <div class="row">
                        <div class="col-xs-4 previous">
                            <a href="#">
                                <i class="fa fa-circle-thin" aria-hidden="true"></i>
                            </a>
                        </div>
                        <div class="col-xs-4 search">
                            <Link to={{ pathname: '/search'}} class="search-button">
                                <i class="fa fa-circle-thin" aria-hidden="true"></i>
                            </Link>
                        </div>
                        <div class="col-xs-4 next">
                            <a href="#">
                                <i class="fa fa-circle-thin" aria-hidden="true"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default FloatingNavigation;