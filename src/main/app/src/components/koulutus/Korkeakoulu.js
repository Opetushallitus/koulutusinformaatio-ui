import React, { Component } from 'react';
import KoulutusInfoBox from './KoulutusInfoBox';
import KoulutusSidebar from './KoulutusSidebar';
import {Localizer as l, Parser as p} from '../../tools/Utils';
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
            return this.state.result.oppiaineet.map(o => <li class="osaamisalat_list_item">{o.oppiaine ? o.oppiaine : "Tuntematon"}</li>);
        } else {
            return this.state.result.aihees.map(a => <li class="osaamisalat_list_item">{l.localize(a.nimi)}</li>);
        }
    }

    parseNimi() {
        if(this.state.result) {
            return l.localize(this.state.result.koulutuskoodi, "Tuntematon koulutus")
        }
        return ""
    }

    render() {
        const jatkoOpinnot = l.localize(this.state.result.kuvausKomo.JATKOOPINTO_MAHDOLLISUUDET, undefined);
        return (
            <div class="container">
                <div class="row info-page">
                    <div class="col-xs-12 col-md-9 left-column">
                        <h1>
                            <i class="fa fa-circle korkeakoulu-hattu" aria-hidden="true"></i>
                            <span>{this.parseNimi()}</span>
                        </h1>
                        <div class="row">
                            <div class="col-xs-12 left-column">
                                <KoulutusInfoBox result={this.state.result}/>
                            </div>
                        </div>
                        <div class="col-xs-12 col-md-9 left-column">
                            <h2 class="line_otsikko">Pääaineet tai erikoistumisalat</h2>
                            <div class="">
                                <ul>
                                    {this.parseAineListaus()}
                                </ul>
                            </div>

                        </div>

                        {/*<div class="col-xs-12 col-md-9 left-column oppilaitokset"> //TODO Toiseen demoversioon?
                        <h2 class="line_otsikko">Oppilaitokset (n kpl)</h2>
                        <div class="box-container">
                            <div className="col-xs-12 oppilaitos-box">
                                <h3>Oppilaitoksen nimi</h3>
                                <div class="text">
                                    <p>erikoistumisalat</p>
                                </div>
                            </div>
                        </div>
                    </div>*/}

                        {jatkoOpinnot &&
                        <div class="col-xs-12 col-md-9 left-column">
                            <h2 class="line_otsikko">Jatko-opintomahdollisuudet</h2>
                            <div class="">
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