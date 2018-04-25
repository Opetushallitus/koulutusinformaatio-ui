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
            return this.state.result.oppiaineet.map(o => <li>{o.oppiaine ? o.oppiaine : "Tuntematon"}</li>);
        } else {
            return this.state.result.aihees.map(a => <li>{this.localize(a.nimi)}</li>);
        }
    }

    safeParseNimi() {
        if (this.state.result && this.state.result.koulutuskoodi && this.state.result.koulutuskoodi.nimi) {
            return this.localize(this.state.result.koulutuskoodi.nimi);
        } else {
            return "Opintojakson nimi epäselvä, koulutuskoodia ei löytynyt";
        }
    }

    safeParseKoulutusinfolaatikko() {
        console.log("Safe parse koulutusinfolaatikko!");
        var laajuus = (this.state.result.opintojenLaajuusarvo && this.state.result.opintojenLaajuusarvo.nimi) ? this.localize(this.state.result.opintojenLaajuusarvo.nimi) : "?";
        var laajuusYksikko = (this.state.result.opintojenLaajuusyksikko && this.state.result.opintojenLaajuusyksikko.nimi) ? this.localize(this.state.result.opintojenLaajuusyksikko.nimi) : "?";
        var kesto = (this.state.result.suunniteltuKestoArvo) ? this.state.result.suunniteltuKestoArvo : "?";
        var kestoYksikko = (this.state.result.suunniteltuKestoTyyppi && this.state.result.suunniteltuKestoTyyppi.nimi) ? this.localize(this.state.result.suunniteltuKestoTyyppi.nimi) : "?";
        var tutkintonimikkeet = this.state.result.tutkintonimikes ? this.state.result.tutkintonimikes.map(t => this.localize(t.nimi) + " ") : "?";

         return <ul className="koulutusinfolaatikko">
            <li>Koulutuksen laajuus: {laajuus} {laajuusYksikko}</li>
            <li>Suunniteltu kesto: {kesto} {kestoYksikko}</li>
            <li>Maksullinen: {this.state.result.opintojenMaksullisuus ? "Kyllä" : "Ei"}</li>
            <li>Tutkintonimikkeet: {tutkintonimikkeet} </li>
            </ul>;
    }

    render() {
        console.log("Rendataan sivu, data: %O", this.state.result );
        return (
            <div>
                <div>
                    <div> <h1 className="koulutusOtsikko"><img className='koulutusIcon' src={koulutusIcon} alt={"logo"}/> {this.safeParseNimi()}</h1></div>
                    <div className="koulutusinfo">
                        {this.safeParseKoulutusinfolaatikko()}
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