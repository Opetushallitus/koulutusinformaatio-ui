import React, {Component} from 'react';
import {translate} from 'react-i18next';
import {Localizer as l} from "../../tools/Utils";
import {Link} from "react-router-dom";
import {inject} from "mobx-react";
import LikeButton from '../common/LikeButton';

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
        const link = `/koulutus/${this.props.komoOid}?haku=${encodeURIComponent(this.props.hakuStore.createHakuUrl)}&lng=${l.getLanguage()}`;
        return (
            <div className="compare ">
                <h1 id="toteutus-header" className="d-flex justify-content-between">
                    <Link id="koulutus-link" to={link} className="header d-flex">
                        <span className="icon-ic-back-button"></span>
                        <span id="toteutus-header-nimi">{this.parseNimi()}</span>
                    </Link>
                    <LikeButton />
                </h1>
                
            </div>
        );
    }
}

export default ToteutusHeader;