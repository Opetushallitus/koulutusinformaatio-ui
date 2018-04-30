import React, {Component} from 'react';
import {Localizer as l} from '../Utils';

class KoulutusInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            laajuus: props.result.opintojenLaajuusarvo,
            laajuusYksikko: props.result.opintojenLaajuusyksikko,
            kesto: props.result.suunniteltuKestoArvo,
            kestoYksikko: props.result.suunniteltuKestoTyyppi,
            tutkintonimikkeet: props.result.tutkintonimikes,
            opintojenMaksullisuus: props.result.opintojenMaksullisuus
        };
    }

    render () {
        const laajuus = l.localize(this.state.laajuus, undefined);
        const laajuusYksikko = l.localize(this.state.laajuusYksikko, undefined);
        const kesto = this.state.kesto;
        const kestoYksikko = l.localize(this.state.kestoYksikko, undefined);
        const tutkintonimikkeet = this.state.tutkintonimikkeet ? this.state.tutkintonimikkeet.map(t => l.localize(t) + " ") : undefined;

        return (
            <div className="koulutusinfo">
                <ul className="koulutusinfolaatikko">
                    {laajuus && <li>Koulutuksen laajuus: {laajuus} {laajuusYksikko}</li>}
                    {kesto && <li>Suunniteltu kesto: {kesto} {kestoYksikko}</li>}
                    <li>Maksullinen: {this.state.opintojenMaksullisuus ? "Kyllä" : "Ei"}</li>
                    {tutkintonimikkeet && <li>Tutkintonimikkeet: {tutkintonimikkeet} </li>}
                </ul>
            </div>);
    }
}

export default KoulutusInfo;