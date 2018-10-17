import React, { Component } from 'react';
import Hakunavigaatio from '../hakutulos/Hakunavigaatio';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { inject, observer } from 'mobx-react';
import { Localizer as l } from "../../tools/Utils";
import qs from 'querystring';
import '../../assets/styles/components/_vertailu.scss';

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
            oids.split(',')
                .forEach((oid) => this.props.vertailuStore.selectItem(oid));
        }
    }
    colors = ["green", "gold", "blue"];

    renderComparedItems() {
        return this.props.vertailuStore.vertailuList.map((item, i) => {
            return (
                <div className="col-md-3">
                    <ul className={"compare-list " + this.colors[i]} key={item.oid}>
                        <li className={"compared-items"} >
                            <div className="compare-box">
                                <Link to={item.link} className="title">
                                    <strong>{item.organisaatio ? item.organisaatio.nimi + ":" : ""}<br/>{l.localize(item.searchData, item.nimi)}</strong>
                                </Link>
                            </div>
                        </li>
                        {this.renderCompareItemFields(item)}
                    </ul>
                </div>
            )
        })
    }
    renderCompareItemFields(item) {
        return (
            <React.Fragment>
                <li className="compare-list-item">
                    <div className="inner"/>
                    <p>{l.localize(item.koulutuksenAlkamiskausi) + " " + item.koulutuksenAlkamisvuosi}</p></li>
                <li className="compare-list-item">
                    <div className="inner"/>
                    <p>{item.opetuskielis && item.opetuskielis.map((k) => l.localize(k)).join(', ')}</p></li>
                <li className="compare-list-item">
                    <div className="inner"/>
                    <p>{l.localize(item.opintojenLaajuusarvo, "", "fi") + " " + l.localize(item.opintojenLaajuusyksikko)}</p></li>
                <li className="compare-list-item">
                    <div className="inner"/>
                    <p>{item.suunniteltuKestoArvo + " " + l.localize(item.suunniteltuKestoTyyppi)}</p></li>
                <li className="compare-list-item">
                    <div className="inner"/>
                    <p>{l.localize(item.opintoala)} </p></li>
                <li className="compare-list-item">
                    <div className="inner"/>
                    <p>{item.opetusAikas && item.opetusAikas.map((i) => l.localize(i)).join(', ')}</p></li>
                <li className="compare-list-item">
                    <div className="inner"/>
                    <p>{item.opetusPaikkas && item.opetusPaikkas.map((i) => l.localize(i)).join(', ')}</p></li>
                <li className="compare-list-item">
                    <div className="inner"/>
                    <p>{item.opetusmuodos && item.opetusmuodos.map((i) => l.localize(i)).join(', ')}</p></li>
                <li className="compare-list-item">
                    <div className="inner"/>
                    <p>{l.localize(item.pohjakoulutusvaatimukset) || l.localize(item.pohjakoulutusvaatimus)}</p></li>
                <li className="compare-list-item">
                    <div className="inner"/>
                    <p>{item.opintojenMaksullisuus ? this.props.t("vertailu.maksullinen") : this.props.t("vertailu.maksuton")}
                    </p>
                </li>
            </React.Fragment>
        )
    }
    render() {
        const t = this.props.t;
        return (
            <React.Fragment>
                <div className="container">
                    <div className="row">
                        <div className="compare">
                            <h1>
                                <Link to={this.state.hakuUrl} className="header" >
                                    <span className="light-font">{t("vertailu.takaisin-edelliselle-sivulle")}</span>
                                    <p>{t("vertailu.vertailuun-ottamasi-kohteet")}</p>
                                </Link>
                            </h1>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row compare-page">
                        <div className="col-md-3">
                            <ul className="compare-list subject-titles">
                                <li className="compared-items">
                                    <div className="compare-box no-content"></div>
                                </li>
                                <li className="compare-list-item"><p>{t("vertailu.koulutus-alkaa")}</p></li>
                                <li className="compare-list-item"><p>{t("vertailu.opetuskieli")}</p></li>
                                <li className="compare-list-item"><p>{t("vertailu.koulutuksen-laajuus")}</p></li>
                                <li className="compare-list-item"><p>{t("vertailu.suunniteltu-kesto")}</p></li>
                                <li className="compare-list-item"><p>{t("vertailu.osaamisalat")}</p></li>
                                <li className="compare-list-item"><p>{t("vertailu.opetusaika")}</p></li>
                                <li className="compare-list-item"><p>{t("vertailu.opetustapa")}</p></li>
                                <li className="compare-list-item"><p>{t("vertailu.opiskelumuoto")}</p></li>
                                <li className="compare-list-item"><p>{t("vertailu.pohjakoulutus")}</p></li>
                                <li className="compare-list-item"><p>{t("vertailu.maksullinen")}</p></li>
                            </ul>
                        </div>
                            
                        {this.renderComparedItems()}
                        </div>
                </div>
                
                <Hakunavigaatio vertailu={true}/>
            </React.Fragment>
        );
    }
}

export default Vertailu;