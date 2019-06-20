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
@inject("restStore")
class Ammatillinen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            kuvaus: undefined,
        }
    };

    async componentDidMount() {
        await this.getOsaamisalaKuvaus();
    }

    async componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        await this.getOsaamisalaKuvaus();
    }

    getOsaamisalaKuvaus() {
        if(!this.props.koulutusUri){
            return;
        }
        this.props.restStore.getKoulutusKuvaus(this.props.koulutusUri, 'true', (k) => {
            this.setState({
                kuvaus: k
            })
        });
    }

    insertOsaamisalaKuvaukset(osaamisalat) {
        var self = this;
        osaamisalat.forEach(function(ala){
            var osaamisala = self.state.kuvaus.osaamisalat.find(function(osaamisala){
                return osaamisala.osaamisalakoodiUri === ala.koodi.koodiUri;
            });
            ala.kuvaus = "";
            if(osaamisala){
                ala.kuvaus = osaamisala.kuvaus ? osaamisala.kuvaus : "";
            }
        });
        return osaamisalat;
    }

    parseInfoBoxFieldsTwoSided() {
        const {t} = this.props;
        const fields = {};
        fields.left = this.parseInfoBoxFieldsLeft();
        fields.otsikkoLeft = t('koulutus.tiedot');
        fields.hakukohteet = this.props.toteutus.hakukohteet;
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

        return fields;
    }

    render() {
        const kuvaus = this.props.toteutus.metadata.kuvaus;
        const osaamisalat = this.props.toteutus.metadata.osaamisalat;
        if(osaamisalat && this.state.kuvaus && this.state.kuvaus.osaamisalat){
            this.insertOsaamisalaKuvaukset(osaamisalat);
        }
        const jatkoopinnot = "tba";
        const {t} = this.props;

        return (
            <React.Fragment>
                <div className="col-12 col-md-12 col-lg-8 col-xl-9 left-column">
                    <ToteutusHeader komoOid={this.props.toteutus.komoOid}
                                    nimi={this.props.toteutus.nimi}
                                    organisaatio={this.props.toteutus.organisaatio.nimi}/>
                    <ToteutusInfoBox fields={this.parseInfoBoxFieldsTwoSided()}/>

                    {kuvaus &&
                        <SlideDropdown kuvaus={true} teksti={l.localize(this.props.toteutus.metadata.kuvaus)} title={t('toteutus.kuvaus')} />
                    }

                    {osaamisalat && 
                        <SlideDropdown title={t('toteutus.osaamisalat')} osaamisalat={true} osaamisalatlist={osaamisalat.length > 0 ? osaamisalat : false}/>
                    }
                    {jatkoopinnot &&
                        <SlideDropdown text={true} title={t('toteutus.jatko-opintomahdollisuudet')}/>
                    }

                </div>
                <ToteutusSidebar organisaatio={this.props.organisaatio} koulutus={this.props.toteutus} educationType={this.educationType}/>
            </React.Fragment>
        );
    }
}

export default Ammatillinen;