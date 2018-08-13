import React, { Component } from 'react';
import KoulutusInfoBoxTwoSided from './KoulutusInfoBoxTwoSided';
import KoulutusSidebar from './KoulutusSidebar';
import { Localizer as l } from '../../tools/Utils';
import renderHTML from 'react-render-html';
import {translate} from 'react-i18next'
import {Link} from "react-router-dom";
import {inject} from "mobx-react";
import ToteutusHeader from "./ToteutusHeader";
import KoulutusSection from "../koulutus/KoulutusSection";

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

        return (
            <div className="container">
                <div className="row info-page">
                    <div className="col-xs-12 col-md-9 left-column">
                        <ToteutusHeader komoOid={this.state.result.komoOid}
                                        nimi={this.props.result.searchData.nimi}
                                        organisaatio={this.state.result.organisaatio.nimi}/>
                        <KoulutusInfoBoxTwoSided fields={this.parseInfoBoxFieldsTwoSided()}/>
                        {osaamisalat && <KoulutusSection
                            content={<ul><li className="osaamisalat_list_item">{osaamisalat}</li></ul>}
                            header="koulutus.osaamisalat"
                            noRender={true}/>}

                        <KoulutusSection content={tutkinnonOsat} header="koulutus.sisältö"/>
                        <KoulutusSection content={erikoistumisalat} header="koulutus.pääaineet"/>

                    </div>
                    <KoulutusSidebar/>
                </div>
            </div>);
    }
}

export default Ammatillinen;