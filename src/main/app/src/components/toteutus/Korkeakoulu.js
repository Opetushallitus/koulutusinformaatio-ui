import React, { Component } from 'react';
import ToteutusInfoBox from './ToteutusInfoBox';
import { Localizer as l } from '../../tools/Utils';
import {translate} from 'react-i18next'
import {inject} from "mobx-react";
import ToteutusHeader from "./ToteutusHeader";
import SlideDropdown from '../common/SlideDropdown';
import ToteutusSidebar from "./ToteutusSidebar";

@translate()
@inject("hakuStore")
class Korkeakoulu extends Component {

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
    }

    parseAineListaus() {
        const {t} = this.props;
        if(this.props.koulutus.oppiaineet.length > 0) {
            return this.props.koulutus.oppiaineet.map(o => <li key={o.oppiaine ? o.oppiaine : ''} className="osaamisalat_list_item">{o.oppiaine ? o.oppiaine : t("tuntematon")}</li>);
        } else {
            return this.props.koulutus.aihees.map(a => <li key={a.uri} className="osaamisalat_list_item">{l.localize(a.nimi)}</li>);
        }
    }

    parseInfoBoxFieldsTwoSided() {
        const {t} = this.props;
        const fields = {};
        fields.left = this.parseInfoBoxFieldsLeft();
        fields.otsikkoLeft = t('koulutus.tiedot');
        fields.hakuajat = this.props.koulutus.hakuajatFromBackend;
        fields.otsikkoRight = t('koulutus.hae-koulutukseen');
        return fields;
    }

    parseInfoBoxFieldsLeft() {
        const {t} = this.props;
        const fields = [];
        // laajuus, kesto, maksullinen, tutkintonimike

        fields.push([t('toteutus.alkaa'), (this.props.koulutus.metadata.opetus.alkamiskausi && this.props.koulutus.metadata.opetus.alkamiskausi.nimi) ? l.localize(this.props.koulutus.metadata.opetus.alkamiskausi.nimi) +" "+ this.props.koulutus.metadata.opetus.alkamisvuosi : '-']);
        fields.push([t('toteutus.opetuskieli'), (this.props.koulutus.metadata.opetus.opetuskieli && this.props.koulutus.metadata.opetus.opetuskieli["0"]) ? l.localize(this.props.koulutus.metadata.opetus.opetuskieli["0"].nimi) : '-']);
        fields.push([t('toteutus.opetusaika'), (this.props.koulutus.metadata.opetus.opetusaika && this.props.koulutus.metadata.opetus.opetusaika.nimi) ? l.localize(this.props.koulutus.metadata.opetus.opetusaika.nimi) : '-']);
        fields.push([t('toteutus.opetustapa'), (this.props.koulutus.metadata.opetus.opetustapa && this.props.koulutus.metadata.opetus.opetustapa["0"]) ? l.localize(this.props.koulutus.metadata.opetus.opetustapa["0"].nimi) : '-']);
        fields.push([t('toteutus.laajuus'), '-']); //koulutuksesta?
        fields.push([t('toteutus.kesto'), '-']); //koulutuksesta?
        fields.push([t('toteutus.maksullinen'), this.props.koulutus.metadata.opetus.onkoMaksullinen ? t('kyllä') : t('ei')]);
        fields.push([t('toteutus.lukuvuosimaksu'), this.props.koulutus.metadata.opetus.lukuvuosimaksu.maksu ? (this.props.koulutus.metadata.opetus.lukuvuosimaksu.maksu + 'eur') : '0 eur']); //vika objekti tuntematon?
        fields.push([t('toteutus.stipendit'), this.props.koulutus.metadata.opetus.stipendinKuvaus ? t('Kyllä') : t('ei')]);


        return fields;
    }

    render() {
        const {t} = this.props;
        return (
            <React.Fragment>
                <div className="col-12 col-md-12 col-lg-8 col-xl-9 left-column">
                    <ToteutusHeader komoOid={this.props.koulutus.komoOid}
                                    organisaatioOid={this.props.organisaatio.oid}
                                    nimi={this.props.koulutus.metadata.nimi}
                                    organisaatio={this.props.koulutus.organisaatio.nimi}/>
                    <ToteutusInfoBox fields={this.parseInfoBoxFieldsTwoSided()}/>
                        <SlideDropdown text={true} title={t('toteutus.kuvaus')}/>
                        <SlideDropdown text={true} title={t('toteutus.pääaineet')}/>
                        <SlideDropdown text={true} title={t('toteutus.jatko-opintomahdollisuudet')}/>
                </div>
                <ToteutusSidebar organisaatio={this.props.organisaatio} koulutus={this.props.koulutus} educationType={this.educationType}/>
            </React.Fragment>   
        );
    }
}

export default Korkeakoulu;