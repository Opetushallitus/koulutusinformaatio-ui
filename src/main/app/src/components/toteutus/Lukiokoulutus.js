import React, { Component } from 'react';
import KoulutusInfoBoxTwoSided from './KoulutusInfoBoxTwoSided';
// import OppilaitoksetBox from './OppilaitoksetBox'
import KoulutusSidebar from './KoulutusSidebar';
import {Localizer as l} from '../../tools/Utils';
import renderHTML from 'react-render-html';
import {translate} from 'react-i18next';
import {Link} from "react-router-dom";
import {inject} from "mobx-react";
import ToteutusHeader from "./ToteutusHeader";
import KoulutusSection from "../koulutus/KoulutusSection";

@translate()
@inject("hakuStore")
class Korkeakoulu extends Component {

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
        // alku, kieli, laajuus, kesto, muoto, pohja
        const aloitusPvm = new Date(Number(this.props.result.koulutuksenAlkamisPvms[0]));
        fields.push([t('koulutus.alkaa'), aloitusPvm.getDate() + "." + (aloitusPvm.getMonth() + 1) + "." + aloitusPvm.getFullYear()]);

        fields.push([t('koulutus.opetuskieli'), l.localize(this.props.result.opetuskielis[0])]);

        const opintojenLaajuusarvo = l.localize(this.props.result.opintojenLaajuusarvo, '-');
        const opintojenLaajuusyksikko = l.localize(this.props.result.opintojenLaajuusyksikko);
        fields.push([t('koulutus.laajuus'), opintojenLaajuusarvo && (opintojenLaajuusarvo + " " + opintojenLaajuusyksikko)]);

        const suunniteltuKesto = this.props.result.suunniteltuKestoArvo;
        const suunniteltuKestoTyyppi = l.localize(this.props.result.suunniteltuKestoTyyppi);
        fields.push([t('koulutus.kesto'), suunniteltuKesto + " " + suunniteltuKestoTyyppi]);

        fields.push([t('koulutus.opiskelumuoto'), this.props.result.opetusmuodos.map(t => l.localize(t) + " ")]);
        fields.push([t('koulutus.pohjakoulutus'), l.localize(this.props.result.pohjakoulutusvaatimus)]);

        return fields;
    }

    render() {
        const {t} = this.props;
        const sisalto = l.localize(this.state.result.kuvausKomo.KOULUTUKSEN_RAKENNE, undefined);
        const erikoistumisalat = l.localize(this.state.result.kuvausKomo.TAVOITTEET, undefined);
        return (
            <div className="container">
                <div className="row info-page">
                    <div className="col-xs-12 col-md-9 left-column">
                        <ToteutusHeader komoOid={this.state.result.komoOid}
                                        nimi={this.props.result.searchData.nimi}
                                        organisaatio={this.state.result.organisaatio.nimi}/>
                        <div className="row">
                            <div className="col-xs-12 left-column">
                                <KoulutusInfoBoxTwoSided fields={this.parseInfoBoxFieldsTwoSided()}/>
                            </div>
                        </div>

                        <KoulutusSection content={sisalto} header="koulutus.sisältö"/>
                        <KoulutusSection content={erikoistumisalat} header="koulutus.pääaineet"/>
                    </div>
                    <KoulutusSidebar/>
                </div>
            </div>
        );
    }
}

export default Korkeakoulu;