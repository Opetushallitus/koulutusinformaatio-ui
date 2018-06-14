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

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        this.setState({
            oid: this.props.oid,
            result: this.props.result
        });
    }

    parseNimi() {
        if(this.props.result) {
            return l.localize(this.props.result.searchData.nimi, "Tuntematon koulutus")
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
        fields.push(["Tutkintonimikkeet", this.props.result.tutkintonimikes ? this.props.result.tutkintonimikes.map(t => l.localize(t) + " ") : '-']);

        return fields;
    }

    render() {
        const osaamisalat = l.localize(this.props.result.koulutusohjelma, undefined);
        const tutkinnonOsat = l.localize(this.props.result.kuvausKomo.KOULUTUKSEN_RAKENNE, undefined);
        const jatkoOpinnot = l.localize(this.props.result.kuvausKomo.JATKOOPINTO_MAHDOLLISUUDET, undefined);
        const hattuClass = this.props.muu ? "fa fa-circle muu-hattu" : "fa fa-circle ammatillinen-hattu";
        const nimi = this.parseNimi();
        return (
            <div className="container">
                <div className="row info-page">
                    <div className="col-xs-12 col-md-9 left-column">
                        <h1>
                            <i className={hattuClass} aria-hidden="true"></i>
                            <span>{nimi}</span>
                        </h1>
                        <div className="row">
                            <div className="col-xs-12 left-column">
                                <KoulutusInfoBox fields={this.parseInfoBoxFields()}/>
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