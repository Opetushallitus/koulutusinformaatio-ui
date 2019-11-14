import React, { Component } from 'react';
import ToteutusInfoBox from './ToteutusInfoBox';
import { Localizer as l } from '../../tools/Utils';
import {withTranslation} from 'react-i18next'
import {inject} from "mobx-react";
import ToteutusHeader from "./ToteutusHeader";
import SlideDropdown from '../common/SlideDropdown';
import ToteutusSidebar from "./ToteutusSidebar";
import {withRouter} from "react-router-dom";

@inject("hakuStore")
class Korkeakoulu extends Component {

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
    }

    parseAineListaus() {
        const {t} = this.props;
        if(this.props.toteutus.oppiaineet.length > 0) {
            return this.props.toteutus.oppiaineet.map(o => <li key={o.oppiaine ? o.oppiaine : ''} className="osaamisalat_list_item">{o.oppiaine ? o.oppiaine : t("tuntematon")}</li>);
        } else {
            return this.props.toteutus.aihees.map(a => <li key={a.uri} className="osaamisalat_list_item">{l.localize(a.nimi)}</li>);
        }
    }

    parseInfoBoxFieldsTwoSided() {
        const {t} = this.props;
        const fields = {};
        fields.left = this.parseInfoBoxFieldsLeft();
        fields.otsikkoLeft = t('koulutus.tiedot');
        fields.hakuajat = this.props.toteutus.hakukohteet;
        fields.otsikkoRight = t('toteutus.tietoa-hakuväylistä');
        return fields;
    }

    parseInfoBoxFieldsLeft() {
        const {t} = this.props;
        const fields = [];
        // laajuus, kesto, maksullinen, tutkintonimike

        fields.push([t('toteutus.alkaa'), (this.props.toteutus.metadata.opetus.alkamiskausi && this.props.toteutus.metadata.opetus.alkamiskausi.nimi) ? l.localize(this.props.toteutus.metadata.opetus.alkamiskausi.nimi) +" "+ this.props.toteutus.metadata.opetus.alkamisvuosi : '-']);
        fields.push([t('toteutus.opetuskieli'), (this.props.toteutus.metadata.opetus.opetuskieli && this.props.toteutus.metadata.opetus.opetuskieli["0"]) ? l.localize(this.props.toteutus.metadata.opetus.opetuskieli["0"].nimi) : '-']);
        fields.push([t('toteutus.opetusaika'), (this.props.toteutus.metadata.opetus.opetusaika && this.props.toteutus.metadata.opetus.opetusaika.nimi) ? l.localize(this.props.toteutus.metadata.opetus.opetusaika.nimi) : '-']);
        fields.push([t('toteutus.opetustapa'), (this.props.toteutus.metadata.opetus.opetustapa && this.props.toteutus.metadata.opetus.opetustapa["0"]) ? l.localize(this.props.toteutus.metadata.opetus.opetustapa["0"].nimi) : '-']);
        fields.push([t('toteutus.laajuus'), '-']); //koulutuksesta?
        fields.push([t('toteutus.kesto'), '-']); //koulutuksesta?
        fields.push([t('toteutus.maksullinen'), this.props.toteutus.metadata.opetus.onkoMaksullinen ? t('kyllä') : t('ei')]);
        fields.push([t('toteutus.lukuvuosimaksu'), this.props.toteutus.metadata.opetus.lukuvuosimaksu.maksu ? (this.props.toteutus.metadata.opetus.lukuvuosimaksu.maksu + 'eur') : '0 eur']); //vika objekti tuntematon?
        fields.push([t('toteutus.stipendit'), this.props.toteutus.metadata.opetus.stipendinKuvaus ? t('Kyllä') : t('ei')]);


        return fields;
    }

    render() {
        const {t} = this.props;
        const osaamisalat = this.props.toteutus.metadata.alemmanKorkeakoulututkinnonOsaamisalat.concat(this.props.toteutus.metadata.ylemmanKorkeakoulututkinnonOsaamisalat);
        return (
            <React.Fragment>
                <div className="col-12 col-md-12 col-lg-8 col-xl-9 left-column">
                    <ToteutusHeader komoOid={this.props.toteutus.komoOid}
                                    organisaatioOid={this.props.organisaatio.oid}
                                    nimi={this.props.toteutus.metadata.nimi}
                                    organisaatio={this.props.toteutus.organisaatio.nimi}/>
                    <ToteutusInfoBox fields={this.parseInfoBoxFieldsTwoSided()}/>
                        <SlideDropdown kuvaus={true} teksti={l.localize(this.props.toteutus.metadata.kuvaus)} title={t('toteutus.kuvaus')} />        
                        {osaamisalat && 
                        <SlideDropdown title={t('toteutus.pääaineet')} osaamisalat={true} osaamisalatlist={osaamisalat.length > 0 ? osaamisalat : false}/>
                        }


                        <SlideDropdown text={true} title={t('toteutus.jatko-opintomahdollisuudet')}/>
                </div>
                <ToteutusSidebar organisaatio={this.props.organisaatio} toteutus={this.props.toteutus} educationType={this.educationType}/>
            </React.Fragment>   
        );
    }
}

export default withTranslation()(Korkeakoulu);