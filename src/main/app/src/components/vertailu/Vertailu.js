import React, { Component } from 'react';
import Hakunavigaatio from '../hakutulos/Hakunavigaatio';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { inject, observer } from 'mobx-react';
import { Localizer as l } from "../../tools/Utils";
import qs from 'querystring';

@translate()
@inject("vertailuStore", "hakuStore")
@observer
class Vertailu extends Component {

    constructor(props) {
        super(props);
        const search = qs.parse(this.props.location.search);
        this.state = {
            hakuUrl: search.haku ? search.haku : "/haku"
        };
    }

    componentDidMount() {
        const search = qs.parse(this.props.location.search.slice(1));
        if (search.haku) {
            const splitted = search.haku.split('?');
            if (splitted[1]) {
                const haku = qs.parse(search.haku.split('?')[1]);
                this.props.hakuStore.setToggle(haku.toggle);
            }
        }
        const oids = search.oids;
        if (oids) {
            this.props.vertailuStore.loadVertailuItems(oids.split(','));
        }
    }
    colors = ["green", "gold", "blue"];

    renderComparedItems() {
        return this.props.vertailuStore.vertailuResults.map((item, i) => {
            return (
                <div className={"col-md-3 " + this.colors[i]}  key={item.oid}>
                    <div className="col-xs-11 compare-box pull-right">
                        <button type="button" className="close" aria-label="Close">
                            <i className="fa fa-times" aria-hidden="true"/>
                        </button>
                        <Link to="/koulutus" className="title">
                            <strong>{item.organisaatio.nimi + ":"}<br/>{l.localize(item.searchData)}</strong>
                        </Link>
                    </div>
                </div>
            )
        })
    }
    renderCompareItemFields(item) {
        return (
            <div className={"col-md-3 l-blue-bottom"} key={item.oid}>
                <ul className="list-group">
                    <li className="list-group-item">
                        <div className="inner"/>
                        <p>{l.localize(item.koulutuksenAlkamiskausi) + " " + item.koulutuksenAlkamisvuosi}</p></li>
                    <li className="list-group-item">
                        <div className="inner"/>
                        <p>{item.opetuskielis.map((k) => l.localize(k)).join(', ')}</p></li>
                    <li className="list-group-item">
                        <div className="inner"/>
                        <p>{l.localize(item.opintojenLaajuusarvo, "", "fi") + " " + l.localize(item.opintojenLaajuusyksikko)}</p></li>
                    <li className="list-group-item">
                        <div className="inner"/>
                        <p>{item.suunniteltuKestoArvo + " " + l.localize(item.suunniteltuKestoTyyppi)}</p></li>
                    <li className="list-group-item">
                        <div className="inner"/>
                        <p>{l.localize(item.opintoala)} </p></li>
                    <li className="list-group-item">
                        <div className="inner"/>
                        <p>{item.opetusAikas.map((i) => l.localize(i)).join(', ')}</p></li>
                    <li className="list-group-item">
                        <div className="inner"/>
                        <p>{item.opetusPaikkas.map((i) => l.localize(i)).join(', ')}</p></li>
                    <li className="list-group-item">
                        <div className="inner"/>
                        <p>{item.opetusmuodos.map((i) => l.localize(i)).join(', ')}</p></li>
                    <li className="list-group-item">
                        <div className="inner"/>
                        <p>{l.localize(item.pohjakoulutusvaatimukset) || l.localize(item.pohjakoulutusvaatimus)}</p></li>
                    <li className="list-group-item">
                        <div className="inner"/>
                        <p>{item.opintojenMaksullisuus ? this.props.t("vertailu.maksullinen") : this.props.t("vertailu.maksuton")}</p></li>
                </ul>
            </div>
        )
    }
    render() {
        const t = this.props.t;
        return (
            <React.Fragment>
                <div className="container">
                    <div className="row compare">
                        <div className="col-xs-12">
                            <h1>
                                <Link to={this.state.hakuUrl} className="header" >
                                    <span className="light-font">{t("vertailu.takaisin-edelliselle-sivulle")}</span>
                                    <p>{t("vertailu.vertailuun-ottamasi-kohteet")}</p>
                                </Link>
                            </h1>
                        </div>
                    </div>
                </div>
                <div className="container hidden-xs compare-page">
                    <div className="row compared-items">
                        <div className={"col-md-3"}/>
                        {this.renderComparedItems()}
                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            <ul className="list-group">
                                <li className="list-group-item">{t("vertailu.koulutus-alkaa")}</li>
                                <li className="list-group-item">{t("vertailu.opetuskieli")}</li>
                                <li className="list-group-item">{t("vertailu.koulutuksen-laajuus")}</li>
                                <li className="list-group-item">{t("vertailu.suunniteltu-kesto")}</li>
                                <li className="list-group-item">{t("vertailu.osaamisalat")}</li>
                                <li className="list-group-item">{t("vertailu.opetusaika")}</li>
                                <li className="list-group-item">{t("vertailu.opetustapa")}</li>
                                <li className="list-group-item">{t("vertailu.opiskelumuoto")}</li>
                                <li className="list-group-item">{t("vertailu.pohjakoulutus")}</li>
                                <li className="list-group-item">{t("vertailu.maksullinen")}</li>
                            </ul>
                        </div>
                        {this.props.vertailuStore.vertailuResults.map((item) => this.renderCompareItemFields(item))}
                    </div>
                </div>
                <Hakunavigaatio/>
            </React.Fragment>
        );
    }
}

export default Vertailu;