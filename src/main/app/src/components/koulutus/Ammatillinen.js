import React, { Component } from 'react';
import KoulutusInfoBox from './KoulutusInfoBox';
import OppilaitosList from './OppilaitosList';
import KoulutusHeader from './KoulutusHeader';
import SlideDropDown from '../common/SlideDropdown';
import { Localizer as l } from '../../tools/Utils';
import {translate} from 'react-i18next'
import Media from 'react-media';
import SideBarMenu from '../common/SideBarMenu';

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
        const {t} = this.props;
        const koulutusohjelma = l.localize(this.props.result.koulutusohjelma, undefined);
        const osaamisala = this.props.result.osaamisala ? l.localize(this.props.result.osaamisala.meta, undefined).nimi : undefined;

        const osaamisalat = koulutusohjelma ? koulutusohjelma : osaamisala;
        const tutkinnonOsat = l.localize(this.props.result.kuvausKomo.KOULUTUKSEN_RAKENNE, undefined);
        const jatkoOpinnot = l.localize(this.props.result.kuvausKomo.JATKOOPINTO_MAHDOLLISUUDET, undefined);

        const hattu = this.props.muu ? "muu-hattu" : "ammatillinen-hattu";
        return (
            <React.Fragment>
                <KoulutusHeader hattu={hattu} nimi={this.props.result.searchData.nimi}/>
                <Media query="(max-width: 992px)">
                                {
                                    matches => matches ? (
                                        <SideBarMenu items={this.props.items} item={this.props.item}/>    
                            ):null}
                        </Media> 
                <KoulutusInfoBox fields={this.parseInfoBoxFields()}/>
                
                {osaamisalat && 
                    <SlideDropDown toteutus={true} content={osaamisalat} title={t('koulutus.osaamisalat')}/>
                }

                {tutkinnonOsat &&
                    <SlideDropDown toteutus={true} content={tutkinnonOsat} title={t('koulutus.tutkinnon-rakenne')}/>
                }  

                {jatkoOpinnot &&
                    <SlideDropDown title={t('koulutus.jatko-opinnot')} toteutus={true} content={jatkoOpinnot} />
                }
                <OppilaitosList oid={this.props.oid} oppilaitokset={this.props.result.toteutukset}/>
            </React.Fragment>);
    }
}

export default Ammatillinen;