import React, {Component} from 'react';
import {translate} from 'react-i18next';
import {Localizer as l} from "../../tools/Utils";
import '../../assets/styles/components/_koulutus-header.scss';

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
            <div className="col-12">
                <h1>
                    <i className={hattuClass} aria-hidden="true"></i>
                    <span id={"koulutus-title"}>{this.parseNimi()}</span>
                </h1>
            </div>
            
        );
    }
}

export default KoulutusHeader;