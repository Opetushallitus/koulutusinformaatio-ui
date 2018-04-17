import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class HakuNavigaatio extends Component {
    render() {
        return (
            <div class="container-fluid app-navigation-bar">
                <div class="container">
                    <div class="row">
                        {/*<div class="col-xs-4 previous"> Poistettu 1. demoversiosta
                            <a href="#">
                                <i class="fa fa-circle-thin" aria-hidden="true"/>
                            </a>
                        </div>*/}
                        <div class="col-xs-4 search">
                            <Link to={{ pathname: '/haku'}}>
                                <button class="search-button">
                                    <i class="fa fa-circle-thin" aria-hidden="true"/>
                                </button>
                            </Link>
                        </div>
                        {/*<div class="col-xs-4 next"> Poistettu 1. demoversiosta
                            <a href="#">
                                <i class="fa fa-circle-thin" aria-hidden="true"/>
                            </a>
                        </div>*/}
                    </div>
                </div>
            </div>
        );
    }
}

export default HakuNavigaatio;