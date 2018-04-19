import React, { Component } from 'react';
import koulutusIcon from '../assets/images/kk_otsikonvieruskuva.png';
import sidebarPic from '../assets/images/student-success.jpg'; //Joku satunnainen kuva vaan

class Yliopistokoulutus extends Component {

    constructor(props) {
        super(props);
        this.state = {
            oid: props.oid,
            result: props.result,
        };
    }

    //fi, en, sv
    localize(obj) {
        if (obj && obj.kieli_fi) {
            return obj.kieli_fi; //Toistaiseksi palautetaan kaikelle kieleksi suomi, mutta linkitetään kaikki tätä kautta jotta kielistystoteutus on myöhemmin helppo lisätä.
        } else {
            return "Haluttua kielistystä ei löydetty";
        }
    }

    parseAineListaus() {
        if(this.state.result.oppiaineet.length > 0) {
            return this.state.result.oppiaineet.map(o => <li>{o.oppiaine}</li>);
        } else {
            return this.state.result.aihees.map(a => <li>{this.localize(a.nimi)}</li>);
        }
    }

    render() {
        console.log("Rendataan sivu, data: %O", this.state.result );
        return (
            <div>
                <div>
                    <div> <h1 className="koulutusOtsikko"><img className='koulutusIcon' src={koulutusIcon} alt={"logo"}/> {this.localize(this.state.result.koulutuskoodi.nimi)}</h1></div>
                    <div >
                        <ul className="koulutusinfolaatikko">
                            <li>Koulutuksen laajuus: {this.localize(this.state.result.opintojenLaajuusarvo.nimi)} {this.localize(this.state.result.opintojenLaajuusyksikko.nimi)}</li>
                            <li>Suunniteltu kesto: {this.state.result.suunniteltuKestoArvo} {this.localize(this.state.result.suunniteltuKestoTyyppi.nimi)}</li>
                            <li>Maksullinen: {this.state.result.opintojenMaksullisuus ? "Kyllä" : "Ei"}</li>
                            <li>Tutkintonimikkeet: {this.state.result.tutkintonimikes.map(t => this.localize(t.nimi))} </li>
                        </ul>
                    </div>

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
                        <p>{this.localize(this.state.result.kuvausKomo.JATKOOPINTO_MAHDOLLISUUDET)}</p>
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

export default Yliopistokoulutus;