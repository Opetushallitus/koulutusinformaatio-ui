import React, { Component } from 'react';
import KoulutusInfoBox from './KoulutusInfoBox';
import KoulutusSidebar from './KoulutusSidebar';
import {Localizer as l, Parser as p} from '../../tools/Utils';
import AvoinInfoBox from "./AvoimenKurssinInfoBox";

class AvoinYoKoulutus extends Component {

    constructor(props) {
        super(props);
        this.state = {
            oid: props.oid,
            result: props.result,
        };
        console.log("Created element AoinYoKoulutus. Data: %O", this.state.result);
        console.log("props.nimi: " +  props.name);
    }

    parseNimi() {
        if(this.state.result && this.state.result.aihees.length === 1) {
            return l.localize(this.state.result.aihees[0], "Tuntematon koulutus")
        }
        return "";
    }

    parseKuvaus() {
        if(this.state.result && this.state.result.kuvausKomo && this.state.result.kuvausKomo.TAVOITTEET) {
            return p.removeHtmlTags(l.localize(this.state.result.kuvausKomo.TAVOITTEET));
        }
        return "";
    }

    render() {
        return (
            <div className="container">
                <div className="row info-page">
                    <div className="col-xs-12 col-md-9 left-column">
                        <h1>
                            <i className="fa fa-circle korkeakoulu-hattu" aria-hidden="true"></i>
                            <span>(Avoimen kurssi XYZ)</span>
                        </h1>
                        <div className="row">
                            <div className="col-xs-12 left-column">
                                <AvoinInfoBox result={this.state.result}/>
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-9 left-column">
                            <h2 className="line_otsikko">Yleiskuvaus</h2>
                            <div className="">
                                {this.parseKuvaus()}
                                <ul>

                                </ul>
                            </div>
                        </div>
                    </div>
                    <KoulutusSidebar/>
                </div>
            </div>
        );
    }
}

export default AvoinYoKoulutus;