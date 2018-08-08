import React, { Component } from 'react';
import KoulutusInfoBoxTwoSided from './KoulutusInfoBoxTwoSided';
import KoulutusSidebar from './KoulutusSidebar';
import { Localizer as l } from '../../tools/Utils';
import renderHTML from 'react-render-html';
import {translate} from 'react-i18next'
import {Link} from "react-router-dom";
import {inject} from "mobx-react";

@translate()
@inject("hakuStore")
class Ammatillinen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            oid: props.oid,
            result: props.result,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        this.setState({
            oid: this.props.oid,
            result: this.props.result
        });
    }

    parseNimi() {
        if(this.props.result) {
            return l.localize(this.props.result.searchData.nimi, this.props.t("koulutus.tuntematon"), 'fi')
        }
        return ""
    }

    parseInfoBoxFieldsTwoSided() {
        const {t} = this.props;
        const fields = {};
        fields.left = this.parseInfoBoxFieldsLeft();
        fields.otsikkoLeft = t('koulutus.tiedot');
        fields.hakuajat = this.props.result.hakuajatFromBackend;
        fields.otsikkoRight = t('koulutus.hae-koulutukseen');
        return fields;
    }

    parseInfoBoxFieldsLeft() {
        const {t} = this.props;
        const fields = [];
        // laajuus, kesto, maksullinen, tutkintonimike

        const opintojenLaajuusarvo = l.localize(this.props.result.opintojenLaajuusarvo, '-');
        const opintojenLaajuusyksikko = l.localize(this.props.result.opintojenLaajuusyksikko);
        fields.push([t('koulutus.laajuus'), opintojenLaajuusarvo && (opintojenLaajuusarvo + " " + opintojenLaajuusyksikko)]);
        const suunniteltuKesto = this.props.result.suunniteltuKestoArvo;
        const suunniteltuKestoTyyppi = l.localize(this.props.result.suunniteltuKestoTyyppi);
        fields.push([t('koulutus.kesto'), suunniteltuKesto + " " + suunniteltuKestoTyyppi]);

        fields.push([t('koulutus.maksullinen'), this.props.result.opintojenMaksullisuus ? t('kyllä') : t('ei')]);
        fields.push([t('koulutus.tutkintonimikkeet'), this.props.result.tutkintonimikes ? this.props.result.tutkintonimikes.map(t => l.localize(t) + " ") : '-']);

        return fields;
    }

    render() {
        const {t} = this.props;
        const osaamisalat = l.localize(this.props.result.koulutusohjelma, undefined);
        const tutkinnonOsat = l.localize(this.props.result.kuvausKomo.KOULUTUKSEN_RAKENNE, undefined);
        const erikoistumisalat = l.localize(this.state.result.kuvausKomo.TAVOITTEET, undefined);
        const link = '/koulutus/' + this.state.result.komoOid + '?haku=' + encodeURIComponent(this.props.hakuStore.createHakuUrl)
            + '&lng=' + l.getLanguage();

        const hattuClass = this.props.muu ? "fa fa-circle muu-hattu" : "fa fa-circle ammatillinen-hattu";
        const nimi = this.parseNimi();
        return (
            <div className="container">
                <div className="row info-page">
                    <div className="col-xs-12 col-md-9 left-column">
                        <div className="compare">
                            <h1>
                                <Link to={link} className="header" >
                                    <span className="light-font">{this.state.result.organisaatio.nimi}</span>
                                    <p>{this.parseNimi()}</p>
                                </Link>
                            </h1>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 left-column">
                                <KoulutusInfoBoxTwoSided fields={this.parseInfoBoxFieldsTwoSided()}/>
                            </div>
                        </div>

                        {osaamisalat &&
                        <div className="col-xs-12 col-md-9 left-column">
                            <h2 className="line_otsikko">{t('koulutus.osaamisalat')}</h2>
                            <div className="">
                                <ul>
                                    <li className="osaamisalat_list_item">{osaamisalat}</li>
                                </ul>
                            </div>
                        </div>}

                        {tutkinnonOsat &&
                        <div className="col-xs-12 col-md-9 left-column">
                            <h2 className="line_otsikko">{t('koulutus.sisältö')}</h2>
                            <div className="">
                                {renderHTML(tutkinnonOsat)}
                            </div>
                        </div>}

                        {erikoistumisalat &&
                        <div className="col-xs-12 col-md-9 left-column">
                            <h2 className="line_otsikko">{t('koulutus.pääaineet')}</h2>
                            <div className="">
                                {renderHTML(erikoistumisalat)}
                            </div>

                        </div>}

                    </div>
                    <KoulutusSidebar/>
                </div>
            </div>);
    }
}

export default Ammatillinen;