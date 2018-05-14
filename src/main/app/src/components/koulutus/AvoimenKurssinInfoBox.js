import React, {Component} from 'react';
import {Localizer as l} from '../../tools/Utils';

class AvoinInfoBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            opintopisteet: props.result.opintojenLaajuusPistetta,
            koulutusohjelma: props.result.koulutusohjelma,
            opettaja: props.result.opettaja,
            opetuskielet: props.result.opetuskielis, //array, voi olla monta
            opetusPaikkas: props.result.opetusPaikkas,
            toimipiste: "-",
            luokka: "-",
            ajoitus: "-",
            opetusaikas: props.result.opetusAikas,
            ilmoittautuneet: "-",

        };
        console.log("Created element AvoinInfoBox, data: %O", props.result);
    }

    render () {

        const opintopisteet = this.state.opintopisteet ? this.state.opintopisteet : "not working";
        const koulutusohjelma = l.localize(this.state.koulutusohjelma);
        const opettaja = this.state.opettaja;
        const opetuskielet = [];
        this.state.opetuskielet.map(kieli => {opetuskielet.push(l.localize(kieli))});
        const suoritustapas = [];
        this.state.opetusPaikkas.map(paikka => {suoritustapas.push(l.localize(paikka))});
        const toimipiste = this.state.toimipiste;
        const luokka = this.state.luokka;
        const ajoitus = this.state.ajoitus;
        const opetusajat = [];
        this.state.opetusaikas.map(aika => {opetusajat.push(l.localize(aika))});
        const ilmoittautuneet = this.state.ilmoittautuneet;

        return (
            <div className="koulutusinfo">
                <ul className="koulutusinfolaatikko">
                    {opintopisteet && <li>Opintopisteet: {opintopisteet}</li>}
                    {koulutusohjelma && <li>Koulutusohjelma: {koulutusohjelma}</li>}
                    {opettaja && <li>Opettaja: {opettaja} </li>}
                    {opetuskielet.length > 0 && <li>Opetuskielet: {opetuskielet.join(", ")} </li>}
                    {suoritustapas.length > 0 && <li>Suoritustapa: {suoritustapas.join(", ")} </li>}
                    {toimipiste && luokka &&  <li>Toimipiste ja luokka: {toimipiste} {luokka}</li>}
                    {ajoitus && <li>Ajoitus: {ajoitus} </li>}
                    {opetusajat.length > 0 && <li>Opetusajat: {opetusajat.join(", ")} </li>}
                    {ilmoittautuneet && <li>Ilmoittautuneet: {ilmoittautuneet} </li>}
                </ul>
            </div>);


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

export default AvoinInfoBox;