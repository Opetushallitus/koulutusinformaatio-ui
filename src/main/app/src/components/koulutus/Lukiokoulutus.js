import React, { Component } from 'react';
import KoulutusInfoBox from './KoulutusInfoBox';
import OppilaitoksetBox from './OppilaitoksetBox'
import KoulutusSidebar from './KoulutusSidebar';
import {Localizer as l} from '../../tools/Utils';
import renderHTML from 'react-render-html';


class Korkeakoulu extends Component {

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
        // alku, kieli, laajuus, kesto, muoto, pohja
        const aloitusPvm = new Date(Number(this.props.result.koulutuksenAlkamisPvms[0]));
        fields.push(["Koulutus alkaa", aloitusPvm.getDate() + "." + (aloitusPvm.getMonth() + 1) + "." + aloitusPvm.getFullYear()]);

        fields.push(["Opetuskieli", l.localize(this.props.result.opetuskielis[0])]);

        const opintojenLaajuusarvo = l.localize(this.props.result.opintojenLaajuusarvo, '-');
        const opintojenLaajuusyksikko = l.localize(this.props.result.opintojenLaajuusyksikko);
        fields.push(["Koulutuksen laajuus", opintojenLaajuusarvo && (opintojenLaajuusarvo + " " + opintojenLaajuusyksikko)]);

        const suunniteltuKesto = this.props.result.suunniteltuKestoArvo;
        const suunniteltuKestoTyyppi = l.localize(this.props.result.suunniteltuKestoTyyppi);
        fields.push(["Suunniteltu kesto", suunniteltuKesto + " " + suunniteltuKestoTyyppi]);

        fields.push(["Opiskelumuoto", this.props.result.opetusmuodos.map(t => l.localize(t) + " ")]);
        fields.push(["Pohjakoulutus", l.localize(this.props.result.pohjakoulutusvaatimus)]);

        return fields;
    }

    render() {
        const jatkoOpinnot = l.localize(this.state.result.kuvausKomo.JATKOOPINTO_MAHDOLLISUUDET, undefined);
        const koulutuksenSisalto = l.localize(this.state.result.kuvausKomo.TAVOITTEET, undefined);

        return (
            <div className="container">
                <div className="row info-page">
                    <div className="col-xs-12 col-md-9 left-column">
                        <h1>
                            <i className="fa fa-circle lukio-hattu" aria-hidden="true"></i>
                            <span>{this.parseNimi()}</span>
                        </h1>
                        <div className="row">
                            <div className="col-xs-12 left-column">
                                <KoulutusInfoBox fields={this.parseInfoBoxFields()}/>
                            </div>
                        </div>

                        {koulutuksenSisalto && <div className="col-xs-12 col-md-9 left-column">
                            <h2 className="line_otsikko">Koulutuksen sisältö</h2>
                            <div className="">
                                {renderHTML(koulutuksenSisalto)}
                            </div>
                        </div>}

                        {jatkoOpinnot &&
                        <div className="col-xs-12 col-md-9 left-column">
                            <h2 className="line_otsikko">Jatko-opintomahdollisuudet</h2>
                            <div className="">
                                {renderHTML(jatkoOpinnot)}
                            </div>
                        </div>}

                        {/*<div className="col-xs-12 col-md-9 left-column ">*/}
                            {/*<OppilaitoksetBox oppilaitokset={this.props.result.opetusTarjoajat}/>*/}
                        {/*</div>*/}
                    </div>

                    <KoulutusSidebar/>
                </div>
            </div>
        );
    }
}

export default Korkeakoulu;