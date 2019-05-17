import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {Localizer as l, FormatdDate as formatDate} from "../../tools/Utils";
import '../../assets/styles/components/_toteutus-info-box.scss';

class ToteutusInfoBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            otsikkoLeft: props.fields.otsikkoLeft,
            fieldsLeft: props.fields.left,
            otsikkoRight: props.fields.otsikkoRight,
            hakuajatToShow: this.selectHakuaikasToShow(props.fields.hakukohteet)
        };
    }

    selectHakuaikasToShow(hakukohteet, hakuaikas) {
        var toShow = [];
        const now = new Date().getTime();
        if(hakukohteet && hakukohteet.length > 0){
            this.props.fields.hakukohteet.forEach(hakukohde => {
                for(var i = 0; hakukohde.hakuajat.length > i; i++){
                    const alkaaMill = new Date(hakukohde.hakuajat[i].alkaa).getTime();
                    const paattyyMill = new Date(hakukohde.hakuajat[i].paattyy).getTime();
                    if(alkaaMill > now || paattyyMill < now){
                        break;
                    }
                    toShow.push(hakukohde);
                    break;
                }
            });
        }
        return toShow;
    }

    static createFieldsAndButtonForSingleHakuaika(hakukohde, i) {
        const link = '/hakukohde/'+hakukohde.oid;
        if (hakukohde) {
            const haunNimi = hakukohde.nimi ? l.localize(hakukohde.nimi) : "Haulla ei nimeä";
            const aikaReadable = `${formatDate.formatDateString(hakukohde.hakuajat[0].alkaa, 'DD.MM.YYYY')} - ${formatDate.formatDateString(hakukohde.hakuajat[0].paattyy, 'DD.MM.YYYY')}`;
            return (<div className="col-12 hakukohde-container" key={i}>
                        <Link to={link} className="hakukohde-nimi">{haunNimi}</Link>
                        <ul className="Hakuaika hakukohde-hakuaika">
                            <li>Hakuaika: {aikaReadable}</li>    
                        </ul>
                    </div>);
        } else return null;
    }

    render () {
        if(!this.state.fieldsLeft) {
            return null;
        }
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