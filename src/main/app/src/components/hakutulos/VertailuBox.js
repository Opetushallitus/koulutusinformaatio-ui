import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/hakutulos.css';
import { withRouter } from 'react-router-dom';
import {translate} from 'react-i18next';
import { inject, observer } from 'mobx-react';

@translate()
@observer
@inject("vertailuStore")
class VertailuBox extends Component {

    renderVertailuList() {
        return this.props.vertailuList.map((i) =>
            <div className="col-xs-12 col-md-3 compare-box" id="box-0">
                <button type="button" className="close" key={i.oid} aria-label="Close"
                        onClick={this.props.changeSelection}>
                    <i className="fa fa-times" aria-hidden="true"/>
                </button>
                <Link to={i.link} className="title"><strong>{i.name}</strong></Link>
            </div>)
    }

    render() {
        return (
            <div className="container-fluid" id="compare-row">
                <div className="container">
                    <div className="row">
                        <div id="compared-subjects">
                            <div className="col-xs-12 col-md-3 compared-subjects-title">Olet valinnut vertailuun:</div>
                            {this.renderVertailuList()}
                        </div>
                        <div className="col-xs-12 col-md-3 pull-right">
                            <a href="compare.html" role="button" className="btn btn-primary">Vertaile</a>
                            <a className="clear-compare" href="#">Poista kaikki</a>
                        </div>
                    </div>
                </div>
            </div>)
    }
}

export default withRouter(VertailuBox);