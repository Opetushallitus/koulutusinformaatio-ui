import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import '../../assets/css/hakutulos.css'

class Hakunavigaatio extends Component {

    constructor(props){
        super(props);
        this.state = {
          selected: props.selected,
          hakuUrl: props.haku ? props.haku : "/haku"
        };
    }

    render() {
        return (
            <div className="container-fluid app-navigation-bar hakupalkki">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-4 previous">
                            {/*<a href="#"> Poistettu 1. demoversiosta
                                <i className="fa fa-circle-thin" aria-hidden="true"/>
                            </a>*/}
                        </div>
                        <div className="col-xs-4 search">
                            <Link to={this.state.hakuUrl}>
                                <i className="fa fa-circle-thin" aria-hidden="true"/>
                            </Link>
                        </div>
                        <div className="col-xs-4 next">
                            {/*<a href="#"> Poistettu 1. demoversiosta
                                <i className="fa fa-circle-thin" aria-hidden="true"/>
                            </a>*/}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Hakunavigaatio;