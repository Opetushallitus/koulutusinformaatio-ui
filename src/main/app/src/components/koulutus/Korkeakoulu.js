import React, { Component } from 'react';
import KoulutusInfoBox from './KoulutusInfoBox';
import { Localizer as l } from '../../tools/Utils';
import {translate} from 'react-i18next'
import OppilaitosList from "./OppilaitosList";
import KoulutusSection from './KoulutusSection';
import KoulutusHeader from "./KoulutusHeader";
import SlideDropDown from '../common/SlideDropdown';

@translate()
class Korkeakoulu extends Component {

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
    }

    parseInfoBoxFields() {
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
        const erikoistumisalat = l.localize(this.props.result.kuvausKomo.TAVOITTEET, undefined);
        const jatkoOpinnot = l.localize(this.props.result.kuvausKomo.JATKOOPINTO_MAHDOLLISUUDET, undefined);

        return (
            <React.Fragment>
                <KoulutusHeader hattu="korkeakoulu-hattu" nimi={this.props.result.searchData.nimi}/>
                <KoulutusInfoBox fields={this.parseInfoBoxFields()}/>

                <KoulutusSection content={erikoistumisalat} header="koulutus.pääaineet"/>
                <SlideDropDown title="Mihin koulutus antaa valmiudet?" text={true}></SlideDropDown>
                <SlideDropDown title="Mitä voin opiskella?" text={true}></SlideDropDown>
                <SlideDropDown title="Mitä tutkintoja voin suorittaa?" text={true}></SlideDropDown>
                <SlideDropDown title="Mitä jatko-opintomahdollisuuksia on?" text={true}></SlideDropDown>
                <OppilaitosList oid={this.props.oid} oppilaitokset={this.props.result.toteutukset} nimi={this.props.result.searchData.nimi}/>

                <KoulutusSection content={jatkoOpinnot} header="koulutus.jatko-opinnot"/>
            </React.Fragment>
        );
    }
}

export default Korkeakoulu;