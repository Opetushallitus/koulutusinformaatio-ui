import React, { Component } from 'react';
import HakukohdeInfoBox from './HakukohdeInfoBox';
import {translate} from 'react-i18next'
import {inject} from "mobx-react";
import HakukohdeHeader from './HakukohdeHeader';
import SlideDropdown from '../common/SlideDropdown';
import HakukohdeSidebar from "./HakukohdeSidebar";
import { Localizer as l } from '../../tools/Utils';

@translate()
@inject("hakuStore")
class Ammatillinen extends Component {

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
    }

    parseInfoBoxFieldsTwoSided() {
        const fields = {};
        fields.left = this.parseInfoBoxFieldsLeft();
        return fields;
    }

    parseInfoBoxFieldsLeft() {
        const fields = [];
        fields.push(['Kohdejoukko', l.localize(this.props.haku.kohdejoukko.nimi)]);
        const alkaa = this.props.haku.hakuajat[0].alkaa.replace(/T.*/g, "");
        const loppuu = this.props.haku.hakuajat[0].paattyy.replace(/T.*/g, "");
        fields.push(['Hakuaika', alkaa + " - " + loppuu]);
        const pohjakoulutusvaatimus = this.props.hakukohde.pohjakoulutusvaatimus.map(o => l.localize(o.nimi));
        fields.push(['Pohjakoulutusvaatimus', pohjakoulutusvaatimus]);
        fields.push(['Alkamiskausi', l.localize(this.props.hakukohde.alkamiskausi)]);
        fields.push(['Aloituspaikat', this.props.hakukohde.aloituspaikat]);

        return fields;
    }

    render() {
        return (
            <React.Fragment>
                <div className="col-12 col-md-12 col-lg-8 col-xl-9 left-column">
                    <HakukohdeHeader komoOid={this.props.hakukohde.oid}
                                    nimi={l.localize(this.props.hakukohde.nimi)}
                                    organisaatio={l.localize(this.props.hakukohde.organisaatio.nimi)}/>
                    <HakukohdeInfoBox nimi={l.localize(this.props.hakukohde.nimi)} fields={this.parseInfoBoxFieldsTwoSided()}/>
                    <SlideDropdown toteutus={true} content={"Valintaperusteiden kuvaus"} title="Valintaperusteiden kuvaus"/>
                    <SlideDropdown valintakokeet={true} valintakokeetlist={this.props.hakukohde.valintakokeet} title="Valintakokeet"/>
                    <SlideDropdown toteutus={true} content={"Tarvittavat liitteet"} title="Tarvittavat liitteet"/>
                    <SlideDropdown toteutus={true} content={"Osaamistausta"} title="Osaamistausta"/>
                    <SlideDropdown toteutus={true} content={"Tietoa valintatavasta"} title="Tietoa valintatavasta"/>
                    <SlideDropdown toteutus={true} content={"Kielitaitovaatimukset"} title="Kielitaitovaatimukset"/>
                    <SlideDropdown toteutus={true} content={"Sora-kuvaus"} title="Sora-kuvaus"/>
                </div>
                <HakukohdeSidebar organisaatio={this.props.hakukohde.organisaatio} educationType={this.educationType}/>
            </React.Fragment>
        );
    }
}

export default Ammatillinen;