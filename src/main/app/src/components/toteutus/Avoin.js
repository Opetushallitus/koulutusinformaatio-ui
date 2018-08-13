import React, { Component } from 'react';
import { Localizer as l } from '../../tools/Utils';
import KoulutusInfoBoxTwoSided from './KoulutusInfoBoxTwoSided';
import KoulutusSidebar from "./KoulutusSidebar";
import {translate} from 'react-i18next';
import {inject} from "mobx-react";
import ToteutusHeader from "./ToteutusHeader";
import KoulutusSection from "../koulutus/KoulutusSection";

@translate()
@inject("hakuStore")
class Avoin extends Component {

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
    }

    parseKuvaus() {
        if(this.props.result && this.props.result.kuvausKomoto && this.props.result.kuvausKomoto.SISALTO) {
            return l.localize(this.props.result.kuvausKomoto.SISALTO);
        }

        if(this.props.result && this.props.result.kuvausKomo && this.props.result.kuvausKomo.TAVOITTEET) {
            return l.localize(this.props.result.kuvausKomo.TAVOITTEET);
        }
        return "";
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
        
        fields.push([t('koulutus.opintopisteet'), this.props.result.opintopisteet ? this.props.result.opintopisteet : ""]);
        fields.push([t('koulutus.koulutusohjelma'), l.localize(this.props.result.koulutusohjelma)]);
        fields.push([t('koulutus.opetuskielet'), this.props.result.opetuskielis ? this.props.result.opetuskielis.map(kieli => l.localize(kieli)) : ""]);
        fields.push([t('koulutus.suoritustavat'), this.props.result.opetusPaikkas ? this.props.result.opetusPaikkas.map(paikka => l.localize(paikka)): ""]);
        fields.push([t('koulutus.toimipiste'), this.props.result.toimipiste ? this.props.result.toimipiste : ""]);
        fields.push([t('koulutus.ajoitus'), this.props.result.ajoitus ? this.props.result.ajoitus : ""]);
        fields.push([t('koulutus.opetusajat'), this.props.result.opetusAikas? this.props.result.opetusAikas.map(aika => l.localize(aika)) : ""]);

        console.log("Kenttiä:" + fields.length)
        return fields;
    }

    render() {
        const {t} = this.props;
        const kuvaus = this.parseKuvaus();
        return (
            <div className="container">
                <div className="row info-page">
                    <div className="col-xs-12 col-md-9 left-column">
                        <ToteutusHeader komoOid={this.props.result.komoOid}
                                        nimi={this.props.result.searchData.nimi}
                                        organisaatio={this.props.result.organisaatio.nimi}/>
                        <KoulutusInfoBoxTwoSided fields={this.parseInfoBoxFieldsTwoSided()}/>
                        <KoulutusSection content={kuvaus} header="koulutus.yleiskuvaus"/>
                    </div>
                    <KoulutusSidebar/>
                </div>
            </div>
        );
    }
}

export default Avoin;