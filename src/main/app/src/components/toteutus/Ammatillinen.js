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
class Ammatillinen extends Component {

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
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

        return fields;
    }

    render() {
        const kuvaus = this.props.koulutus.metadata.kuvaus;
        console.log(kuvaus);
        const osaamisalat = this.props.koulutus.metadata.osaamisalat;
        const jatkoopinnot = "tba";
        // const tutkinnonOsat = l.localize(this.props.koulutus.kuvausKomo.KOULUTUKSEN_RAKENNE, undefined);
       // const erikoistumisalat = l.localize(this.props.koulutus.kuvausKomo.TAVOITTEET, undefined);

     /*    nääki react.fragiin 
                    {kuvaus &&
                        <SlideDropdown toteutus={true} content={kuvaus} title={t('koulutus.kuvaus')}/>
                    }
                    {tutkinnonOsat &&
                        <SlideDropdown toteutus={true} content={tutkinnonOsat} title="Koulutuksen sisältö ja tavoitteet"/>
                    }
                    {erikoistumisalat &&
                        <SlideDropdown toteutus={true} content={erikoistumisalat} title="Pääaineen tai erikoistumisalan valinta"/>
                    } */
                    console.log(osaamisalat);
       const {t} = this.props;
        return (
            <React.Fragment>
                <div className="col-12 col-md-12 col-lg-8 col-xl-9 left-column">
                    <ToteutusHeader komoOid={this.props.koulutus.komoOid}
                                    nimi={this.props.koulutus.nimi}
                                    organisaatio={this.props.koulutus.organisaatio.nimi}/>
                    <ToteutusInfoBox fields={this.parseInfoBoxFieldsTwoSided()}/>

                    {kuvaus &&
                        <SlideDropdown kuvaus={true} teksti={l.localize(this.props.koulutus.metadata.kuvaus)} title={t('toteutus.kuvaus')} />
                    }

                    {osaamisalat && 
                        <SlideDropdown text={true} title={t('toteutus.osaamisalat')}/>
                    }
                    {jatkoopinnot &&
                        <SlideDropdown text={true} title={t('toteutus.jatko-opintomahdollisuudet')}/>
                    }

                </div>
                <ToteutusSidebar organisaatio={this.props.organisaatio} koulutus={this.props.koulutus} educationType={this.educationType}/>
            </React.Fragment>
        );
    }
}

export default Ammatillinen;