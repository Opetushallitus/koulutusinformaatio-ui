import React, { Component } from 'react';
import KoulutusInfoBox from './KoulutusInfoBox';
import OppilaitosList from './OppilaitosList';
import KoulutusSection from './KoulutusSection';
import KoulutusHeader from './KoulutusHeader';
import SlideDropDown from '../common/SlideDropdown';
import { Localizer as l } from '../../tools/Utils';
import {translate} from 'react-i18next'

@translate()
class Ammatillinen extends Component {

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
        fields.push([t('koulutus.suunniteltu-kesto'), suunniteltuKesto + " " + suunniteltuKestoTyyppi]);

        fields.push([t('koulutus.maksullinen'), this.props.result.opintojenMaksullisuus ? t('kyllä') : t('ei')]);
        fields.push([t('koulutus.tutkintonimikkeet'), this.props.result.tutkintonimikes ? this.props.result.tutkintonimikes.map(t => l.localize(t) + " ") : '-']);

        return fields;
    }

    render() {
        const koulutusohjelma = l.localize(this.props.result.koulutusohjelma, undefined);
        const osaamisala = this.props.result.osaamisala ? l.localize(this.props.result.osaamisala.meta, undefined).nimi : undefined;

        const osaamisalat = koulutusohjelma ? koulutusohjelma : osaamisala;
        const tutkinnonOsat = l.localize(this.props.result.kuvausKomo.KOULUTUKSEN_RAKENNE, undefined);
        const jatkoOpinnot = l.localize(this.props.result.kuvausKomo.JATKOOPINTO_MAHDOLLISUUDET, undefined);

        const hattu = this.props.muu ? "muu-hattu" : "ammatillinen-hattu";
        return (
            <React.Fragment>
                <KoulutusHeader hattu={hattu} nimi={this.props.result.searchData.nimi}/>
                <KoulutusInfoBox fields={this.parseInfoBoxFields()}/>

                {osaamisalat && <KoulutusSection
                    content={<ul><li className="osaamisalat_list_item">{osaamisalat}</li></ul>}
                    header="koulutus.osaamisalat"
                    noRender={true}/>}

                <KoulutusSection content={tutkinnonOsat} header="koulutus.tutkinnon-rakenne"/>
                <SlideDropDown title="Mihin koulutus antaa valmiudet?" text={true}></SlideDropDown>
                <SlideDropDown title="Mitä voin opiskella?" text={true}></SlideDropDown>
                <SlideDropDown title="Mitä tutkintoja voin suorittaa?" text={true}></SlideDropDown>
                <SlideDropDown title="Mitä jatko-opintomahdollisuuksia on?" text={true}></SlideDropDown>
                <OppilaitosList oid={this.props.oid} oppilaitokset={this.props.result.toteutukset}/>

                <KoulutusSection content={jatkoOpinnot} header="koulutus.jatko-opinnot"/>
            </React.Fragment>);
    }
}

export default Ammatillinen;