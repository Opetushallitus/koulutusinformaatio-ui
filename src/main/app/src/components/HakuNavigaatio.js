import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import '../assets/css/hakutulos.css'

class HakuNavigaatio extends Component {

    constructor(props){
        super(props);
        this.state = {
          selected: props.selected,
          hakuUrl: props.haku ? props.haku : "/haku"
        };
    }

    render() {
        return (
            <div class="container-fluid app-navigation-bar hakupalkki">
                <div class="container">
                    <div class="row">
                        <div class="col-xs-4 previous">
                            {/*<a href="#"> Poistettu 1. demoversiosta
                                <i class="fa fa-circle-thin" aria-hidden="true"/>
                            </a>*/}
                        </div>
                        <div class="col-xs-4 search">
                            <Link to={{ pathname: this.state.hakuUrl}}>
                                <i class="fa fa-circle-thin" aria-hidden="true"/>
                            </Link>
                        </div>
                        <div class="col-xs-4 next">
                            {/*<a href="#"> Poistettu 1. demoversiosta
                                <i class="fa fa-circle-thin" aria-hidden="true"/>
                            </a>*/}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HakuNavigaatio;