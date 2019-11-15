import React, { Component } from 'react';
import ToteutusInfoBox from './ToteutusInfoBox';
import { Localizer as l } from '../../tools/Utils';
import {translate} from 'react-i18next'
import {inject} from "mobx-react";
import ToteutusHeader from "./ToteutusHeader";
import ToteutusDescriptionBox from './ToteutusDescriptionBox';
import ToteutusHakukohdeBox from './ToteutusHakukohdeBox';
import OsaamisalaInfoBox from './OsaamisalaInfoBox';
import ToteutusAdditionalInfoBox from './ToteutusAdditionalInfoBox';
import ToteutusHeaderImage from './ToteutusHeaderImage';
import ToteutusContactInfoBox from './ToteutusContactInfoBox';
import '../../assets/styles/components/_toteutus-page.scss';

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
        //await this.getOppilaitosInfo(); oppilaitos haku rikki atm
    }

    async componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        await this.getOsaamisalaKuvaus();
        //await this.getOppilaitosInfo(); oppilaitos haku rikki atm
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

    getOppilaitosInfo() {
        if(!this.props.organisaatio.oid){
            return;
        }
        this.props.restStore.getOppilaitos(this.props.organisaatio.oid, 'true', (k) => {
            this.setState({
                oppilaitos: k
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

    parseInfoBoxFieldsLeft() {
        const {t} = this.props;
        const fields = [];

        fields.push([t('toteutus.alkaa'), (this.props.toteutus.metadata.opetus.alkamiskausi && this.props.toteutus.metadata.opetus.alkamiskausi.nimi) ? l.localize(this.props.toteutus.metadata.opetus.alkamiskausi.nimi) +" "+ this.props.toteutus.metadata.opetus.alkamisvuosi : '-', "outlined_flag"]);
        fields.push([t('toteutus.opetuskieli'), (this.props.toteutus.metadata.opetus.opetuskieli && this.props.toteutus.metadata.opetus.opetuskieli["0"]) ? l.localize(this.props.toteutus.metadata.opetus.opetuskieli["0"].nimi) : '-', "chat_bubble_outline"]);
        fields.push([t('toteutus.opetusaika'), (this.props.toteutus.metadata.opetus.opetusaika && this.props.toteutus.metadata.opetus.opetusaika.nimi) ? l.localize(this.props.toteutus.metadata.opetus.opetusaika.nimi) : '-', "hourglass_empty"]);
        fields.push([t('toteutus.opetustapa'), (this.props.toteutus.metadata.opetus.opetustapa && this.props.toteutus.metadata.opetus.opetustapa["0"]) ? l.localize(this.props.toteutus.metadata.opetus.opetustapa["0"].nimi) : '-', "menu_book"]);
        fields.push([t('toteutus.laajuus'), '-', "timelapse"]); //koulutuksesta?
        fields.push([t('toteutus.kesto'), '-', "access_time"]); //koulutuksesta?
        fields.push([t('toteutus.maksullinen'), this.props.toteutus.metadata.opetus.onkoMaksullinen ? t('kyllä') : t('ei'), "euro_symbol"]);
        fields.push([t('toteutus.tutkintonimikkeet'), '-', "school"]);

        return fields;
    }

    parseAdditionalInfoBoxFields() {//placeholder until real data is available from backend
        const fields = [];

        const field0 = {
            title: undefined
        };
        field0.title = "Opintojen rakenne";

        const field1 = {
            title: undefined
        };
        field1.title = "Jatko-opintomahdollisuudet";

        const field2 = {
            title: undefined
        };
        field2.title = "Suuntautumisvaihtoehdot";

        const field3 = {
            title: undefined
        };
        field3.title = "Uramahdollisuudet";
        
        fields.push(field0);
        fields.push(field1);
        fields.push(field2);
        fields.push(field3);
        return fields;
    }

    render() {
        const kuvaus = this.props.toteutus.metadata.kuvaus;
        const osaamisalat = this.props.toteutus.metadata.osaamisalat;
        if(osaamisalat && this.state.kuvaus && this.state.kuvaus.osaamisalat){
            this.insertOsaamisalaKuvaukset(osaamisalat);
        }

        return (
            <React.Fragment>
                <div className="col-12 col-md-12 col-lg-12 col-xl-12">
                    <ToteutusHeader komoOid={this.props.toteutus.komoOid}
                                    nimi={this.props.toteutus.nimi}
                                    organisaatio={this.props.toteutus.organisaatio.nimi}/>
                    <div className="header-image">
                        <ToteutusHeaderImage></ToteutusHeaderImage>
                    </div>
                    <ToteutusInfoBox fields={this.parseInfoBoxFieldsLeft()}/>
                    <div className="hakukohde-info-wrapper">
                        <div className="hakukohde-info-box">
                            <div className="hakukohde-info-text-box">
                                <li>Jatkuva haku käynnissä</li>
                                <li>Katso oppilaitoksen hakukohteet ja täytä hakemus</li>
                            </div>
                            <div className="hakukohde-info-button-wrapper">
                                <a role="button" aria-label="Etsi" className="toteutus-hakukohteet-button" href="">Näytä hakukohteet</a>
                            </div>
                        </div>
                    </div>
                    {kuvaus &&
                        <ToteutusDescriptionBox content={l.localize(kuvaus)}/>
                    }

                    {osaamisalat && 
                        <OsaamisalaInfoBox fields={osaamisalat}/>
                    }
                    <ToteutusHakukohdeBox/>
                    <ToteutusAdditionalInfoBox fields={this.parseAdditionalInfoBoxFields()}/>
                    <ToteutusContactInfoBox/>
                </div>
            </React.Fragment>
        );
    }
}

export default Ammatillinen;