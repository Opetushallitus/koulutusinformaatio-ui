import React, {Component} from 'react';
import {translate} from 'react-i18next';
import {Localizer as l} from "../../tools/Utils";
import {Link} from "react-router-dom";
import {inject} from "mobx-react";

@translate()
@inject("hakuStore")
class ToteutusHeader extends Component {

    parseNimi() {
        if(this.props.nimi) {
            return l.localize(this.props.nimi, this.props.t("koulutus.tuntematon"), 'fi')
        }
        return ""
    }

    render () {
        const link = '/koulutus/' + this.props.komoOid + '?haku=' +
            encodeURIComponent(this.props.hakuStore.createHakuUrl)
            + '&lng=' + l.getLanguage();
        return (
            <div className="compare">
                <h1>
                    <Link to={link} className="header" >
                        <span className="light-font">{this.props.organisaatio}</span>
                        <p>{this.parseNimi()}</p>
                    </Link>
                </h1>
            </div>
        );
    }
}

export default ToteutusHeader;