import React, { Component } from 'react';
import KoulutusInfoBox from './KoulutusInfoBox';
// import OppilaitoksetBox from './OppilaitoksetBox'
import KoulutusSidebar from '../toteutus/KoulutusSidebar';
import {Localizer as l} from '../../tools/Utils';
import renderHTML from 'react-render-html';
import {translate} from 'react-i18next';
import OppilaitosList from "./OppilaitosList";

@translate()
class Lukio extends Component {

    constructor(props) {
        super(props);
        this.state = {
            oid: props.oid,
            result: props.result,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        this.setState({
            oid: this.props.oid,
            result: this.props.result
        });
    }

    parseNimi() {
        if (this.state.result) {
            return l.localize(this.state.result.searchData.nimi, this.props.t("koulutus.tuntematon")) + (this.state.result.organisaatio.nimi ? ", " + this.state.result.organisaatio.nimi : '')
        }
    }

    parseInfoBoxFields() {
        const {t} = this.props;
        const fields = [];
        // alku, kieli, laajuus, kesto, muoto, pohja
        const aloitusPvm = this.props.result.koulutuksenAlkamisPvms ? new Date(Number(this.props.result.koulutuksenAlkamisPvms[0])) : undefined;
        const koulutusAlkaa = aloitusPvm ? aloitusPvm.getDate() + "." + (aloitusPvm.getMonth() + 1) + "." + aloitusPvm.getFullYear() : undefined;
        fields.push([t('koulutus.alkaa'), koulutusAlkaa]);

        this.props.result.opetuskielis ?
        fields.push([t('koulutus.opetuskieli'), l.localize(this.props.result.opetuskielis[0])]) :
        fields.push([t('koulutus.opetuskieli'), undefined]);

        const opintojenLaajuusarvo = l.localize(this.props.result.opintojenLaajuusarvo, '-');
        const opintojenLaajuusyksikko = l.localize(this.props.result.opintojenLaajuusyksikko);
        fields.push([t('koulutus.laajuus'), opintojenLaajuusarvo && (opintojenLaajuusarvo + " " + opintojenLaajuusyksikko)]);

        const suunniteltuKesto = this.props.result.suunniteltuKestoArvo;
        const suunniteltuKestoTyyppi = l.localize(this.props.result.suunniteltuKestoTyyppi);
        fields.push([t('koulutus.kesto'), suunniteltuKesto + " " + suunniteltuKestoTyyppi]);

        fields.push([t('koulutus.opiskelumuoto'), this.props.result.opetusmuodos ? this.props.result.opetusmuodos.map(t => l.localize(t) + " ") : undefined]);
        fields.push([t('koulutus.pohjakoulutus'), l.localize(this.props.result.pohjakoulutusvaatimus)]);

        return fields;
    }

    render() {
        const {t} = this.props;
        const jatkoOpinnot = l.localize(this.state.result.kuvausKomo.JATKOOPINTO_MAHDOLLISUUDET, undefined);
        const koulutuksenSisalto = l.localize(this.state.result.kuvausKomo.TAVOITTEET, undefined);
        const oppilaitokset = this.props.result.toteutukset.length > 0;

        return (
            <div className="container">
                <div className="row info-page">
                    <div className="col-xs-12 col-md-9 left-column">
                        <h1>
                            <i className="fa fa-circle lukio-hattu" aria-hidden="true"></i>
                            <span id={"koulutus-title"}>{this.parseNimi()}</span>
                        </h1>
                        <KoulutusInfoBox fields={this.parseInfoBoxFields()}/>

                        {koulutuksenSisalto && <div className="col-xs-12 col-md-9 left-column">
                            <h2 className="line_otsikko">{t('koulutus.sisältö')}</h2>
                            <div className="">
                                {renderHTML(koulutuksenSisalto)}
                            </div>
                        </div>}

                        <OppilaitosList oid={this.props.oid} oppilaitokset={this.props.result.toteutukset}/>

                        {jatkoOpinnot &&
                        <div className="col-xs-12 col-md-9 left-column">
                            <h2 className="line_otsikko">{t('koulutus.jatko-opinnot')}</h2>
                            <div className="">
                                {renderHTML(jatkoOpinnot)}
                            </div>
                        </div>}

                    </div>

                    <KoulutusSidebar/>
                </div>
            </div>
        );
    }
}

export default Lukio;