import React, {Component} from 'react';
import {Localizer as l, TimeMillisParser as timeParser} from "../../tools/Utils";
import '../../assets/styles/components/_toteutus-info-box.scss';
import {Link} from "react-router-dom";

class ToteutusInfoBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            otsikkoLeft: props.fields.otsikkoLeft,
            fieldsLeft: props.fields.left,
            otsikkoRight: props.fields.otsikkoRight,
            hakuajatToShow: this.selectHakuaikasToShow(props.fields.hakuajat)
        };
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

    static createFieldsAndButtonForSingleHakuaika(hakuaika, i) {
        if (hakuaika && hakuaika.alkuPvm) {
            const now = new Date().getTime();
            const aktiivinen = hakuaika.alkuPvm < now && hakuaika.loppuPvm ? hakuaika.loppuPvm > now : !hakuaika.loppuPvm;
            const haunNimi = hakuaika.hakuNimi ? l.localize(hakuaika.hakuNimi) : "Haulla ei nimeä";
            const aikaReadable = `${timeParser.millisToReadable(hakuaika.alkuPvm ? hakuaika.alkuPvm : null)} - ${timeParser.millisToReadable(hakuaika.loppuPvm ? hakuaika.loppuPvm : null)}`;
            return (<div className="col-12" key={i}>
                        <p className="Haun nimi">{haunNimi}</p>
                        <ul className="Hakuaika">
                            <li>Hakuaika</li>
                            <li>{aikaReadable}</li>        
                        </ul>
                        <div className="action-button" key={`haku oidille ${hakuaika.hakuOid}`}>
                            <a role="button">
                                <div className="link-button">
                                    <span>{aktiivinen ? "Jätä hakemus" : "Tilaa muistutus"}</span>
                                </div>
                            </a>
                        </div>
                        
                    </div>);
        } else return null;
    }

    render () {
        if(!this.state.fieldsLeft) {
            return null;
        }
        /*const link = '/hakukohde/1.2.246.562.17.00000000000000000023'/*?haku=' + encodeURIComponent(this.props.hakuStore.createHakuUrl)
        + '&lng=' + l.getLanguage()*/;
       // <Link to={link} className={"hakutulosbox-link"}>hakukohdelinkki</Link> hakukohde-sivun testi linkki
        return (
            <div id="toteutus-info-box">
                <div className="col-12">
                    <div className="row">
                        <div className="col-12 col-md-6 box tiedot">
                            {this.state.otsikkoLeft ? <h3>{this.state.otsikkoLeft}</h3> : ""}
                            {this.state.fieldsLeft.map(row => row[1] && 
                                <div className="col-12" key={`${row[0]} ${row[1]}`}>
                                   <p>{`${row[0]} ${(row[0].length === 0 ? "" : ": ")} ${row[1]}`}</p>
                                </div>
                            )
                            }
                        </div>
                        <div className="col-12 col-md-6 box hakemus">
                            {this.state.otsikkoRight ? <h3>{`${this.state.otsikkoRight} !`}</h3> : ""}
                                {this.state.hakuajatToShow.length > 0 ? this.state.hakuajatToShow.map((h, i) => ToteutusInfoBox.createFieldsAndButtonForSingleHakuaika(h, i)) : <p>Ei aktiivisia tai tulevia hakuja tällä hetkellä</p>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ToteutusInfoBox;