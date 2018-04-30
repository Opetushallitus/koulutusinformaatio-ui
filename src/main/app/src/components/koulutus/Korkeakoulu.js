import React, { Component } from 'react';
import koulutusIcon from '../../assets/images/kk_otsikonvieruskuva.png';
import sidebarPic from '../../assets/images/student-success.jpg'; //Joku satunnainen kuva vaan
import KoulutusInfo from './KoulutusInfo';
import {Localizer as l} from '../Utils';

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
            return this.state.result.oppiaineet.map(o => <li>{o.oppiaine ? o.oppiaine : "Tuntematon"}</li>);
        } else {
            return this.state.result.aihees.map(a => <li>{l.localize(a.nimi)}</li>);
        }
    }

    safeParseNimi() {
        if (this.state.result && this.state.result.koulutuskoodi && this.state.result.koulutuskoodi.nimi) {
            return l.localize(this.state.result.koulutuskoodi.nimi);
        } else {
            return "Opintojakson nimi epäselvä, koulutuskoodia ei löytynyt";
        }
    }

    render() {
        return (
            <div>
                <div className='korkeakoulutus-left'>
                    <div> <h1 className="koulutusOtsikko"><img className='koulutusIcon' src={koulutusIcon} alt={"logo"}/> {this.safeParseNimi()}</h1></div>
                    <KoulutusInfo result={this.state.result}/>

                    <div className="oppiaineet">
                        <h2>Pääaineet tai erikoistumisalat: </h2>
                        <div class="">
                            <ul>
                                {this.parseAineListaus()}
                            </ul>
                        </div>

                    </div>

                    <div className="oppilaitokset">
                        <h2>Oppilaitokset (n kpl)</h2>
                        <div class="box-container">
                            <div className="col-xs-12 oppilaitos-box">
                                <h3>Oppilaitoksen nimi</h3>
                                <div class="text">
                                    <p>erikoistumisalat</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="jatko-opintomahdollisuudet">
                        <h2>Jatko-opintomahdollisuudet: </h2>
                        <p>{l.localize(this.state.result.kuvausKomo.JATKOOPINTO_MAHDOLLISUUDET)}</p>
                    </div>

                </div>

                <div className="right-column-new">
                    <div className="right-innards">
                        <img className='sidebar-pic' src={sidebarPic}></img>
                                    <div>
                                    </div>
                                    <div>
                                    </div>

                    </div>
                </div>
            </div>
                );
    }
}

export default Korkeakoulu;