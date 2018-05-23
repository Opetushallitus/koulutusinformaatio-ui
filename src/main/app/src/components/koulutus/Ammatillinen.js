import React, { Component } from 'react';
import KoulutusInfoBox from './KoulutusInfoBox';
import KoulutusSidebar from './KoulutusSidebar';
import {Localizer as l, Parser as p} from '../../tools/Utils';
import renderHTML from 'react-render-html';

class Ammatillinen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            oid: props.oid,
            result: props.result,
        };
    }

    parseNimi() {
        if(this.state.result) {
            return l.localize(this.state.result.koulutuskoodi, "Tuntematon koulutus")
        }
        return ""
    }

    parseInfoBoxFields() {
        const fields = [];
        // laajuus, kesto, maksullinen, tutkintonimike

        const opintojenLaajuusarvo = l.localize(this.props.result.opintojenLaajuusarvo, '-');
        const opintojenLaajuusyksikko = l.localize(this.props.result.opintojenLaajuusyksikko);
        fields.push(["Koulutuksen laajuus", opintojenLaajuusarvo && (opintojenLaajuusarvo + " " + opintojenLaajuusyksikko)]);
        const suunniteltuKesto = this.props.result.suunniteltuKestoArvo;
        const suunniteltuKestoTyyppi = l.localize(this.props.result.suunniteltuKestoTyyppi);
        fields.push(["Suunniteltu kesto", suunniteltuKesto + " " + suunniteltuKestoTyyppi]);

        fields.push(["Maksullinen", this.props.result.opintojenMaksullisuus ? "Kyllä" : "Ei"]);
        fields.push(["Tutkintonimikkeet", this.props.result.tutkintonimikes.map(t => l.localize(t) + " ")]);

        return fields;
    }

    render() {
        const osaamisalat = l.localize(this.state.result.koulutusohjelma, undefined);
        const tutkinnonOsat = l.localize(this.state.result.kuvausKomo.KOULUTUKSEN_RAKENNE, undefined);
        const jatkoOpinnot = l.localize(this.state.result.kuvausKomo.JATKOOPINTO_MAHDOLLISUUDET, undefined);
        return (
            <div class="container">
                <div class="row info-page">
                    <div class="col-xs-12 col-md-9 left-column">
                        <h1>
                            <i class="fa fa-circle ammatillinen-hattu" aria-hidden="true"></i>
                            <span>{this.parseNimi()}</span>
                        </h1>
                        <div class="row">
                            <div class="col-xs-12 left-column">
                                <KoulutusInfoBox fields={this.parseInfoBoxFields()}/>
                            </div>
                        </div>

                        {osaamisalat &&
                        <div class="col-xs-12 col-md-9 left-column">
                            <h2 class="line_otsikko">Osaamisalat</h2>
                            <div class="">
                                <ul>
                                    <li class="osaamisalat_list_item">{osaamisalat}</li>
                                </ul>
                            </div>
                        </div>}

                        {tutkinnonOsat &&
                        <div class="col-xs-12 col-md-9 left-column">
                            <h2 class="line_otsikko">Tutkinnon rakenne</h2>
                            <div class="">
                                {renderHTML(tutkinnonOsat)}
                            </div>
                        </div>}

                        {jatkoOpinnot &&
                        <div class="col-xs-12 col-md-9 left-column">
                            <h2 class="line_otsikko">Jatko-opintomahdollisuudet</h2>
                            <div class="">
                                {renderHTML(jatkoOpinnot)}
                            </div>
                        </div>}
                    </div>
                    <KoulutusSidebar/>
                </div>
            </div>);
    }
}

export default Ammatillinen;