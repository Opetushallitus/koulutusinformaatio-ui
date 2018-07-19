import React, {Component} from 'react';
import {Localizer as l, TimeMillisParser as timeParser} from "../../tools/Utils";

class KoulutusInfoBoxTwoSided extends Component {

    constructor(props) {
        super(props);
        this.state = {
            otsikkoLeft: props.fields.otsikkoLeft,
            fieldsLeft: props.fields.left,
            otsikkoRight: props.fields.otsikkoRight,
            hakuajatToShow: this.selectHakuaikasToShow(props.fields.hakuajat)
        };
        console.log("Created element InfoBoxTwoSided with props: ", props);
    }

    selectHakuaikasToShow(hakuaikas) {
        var toShow = [];
        if (hakuaikas) {
            if (hakuaikas.aktiiviset.length > 0) {
                toShow = hakuaikas.aktiiviset; // Aktiivisia hakuja voi olla monta samaan aikaan
            } else if (hakuaikas.tulevat.length > 0) {
                let seuraavaksiAlkava = hakuaikas.tulevat[0];
                hakuaikas.tulevat.forEach(aika => {
                    if(aika.alkuPvm < seuraavaksiAlkava.alkuPvm) {
                        seuraavaksiAlkava = aika;
                    }
                });
                toShow = [seuraavaksiAlkava]; // Tulevista hauista näytetään vain seuraavaksi alkava
            }
        }
        return toShow;
    }

    static createFieldsAndButtonForSingleHakuaika(hakuaika) {
        if (hakuaika && hakuaika.alkuPvm) {
            const now = new Date().getTime();
            const aktiivinen = hakuaika.alkuPvm < now && hakuaika.loppuPvm ? hakuaika.loppuPvm > now : true; //Tulkitaan loppupäivämäärätön haku jatkuvaksi hauksi
            const haunNimi = hakuaika.hakuNimi ? l.localize(hakuaika.hakuNimi) : "Haulla ei nimeä";
            const aikaReadable = timeParser.millisToReadable(hakuaika.alkuPvm ? hakuaika.alkuPvm : null) + " - " + timeParser.millisToReadable(hakuaika.loppuPvm ? hakuaika.loppuPvm : null);
            return (<div><p>{haunNimi}</p>
                        <p>{aikaReadable}</p>
                        <button class="haeKoulutukseen" key={"haku oidille " + hakuaika.hakuOid}>{aktiivinen ? "Jätä hakemus" : "Tilaa muistutus"}</button>
                    </div>);
        } else return null;
    }

    render () {
        if(!this.state.fieldsLeft) {
            return null;
        }
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
                        {this.state.hakuajatToShow.length > 0 ? this.state.hakuajatToShow.map(h => KoulutusInfoBoxTwoSided.createFieldsAndButtonForSingleHakuaika(h)) : <p>Ei aktiivisia tai tulevia hakuja tällä hetkellä</p>}
                    </ul>
                </div>
            </div>
        );
    }
}

export default KoulutusInfoBoxTwoSided;