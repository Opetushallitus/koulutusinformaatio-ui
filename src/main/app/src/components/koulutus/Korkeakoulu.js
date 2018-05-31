import React, { Component } from 'react';
import KoulutusInfoBox from './KoulutusInfoBox';
import KoulutusSidebar from './KoulutusSidebar';
import { Localizer as l } from '../../tools/Utils';
import renderHTML from 'react-render-html';


class Korkeakoulu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            oid: props.oid,
            result: props.result,
        };
    }

    parseAineListaus() {
        if(this.state.result.oppiaineet.length > 0) {
            return this.state.result.oppiaineet.map(o => <li className="osaamisalat_list_item">{o.oppiaine ? o.oppiaine : "Tuntematon"}</li>);
        } else {
            return this.state.result.aihees.map(a => <li className="osaamisalat_list_item">{l.localize(a.nimi)}</li>);
        }
    }

    parseNimi() {
        if(this.state.result) {
            return l.localize(this.state.result.koulutuskoodi, "Tuntematon koulutus")
        }
        return ""
    }

    parseInfoBoxFields() {
        const fields = [];
        // laajuus, kesto, maksullinen, tutkintonimike

        const opintojenLaajuusarvo = l.localize(this.props.result.opintojenLaajuusarvo, '-');
        const opintojenLaajuusyksikko = l.localize(this.props.result.opintojenLaajuusyksikko);
        fields.push(["Koulutuksen laajuus", opintojenLaajuusarvo && (opintojenLaajuusarvo + " " + opintojenLaajuusyksikko)]);
        const suunniteltuKesto = this.props.result.suunniteltuKestoArvo;
        const suunniteltuKestoTyyppi = l.localize(this.props.result.suunniteltuKestoTyyppi);
        fields.push(["Suunniteltu kesto", suunniteltuKesto + " " + suunniteltuKestoTyyppi]);

        fields.push(["Maksullinen", this.props.result.opintojenMaksullisuus ? "Kyllä" : "Ei"]);
        fields.push(["Tutkintonimikkeet", this.props.result.tutkintonimikes ? this.props.result.tutkintonimikes.map(t => l.localize(t) + " ") : '-']);

        return fields;
    }

    render() {
        const jatkoOpinnot = l.localize(this.state.result.kuvausKomo.JATKOOPINTO_MAHDOLLISUUDET, undefined);
        return (
            <div className="container">
                <div className="row info-page">
                    <div className="col-xs-12 col-md-9 left-column">
                        <h1>
                            <i className="fa fa-circle korkeakoulu-hattu" aria-hidden="true"></i>
                            <span>{this.parseNimi()}</span>
                        </h1>
                        <div className="row">
                            <div className="col-xs-12 left-column">
                                <KoulutusInfoBox fields={this.parseInfoBoxFields()}/>
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-9 left-column">
                            <h2 className="line_otsikko">Pääaineet tai erikoistumisalat</h2>
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
                            <h2 className="line_otsikko">Jatko-opintomahdollisuudet</h2>
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