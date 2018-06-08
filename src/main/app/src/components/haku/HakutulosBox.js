import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import '../../assets/css/hakutulos.css'
import { withRouter } from 'react-router-dom'

class HakutulosBox extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const tyyli = "col-xs-12 search-box " + this.props.tyyppi + (this.props.haettavissa ? " haku" : "");
        return (
            <div key={this.props.oid} className="col-xs-12 col-md-6 box-container">
                <div className={tyyli}>
                    <div className="suosikkit">
                        <i className="fa fa-heart-o" aria-hidden="true"></i>
                    </div>
                    <div className="text">
                        <Link to={this.props.link}>{this.props.nimi}</Link>
                        <p>{this.props.text1}<br/>{this.props.text2}</p>
                    </div>
                    <div className="compare-button">
                        <span role="button"></span>
                    </div>
                </div>
            </div>)
    }
}

export default withRouter(HakutulosBox);