import React, { Component } from 'react';
import ToteutusInfoBox from './ToteutusInfoBox';
import {Localizer as l} from '../../tools/Utils';
import {withTranslation} from 'react-i18next';
import {inject} from "mobx-react";
import ToteutusHeader from "./ToteutusHeader";
import SlideDropdown from '../common/SlideDropdown';
import ToteutusSidebar from "./ToteutusSidebar";
import {withRouter} from "react-router-dom";

@inject("hakuStore")
class Lukio extends Component {

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
        // alku, kieli, laajuus, kesto, muoto, pohja
        const aloitusPvm = new Date(Number(this.props.koulutus.koulutuksenAlkamisPvms[0]));
        fields.push([t('koulutus.alkaa'), aloitusPvm.getDate() + "." + (aloitusPvm.getMonth() + 1) + "." + aloitusPvm.getFullYear()]);

        fields.push([t('koulutus.opetuskieli'), l.localize(this.props.koulutus.opetuskielis[0])]);

        const opintojenLaajuusarvo = l.localize(this.props.koulutus.opintojenLaajuusarvo, '-');
        const opintojenLaajuusyksikko = l.localize(this.props.koulutus.opintojenLaajuusyksikko);
        fields.push([t('koulutus.laajuus'), opintojenLaajuusarvo && (opintojenLaajuusarvo + " " + opintojenLaajuusyksikko)]);

        const suunniteltuKesto = this.props.koulutus.suunniteltuKestoArvo;
        const suunniteltuKestoTyyppi = l.localize(this.props.koulutus.suunniteltuKestoTyyppi);
        fields.push([t('koulutus.kesto'), suunniteltuKesto + " " + suunniteltuKestoTyyppi]);

        fields.push([t('koulutus.opiskelumuoto'), this.props.koulutus.opetusmuodos.map(t => l.localize(t) + " ")]);
        fields.push([t('koulutus.pohjakoulutus'), l.localize(this.props.koulutus.pohjakoulutusvaatimus)]);

        return fields;
    }

    render() {
        const {t} = this.props;
        const sisalto = l.localize(this.props.koulutus.kuvausKomo.KOULUTUKSEN_RAKENNE, undefined);
        const erikoistumisalat = l.localize(this.props.koulutus.kuvausKomo.TAVOITTEET, undefined);
        return (
            <React.Fragment>
                <div className="col-12 col-md-12 col-lg-8 col-xl-9 left-column">
                    <ToteutusHeader komoOid={this.props.koulutus.komoOid}
                                    nimi={this.props.koulutus.searchData.nimi}
                                    organisaatio={this.props.koulutus.organisaatio.nimi}/>
                    <ToteutusInfoBox fields={this.parseInfoBoxFieldsTwoSided()}/>
                    { sisalto &&
                        <SlideDropdown toteutus={true} content={sisalto} title={t('koulutus.sisältö')}/>
                    }
                    { erikoistumisalat &&
                        <SlideDropdown toteutus={true} content={erikoistumisalat} title={t('koulutus.pääaineet')}/>
                    }
                </div>
                <ToteutusSidebar organisaatio={this.props.organisaatio} koulutus={this.props.koulutus} educationType={this.educationType}/>
            </React.Fragment>
        );
    }
}

export default withTranslation()(Lukio);