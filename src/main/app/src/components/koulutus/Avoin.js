import React, { Component } from 'react';
import { Localizer as l } from '../../tools/Utils';
import KoulutusInfoBox from './KoulutusInfoBox';
import Media from 'react-media';
import {translate} from 'react-i18next';
import OppilaitosList from "./OppilaitosList";
import SlideDropDown from '../common/SlideDropdown';
import KoulutusHeader from "./KoulutusHeader";
import SideBarMenu from '../common/SideBarMenu';
@translate()
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

    parseInfoBoxFields() {
        const {t} = this.props;
        const fields = [];

        fields.push([t('koulutus.opintopisteet'), this.props.result.opintopisteet ? this.props.result.opintopisteet : ""]);
        fields.push([t('koulutus.koulutusohjelma'), l.localize(this.props.result.koulutusohjelma)]);
        fields.push([t('koulutus.opetuskielet'), this.props.result.opetuskielis ? this.props.result.opetuskielis.map(kieli => l.localize(kieli)) : ""]);
        fields.push([t('koulutus.suoritustavat'), this.props.result.opetusPaikkas ? this.props.result.opetusPaikkas.map(paikka => l.localize(paikka)): ""]);
        fields.push([t('koulutus.toimipiste'), this.props.result.toimipiste ? this.props.result.toimipiste : ""]);
        fields.push([t('koulutus.ajoitus'), this.props.result.ajoitus ? this.props.result.ajoitus : ""]);
        fields.push([t('koulutus.opetusajat'), this.props.result.opetusAikas? this.props.result.opetusAikas.map(aika => l.localize(aika)) : ""]);
        
        return fields;
    }

    render() {
        const fields = this.parseInfoBoxFields();
        const infoBox = fields > 0;
        const kuvaus = this.parseKuvaus();
        const {t} = this.props;
        return (
            
            <React.Fragment>
                <KoulutusHeader hattu="avoin-hattu" nimi={this.props.result.searchData.nimi}/>
                <Media query="(max-width: 992px)">
                                {
                                    matches => matches ? (
                                        <SideBarMenu items={this.props.items} item={this.props.item}/>    
                            ):null}
                        </Media> 
                {infoBox && <KoulutusInfoBox fields={fields}/>}
                {kuvaus &&
                    <SlideDropDown title={t('koulutus.yleiskuvaus')} toteutus={true} content={kuvaus} />
                }
                <SlideDropDown title="Mihin koulutus antaa valmiudet?" text={true}></SlideDropDown>
                <SlideDropDown title="Mitä voin opiskella?" text={true}></SlideDropDown>
                <SlideDropDown title="Mitä tutkintoja voin suorittaa?" text={true}></SlideDropDown>
                <SlideDropDown title="Mitä jatko-opintomahdollisuuksia on?" text={true}></SlideDropDown>
                <OppilaitosList oid={this.props.oid} oppilaitokset={this.props.result.toteutukset} nimi={this.props.result.searchData.nimi}/>
            </React.Fragment>
        );
    }
}

export default Avoin;