import React, {Component} from 'react';
import {translate} from 'react-i18next';
import {Localizer as l} from "../../tools/Utils";

@translate()
class KoulutusHeader extends Component {

    parseNimi() {
        if(this.props.nimi) {
            return l.localize(this.props.nimi, this.props.t("koulutus.tuntematon"))
        }
        return ""
    }

    render () {
        const hattuClass = "fa fa-circle " + this.props.hattu;
        return (
            <h1>
                <i className={hattuClass} aria-hidden="true"></i>
                <span id={"koulutus-title"}>{this.parseNimi()}</span>
            </h1>
        );
    }
}

export default KoulutusHeader;