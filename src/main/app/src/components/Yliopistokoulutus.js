import React, { Component } from 'react';
import koulutusIcon from '../assets/images/kk_otsikonvieruskuva.png';

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
                    <ul>
                        {this.parseAineListaus()}
                    </ul>

                    </div>
                </div>

                <div className="right-column-new">
                    <div className="row">
                                
                                    <div>
                                        <p>
                                            "Tuskin olen koskaan oppinut näin paljon näin lyhyessä ajassa. Parasta on myös loistavat luokkakaverit, jotka tekevät opiskelusta"
                                        </p>
                                    </div>
                                    <div>
                                        <h2>Tähän koulutukseen liittyviä muita koulutuksia</h2>
                                    </div>

                    </div>
                </div>
            </div>
                );
    }
}

export default Yliopistokoulutus;