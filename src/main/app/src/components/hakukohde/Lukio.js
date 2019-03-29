import React, { Component } from 'react';
import HakukohdeInfoBox from './HakukohdeInfoBox';
import {translate} from 'react-i18next';
import {inject} from "mobx-react";
import HakukohdeHeader from "./HakukohdeHeader";
import SlideDropdown from '../common/SlideDropdown';
import HakukohdeSidebar from "./HakukohdeSidebar";

@translate()
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
        const fields = [];
        fields.push(['Kohdejoukko', 'Korkeakoulutus']);
        fields.push(['Hakuaika', '2.5.-16.5.2019']);
        fields.push(['Pohjakoulutusvaatimus', 'Pohjakoulutusvaatimus 2, Pohjakoulutusvaatimus 3, Pohjakoulutusvaatimus 6']);
        fields.push(['Alkamiskausi', 'Kevät 2019']);
        fields.push(['Aloituspaikat', '25 (Ensikertalaisten aloituspaikat: 15)']);

        return fields;
    }

    render() {
        return (
            <React.Fragment>
                <div className="col-12 col-md-12 col-lg-8 col-xl-9 left-column">
                    <HakukohdeHeader komoOid={this.props.koulutus.komoOid}
                                    nimi={this.props.koulutus.searchData.nimi}
                                    organisaatio={this.props.koulutus.organisaatio.nimi}/>
                    <HakukohdeInfoBox nimi={this.props.koulutus.searchData.nimi} fields={this.parseInfoBoxFieldsTwoSided()}/>
                    <SlideDropdown toteutus={true} content={"Valintaperusteiden kuvaus"} title="Valintaperusteiden kuvaus"/>
                    <SlideDropdown toteutus={true} content={"Valintakokeet"} title="Valintakokeet"/>
                    <SlideDropdown toteutus={true} content={"Tarvittavat liitteet"} title="Tarvittavat liitteet"/>
                    <SlideDropdown toteutus={true} content={"Osaamistausta"} title="Osaamistausta"/>
                    <SlideDropdown toteutus={true} content={"Tietoa valintatavasta"} title="Tietoa valintatavasta"/>
                    <SlideDropdown toteutus={true} content={"Kielitaitovaatimukset"} title="Kielitaitovaatimukset"/>
                    <SlideDropdown toteutus={true} content={"Sora-kuvaus"} title="Sora-kuvaus"/>
                </div>
                <HakukohdeSidebar organisaatio={this.props.organisaatio} koulutus={this.props.koulutus} educationType={this.educationType}/>
            </React.Fragment>
        );
    }
}

export default Lukio;