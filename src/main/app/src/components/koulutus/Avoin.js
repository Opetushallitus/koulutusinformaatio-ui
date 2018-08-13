import React, { Component } from 'react';
import { Localizer as l } from '../../tools/Utils';
import KoulutusInfoBox from './KoulutusInfoBox';
import KoulutusSidebar from "../toteutus/KoulutusSidebar";
import renderHTML from 'react-render-html';
import {translate} from 'react-i18next';
import OppilaitosList from "./OppilaitosList";

@translate()
class Avoin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            oid: props.oid,
            result: props.result,
        };
        console.log("Created element AoinYoKoulutus. Data: %O", this.state.result);
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        this.setState({
            oid: this.props.oid,
            result: this.props.result
        });
    }

    parseNimi() {
        return l.localize(this.state.result.searchData, this.props.t("koulutus.tuntematon-nimi"), 'fi');
    }

    parseKuvaus() {
        if(this.state.result && this.state.result.kuvausKomoto && this.state.result.kuvausKomoto.SISALTO) {
            return renderHTML(l.localize(this.state.result.kuvausKomoto.SISALTO));
        }

        if(this.state.result && this.state.result.kuvausKomo && this.state.result.kuvausKomo.TAVOITTEET) {
            return renderHTML(l.localize(this.state.result.kuvausKomo.TAVOITTEET));
        }
        return "";
    }

    parseInfoBoxFields() {
        const {t} = this.props;
        const fields = [];

        fields.push([t('koulutus.opintopisteet'), this.state.result.opintopisteet ? this.state.result.opintopisteet : ""]);
        fields.push([t('koulutus.koulutusohjelma'), l.localize(this.state.result.koulutusohjelma)]);
        fields.push([t('koulutus.opetuskielet'), this.state.result.opetuskielis ? this.state.result.opetuskielis.map(kieli => l.localize(kieli)) : ""]);
        fields.push([t('koulutus.suoritustavat'), this.state.result.opetusPaikkas ? this.state.result.opetusPaikkas.map(paikka => l.localize(paikka)): ""]);
        fields.push([t('koulutus.toimipiste'), this.state.result.toimipiste ? this.state.result.toimipiste : ""]);
        fields.push([t('koulutus.ajoitus'), this.state.result.ajoitus ? this.state.result.ajoitus : ""]);
        fields.push([t('koulutus.opetusajat'), this.state.result.opetusAikas? this.state.result.opetusAikas.map(aika => l.localize(aika)) : ""]);

        console.log("Kenttiä:" + fields.length)
        return fields;
    }

    render() {
        const {t} = this.props;
        const fields = this.parseInfoBoxFields();
        const infoBox = fields > 0;
        const kuvaus = this.parseKuvaus();
        return (
            <div className="container">
                <div className="row info-page">
                    <div className="col-xs-12 col-md-9 left-column">
                        <h1>
                            <i className="fa fa-circle avoin-hattu" aria-hidden="true"></i>
                            <span id={"koulutus-title"}>{this.parseNimi()}</span>
                        </h1>
                        {infoBox && <div className="row">
                            <div className="col-xs-12 left-column">
                                {<KoulutusInfoBox fields={fields}/>}
                            </div>
                        </div>}
                        {kuvaus && <div className="col-xs-12 col-md-9 left-column">
                            <h2 className="line_otsikko">{t("koulutus.yleiskuvaus")}</h2>
                            <div className="">
                                {this.parseKuvaus()}
                                <ul>

                                </ul>
                            </div>
                        </div>}
                        <OppilaitosList oid={this.props.oid} oppilaitokset={this.props.result.toteutukset}/>
                    </div>
                    <KoulutusSidebar/>
                </div>
            </div>
        );
    }
}

export default Avoin;