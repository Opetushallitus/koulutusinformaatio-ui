import React, {Component} from 'react';
import {Localizer as l, TimeMillisParser as timeParser} from "../../tools/Utils";

class KoulutusInfoBoxTwoSided extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fieldsLeft: props.fields.left,
            fieldsRight: props.fields.right,
            otsikkoLeft: props.fields.otsikkoLeft,
            otsikkoRight: props.fields.otsikkoRight,
            hakuajatToShow: this.selectHakuaikasToShow(props.fields.hakuajat)
        };
        console.log("Created element InfoBoxTwoSided with props: ", props);
    }

    selectNonActiveHakuaikaToUse(hakuaikas) {
        if(hakuaikas.tulevat.length > 0) {
            let seuraavaksiAlkava = hakuaikas.tulevat[0];
            hakuaikas.tulevat.forEach(aika => {
                if(aika.alkuPvm < seuraavaksiAlkava.alkuPvm) {
                    seuraavaksiAlkava = aika;
                }
            });
            return [seuraavaksiAlkava];
        }
        //Päättyneitä hakuaikoja ei välttämättä haluta näyttää
        /*if(hakuaikas.paattyneet.length > 0) {
            let viimeksiPaattynyt = hakuaikas.paattyneet[0];
            hakuaikas.paattyneet.forEach(aika => {
                if(aika.loppuPvm > viimeksiPaattynyt.loppuPvm) {
                    viimeksiPaattynyt = aika;
                }
            });
            return viimeksiPaattynyt;
        }*/
        return [];
    }

    selectHakuaikasToShow(hakuaikas) {
        if (hakuaikas && hakuaikas.aktiiviset && hakuaikas.tulevat) {
            if (hakuaikas.aktiiviset.length > 0) {
                return hakuaikas.aktiiviset; //Aktiivisia hakuja voi olla monta samaan aikaan
            } else {
                return this.selectNonActiveHakuaikaToUse(hakuaikas); //Tulevista tai menneistä valitaan vain yksi näytettävä
            }
        } else return [];
    }

    static parseFieldsAndButtonForSingleHakuaika(hakuaika) {
        //console.log("hakuaika in: ", hakuaika)
        if(hakuaika && hakuaika.alkuPvm && hakuaika.loppuPvm && hakuaika.hakuNimi) {
            const now = new Date().getTime();
            const aktiivinen = hakuaika.alkuPvm < now && hakuaika.loppuPvm > now;
            const haunNimi = hakuaika.hakuNimi ? l.localize(hakuaika.hakuNimi) : "Ei nimeä";
            const aikaReadable = timeParser.millisToReadable(hakuaika.alkuPvm) + "-" + timeParser.millisToReadable(hakuaika.loppuPvm);
            return (<div><p>{haunNimi}</p>
                        <p>{aikaReadable}</p>
                        <button class="haeKoulutukseen" key={"haku oidille " + hakuaika.hakuOid}>{aktiivinen ? "Jätä hakemus" : "Tilaa muistutus"}</button>
                    </div>);
        } else return null;
    }

    render () {
        if(!this.state.fieldsLeft || !this.state.hakuajatToShow) {
            return null;
        }
        console.log("to show: ", this.state.hakuajatToShow)
        return (
            <div className="koulutusinfo-2">
                <div className="koulutusinfo-2-left">
                    {this.state.otsikkoLeft ? <h2>{this.state.otsikkoLeft}</h2> : ""}
                    <ul className="koulutusinfolaatikko-2-list-left">
                        {this.state.fieldsLeft.map(row => row[1] && <li key={row[0]+row[1]}>{row[0] + (row[0].length === 0 ? "" : ": ") + row[1]}</li>)}
                    </ul>
                </div>
                <div className="koulutusinfo-2-right">
                    {this.state.otsikkoRight ? <h2>{this.state.otsikkoRight}</h2> : ""}
                    <ul className="koulutusinfolaatikko-2-list-right">
                        {/*{this.state.fieldsRight.map(row => row[1] && <li key={row[0]+row[1]}> {row[0] + (row[0].length === 0 ? "" : ": ") + row[1]}</li>)}*/}
                        {this.state.hakuajatToShow.length > 0 ? this.state.hakuajatToShow.map(h => KoulutusInfoBoxTwoSided.parseFieldsAndButtonForSingleHakuaika(h)) : <p>Ei aktiivisia tai tulevia hakuja tällä hetkellä</p>}
                    </ul>
                </div>
            </div>
        );
    }
}

export default KoulutusInfoBoxTwoSided;