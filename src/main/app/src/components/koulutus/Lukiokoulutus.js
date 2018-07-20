import React, { Component } from 'react';
import KoulutusInfoBoxTwoSided from './KoulutusInfoBoxTwoSided';
// import OppilaitoksetBox from './OppilaitoksetBox'
import KoulutusSidebar from './KoulutusSidebar';
import {Localizer as l} from '../../tools/Utils';
import renderHTML from 'react-render-html';
import {translate} from 'react-i18next';

@translate()
class Korkeakoulu extends Component {

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
        if(this.state.result) {
            return l.localize(this.state.result.searchData.nimi, this.props.t("koulutus.tuntematon")) + ( this.state.result.organisaatio.nimi ? ", " + this.state.result.organisaatio.nimi : '')
        }
        return ""
    }

    parseInfoBoxFieldsTwoSided() {
        const {t} = this.props;
        const fields = {};
        fields.left = this.parseInfoBoxFieldsLeft();
        fields.otsikkoLeft = t('koulutus.tiedot');
        fields.hakuajat = this.props.result.hakuajatFromBackend;
        fields.otsikkoRight = t('koulutus.hae-koulutukseen');
        return fields;
    }

    parseInfoBoxFieldsLeft() {
        const {t} = this.props;
        const fields = [];
        // alku, kieli, laajuus, kesto, muoto, pohja
        const aloitusPvm = new Date(Number(this.props.result.koulutuksenAlkamisPvms[0]));
        fields.push([t('koulutus.alkaa'), aloitusPvm.getDate() + "." + (aloitusPvm.getMonth() + 1) + "." + aloitusPvm.getFullYear()]);

        fields.push([t('koulutus.opetuskieli'), l.localize(this.props.result.opetuskielis[0])]);

        const opintojenLaajuusarvo = l.localize(this.props.result.opintojenLaajuusarvo, '-');
        const opintojenLaajuusyksikko = l.localize(this.props.result.opintojenLaajuusyksikko);
        fields.push([t('koulutus.laajuus'), opintojenLaajuusarvo && (opintojenLaajuusarvo + " " + opintojenLaajuusyksikko)]);

        const suunniteltuKesto = this.props.result.suunniteltuKestoArvo;
        const suunniteltuKestoTyyppi = l.localize(this.props.result.suunniteltuKestoTyyppi);
        fields.push([t('koulutus.kesto'), suunniteltuKesto + " " + suunniteltuKestoTyyppi]);

        fields.push([t('koulutus.opiskelumuoto'), this.props.result.opetusmuodos.map(t => l.localize(t) + " ")]);
        fields.push([t('koulutus.pohjakoulutus'), l.localize(this.props.result.pohjakoulutusvaatimus)]);

        return fields;
    }

    render() {
        const {t} = this.props;
        const jatkoOpinnot = l.localize(this.state.result.kuvausKomo.JATKOOPINTO_MAHDOLLISUUDET, undefined);
        const koulutuksenSisalto = l.localize(this.state.result.kuvausKomo.TAVOITTEET, undefined);

        return (
            <div className="container">
                <div className="row info-page">
                    <div className="col-xs-12 col-md-9 left-column">
                        <h1>
                            <i className="fa fa-circle lukio-hattu" aria-hidden="true"></i>
                            <span id={"koulutus-title"}>{this.parseNimi()}</span>
                        </h1>
                        <div className="row">
                            <div className="col-xs-12 left-column">
                                <KoulutusInfoBoxTwoSided fields={this.parseInfoBoxFieldsTwoSided()}/>
                            </div>
                        </div>

                        {koulutuksenSisalto && <div className="col-xs-12 col-md-9 left-column">
                            <h2 className="line_otsikko">{t('koulutus.sisältö')}</h2>
                            <div className="">
                                {renderHTML(koulutuksenSisalto)}
                            </div>
                        </div>}

                        {jatkoOpinnot &&
                        <div className="col-xs-12 col-md-9 left-column">
                            <h2 className="line_otsikko">{t('koulutus.jatko-opinnot')}</h2>
                            <div className="">
                                {renderHTML(jatkoOpinnot)}
                            </div>
                        </div>}

                        {/*<div className="col-xs-12 col-md-9 left-column ">*/}
                            {/*<OppilaitoksetBox oppilaitokset={this.props.result.opetusTarjoajat}/>*/}
                        {/*</div>*/}
                    </div>

                    <KoulutusSidebar/>
                </div>
            </div>
        );
    }
}

export default Korkeakoulu;