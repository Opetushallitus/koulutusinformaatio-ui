import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/hakutulos.css';
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';
import { inject, observer } from 'mobx-react';


@translate()
@inject("vertailuStore")
@observer
class HakutulosBox extends Component {

    render() {
        const tyyli = "col-xs-12 search-box " + this.props.tyyppi;
        return (
            <div key={this.props.oid} className="col-xs-12 col-md-6 box-container">
                <div className={tyyli}>
                    {this.props.haettavissa && <div className="haku">{this.props.t("haku.haku")}</div>}
                    <div className="suosikkit">
                        <i className="fa fa-heart-o" aria-hidden="true"/>
                    </div>
                    <div className="text">
                        <Link to={this.props.link} className={"hakutulosbox-link"}>{this.props.nimi}</Link>
                        <p>{this.props.text1}<br/>{this.props.text2}</p>
                    </div>
                    {this.props.vertailuStore.vertailuList.findIndex((item) => item.oid === this.props.vertailuOid) !== -1 ?
                        <div className="compare-button" onClick={() => this.props.vertailuStore.removeItem(this.props.vertailuOid)}>
                            <span role="button" className="poista">{this.props.t("haku.poista-vertailusta")}</span>
                        </div>
                        :
                        (this.props.vertailu ?
                            <div className="compare-button" onClick={() => this.props.vertailuStore.selectItem(this.props.vertailuOid, this.props.nimi)}>
                                <span role="button">{this.props.t("haku.ota-vertailuun")}</span>
                            </div>
                            :
                            <div className="compare-button inactive">
                                <span>{this.props.t("haku.ota-vertailuun")}</span>
                            </div>)
                    }
                </div>
            </div>)
    }
}

export default withRouter(HakutulosBox);