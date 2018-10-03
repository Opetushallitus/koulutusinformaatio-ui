import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {translate} from 'react-i18next';
import { inject, observer } from 'mobx-react';
import { Localizer as l} from "../../tools/Utils";

@translate()
@inject("vertailuStore")
@observer
class VertailuBox extends Component {

    renderVertailuList() {
        return this.props.vertailuStore.vertailuList.map((i) =>
            <div className="col-12 col-md-3 compare-box" id="box-0" key={i.oid}>
                <button type="button" className="close" aria-label="Close"
                        onClick={() => this.props.vertailuStore.removeItem(i.oid)}>
                    <i className="fa fa-times" aria-hidden="true"/>
                </button>
                <Link to={i.link} className="title"><strong>{l.localize(i.searchData, i.nimi)}</strong></Link>
            </div>)
    }

    render() {
        return (
            <React.Fragment>
                {this.props.vertailuStore.size &&
                <div className="container-fluid" id="compare-row">
                    <div className="container">
                        <div className="row">
                            <div id="compared-subjects">
                                <div className="col-12 col-md-3 compared-subjects-title">{this.props.t("haku.olet-valinnut-vertailuun")}</div>
                                {this.renderVertailuList()}
                            </div>
                            <div className="col-12 col-md-3 pull-right">
                                {this.props.vertailuStore.size > 1 ?
                                    <Link to={this.props.vertailuStore.createVertailuLink} id={"vertaile"}
                                          role="button" className="btn btn-primary">{this.props.t("haku.vertaile")}</Link>
                                    :
                                    <a className="btn btn-primary disabled">{this.props.t("haku.vertaile")}</a>}
                                <a className="clear-compare" onClick={this.props.vertailuStore.clearItems}>{this.props.t("haku.poista-kaikki")}</a>
                            </div>
                        </div>
                    </div>
                </div>}
            </React.Fragment>)
    }
}

export default VertailuBox;