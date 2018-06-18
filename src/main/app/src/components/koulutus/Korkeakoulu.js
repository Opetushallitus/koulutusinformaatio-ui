import React, { Component } from 'react';
import KoulutusInfoBox from './KoulutusInfoBox';
import KoulutusInfoBoxTwoSided from './KoulutusInfoBoxTwoSided';
import KoulutusSidebar from './KoulutusSidebar';
import { Localizer as l } from '../../tools/Utils';
import renderHTML from 'react-render-html';
import {translate} from 'react-i18next'

@translate()
class Korkeakoulu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            oid: props.oid,
            result: props.result,
        };
        console.log("Created element Korkeakoulu with data: {}", this.state.result)
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        this.setState({
            oid: this.props.oid,
            result: this.props.result
        });
    }

    parseAineListaus() {
        const {t} = this.props;
        if(this.state.result.oppiaineet.length > 0) {
            return this.state.result.oppiaineet.map(o => <li key={o.oppiaine ? o.oppiaine : ''} className="osaamisalat_list_item">{o.oppiaine ? o.oppiaine : t("tuntematon")}</li>);
        } else {
            return this.state.result.aihees.map(a => <li key={a.uri} className="osaamisalat_list_item">{l.localize(a.nimi)}</li>);
        }
    }

    parseNimi() {
        if(this.state.result) {
            return l.localize(this.state.result.searchData, this.props.t('koulutus.tuntematon'), "fi")
        }
        return ""
    }


    parseInfoBoxFieldsTwoSided() {
        const fields = {};
        fields.left = this.parseInfoBoxFieldsLeft();
        fields.right = this.parseInfoBoxFieldsRight();
        return fields;
    }

    parseInfoBoxFieldsRight() {
        const {t} = this.props;
        const fields = [];
        const haunNimi = l.localize("kissa", "kissa");
        const hakuAika = l.localize("huomenissa", "huomenissa");
        fields.push([t('haku.nimi'), haunNimi]);
        fields.push([t('haku.hakuaika'), hakuAika]);

        console.log("Returning fields right:" + fields);

        return fields;

    }

    parseInfoBoxFieldsLeft() {
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

        console.log("Returning fields left:" + fields);
        return fields;
    }

    render() {
        const {t} = this.props;
        const jatkoOpinnot = l.localize(this.state.result.kuvausKomo.JATKOOPINTO_MAHDOLLISUUDET, undefined);
        return (
            <div className="container">
                <div className="row info-page">
                    <div className="col-xs-12 col-md-9 left-column">
                        <h1>
                            <i className="fa fa-circle korkeakoulu-hattu" aria-hidden="true"></i>
                            <span id={"koulutus-title"}>{this.parseNimi()}</span>
                        </h1>
                        <div className="row">
                            <div className="col-xs-12 left-column">
                                <KoulutusInfoBoxTwoSided fields={this.parseInfoBoxFieldsTwoSided()}/>
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-9 left-column">
                            <h2 className="line_otsikko">{t('koulutus.pääaineet')}</h2>
                            <div className="">
                                <ul>
                                    {this.parseAineListaus()}
                                </ul>
                            </div>

                        </div>

                        {/*<div className="col-xs-12 col-md-9 left-column oppilaitokset"> //TODO Toiseen demoversioon?
                        <h2 className="line_otsikko">Oppilaitokset (n kpl)</h2>
                        <div className="box-container">
                            <div className="col-xs-12 oppilaitos-box">
                                <h3>Oppilaitoksen nimi</h3>
                                <div className="text">
                                    <p>erikoistumisalat</p>
                                </div>
                            </div>
                        </div>
                    </div>*/}

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

export default Korkeakoulu;