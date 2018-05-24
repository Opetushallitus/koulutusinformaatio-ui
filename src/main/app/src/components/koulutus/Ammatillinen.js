import React, { Component } from 'react';
import KoulutusInfoBox from './KoulutusInfoBox';
import KoulutusSidebar from './KoulutusSidebar';
import { Localizer as l } from '../../tools/Utils';
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

    render() {
        const osaamisalat = l.localize(this.state.result.koulutusohjelma, undefined);
        const tutkinnonOsat = l.localize(this.state.result.kuvausKomo.KOULUTUKSEN_RAKENNE, undefined);
        const jatkoOpinnot = l.localize(this.state.result.kuvausKomo.JATKOOPINTO_MAHDOLLISUUDET, undefined);
        return (
            <div className="container">
                <div className="row info-page">
                    <div className="col-xs-12 col-md-9 left-column">
                        <h1>
                            <i className="fa fa-circle ammatillinen-hattu" aria-hidden="true"></i>
                            <span>{this.parseNimi()}</span>
                        </h1>
                        <div className="row">
                            <div className="col-xs-12 left-column">
                                <KoulutusInfoBox result={this.state.result}/>
                            </div>
                        </div>

                        {osaamisalat &&
                        <div className="col-xs-12 col-md-9 left-column">
                            <h2 className="line_otsikko">Osaamisalat</h2>
                            <div className="">
                                <ul>
                                    <li className="osaamisalat_list_item">{osaamisalat}</li>
                                </ul>
                            </div>
                        </div>}

                        {tutkinnonOsat &&
                        <div className="col-xs-12 col-md-9 left-column">
                            <h2 className="line_otsikko">Tutkinnon rakenne</h2>
                            <div className="">
                                {renderHTML(tutkinnonOsat)}
                            </div>
                        </div>}

                        {jatkoOpinnot &&
                        <div className="col-xs-12 col-md-9 left-column">
                            <h2 className="line_otsikko">Jatko-opintomahdollisuudet</h2>
                            <div className="">
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