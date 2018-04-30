import React, { Component } from 'react';
import koulutusIcon from '../../assets/images/kk_otsikonvieruskuva.png';
import sidebarPic from '../../assets/images/student-success.jpg'; //Joku satunnainen kuva vaan
import KoulutusInfo from './KoulutusInfo';
import {Localizer as l, Parser as p} from '../Utils';

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
            <div class="container">
                <div class="row info-page">
                    <div class="col-xs-12 col-md-9 left-column">
                        <h1>
                            <i class="fa fa-circle" aria-hidden="true"></i>
                            <span>{this.parseNimi()}</span>
                        </h1>
                        <div class="row">
                            <div class="col-xs-12 left-column">
                                <KoulutusInfo result={this.state.result}/>
                            </div>
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
                                {p.removeHtmlTags(tutkinnonOsat)}
                            </div>
                        </div>}

                    {jatkoOpinnot &&
                        <div class="col-xs-12 col-md-9 left-column">
                            <h2 class="line_otsikko">Jatko-opintomahdollisuudet</h2>
                            <div class="">
                                {p.removeHtmlTags(jatkoOpinnot)}
                            </div>
                        </div>}

                </div>
            </div>);
    }
}

export default Ammatillinen;