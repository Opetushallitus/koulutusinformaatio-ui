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
            oids.split(',')
                .forEach((oid) => this.props.vertailuStore.selectItem(oid));
        }
    }
    colors = ["green", "gold", "blue"];

    renderComparedItems() {
        return this.props.vertailuStore.vertailuList.map((item, i) => {
            return (
                <ul className={"compare-list " + this.colors[i]} key={item.oid}>
                    <li className={"compared-items"} >
                        <div className="compare-box">
                            <Link to={item.link} className="title">
                                <strong>{item.organisaatio.nimi + ":"}<br/>{l.localize(item.searchData, item.nimi)}</strong>
                            </Link>
                        </div>
                    </li>
                    {this.renderCompareItemFields(item)}
                </ul>
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
                    <p>{item.opetuskielis.map((k) => l.localize(k)).join(', ')}</p></li>
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
                    <p>{item.opetusAikas.map((i) => l.localize(i)).join(', ')}</p></li>
                <li className="compare-list-item">
                    <div className="inner"/>
                    <p>{item.opetusPaikkas.map((i) => l.localize(i)).join(', ')}</p></li>
                <li className="compare-list-item">
                    <div className="inner"/>
                    <p>{item.opetusmuodos.map((i) => l.localize(i)).join(', ')}</p></li>
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
                <div className="compare">
                    <h1>
                        <Link to={this.state.hakuUrl} className="header" >
                            <span className="light-font">{t("vertailu.takaisin-edelliselle-sivulle")}</span>
                            <p>{t("vertailu.vertailuun-ottamasi-kohteet")}</p>
                        </Link>
                    </h1>
                </div>
                <ul className="compare-page">
                    <ul className="compare-list">
                        <li className="compare-list-item">{t("vertailu.koulutus-alkaa")}</li>
                        <li className="compare-list-item">{t("vertailu.opetuskieli")}</li>
                        <li className="compare-list-item">{t("vertailu.koulutuksen-laajuus")}</li>
                        <li className="compare-list-item">{t("vertailu.suunniteltu-kesto")}</li>
                        <li className="compare-list-item">{t("vertailu.osaamisalat")}</li>
                        <li className="compare-list-item">{t("vertailu.opetusaika")}</li>
                        <li className="compare-list-item">{t("vertailu.opetustapa")}</li>
                        <li className="compare-list-item">{t("vertailu.opiskelumuoto")}</li>
                        <li className="compare-list-item">{t("vertailu.pohjakoulutus")}</li>
                        <li className="compare-list-item">{t("vertailu.maksullinen")}</li>
                    </ul>
                    {this.renderComparedItems()}
                </ul>
                <Hakunavigaatio/>
            </React.Fragment>
        );
    }
}

export default Vertailu;