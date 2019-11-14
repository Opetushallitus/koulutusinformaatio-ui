import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
import {Localizer as l} from "../../tools/Utils";
import {Link, withRouter} from "react-router-dom";
import {inject} from "mobx-react";
import LikeButton from '../common/LikeButton';

@inject("hakuStore")
class HakukohdeHeader extends Component {

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
            <p className="hakukohde-header-second">Hakukohteen tiedot ja valintaperusteet</p>
                <h1 id="hakukohde-header" className="d-flex justify-content-between">
                    <Link id="hakukohde-koulutus-link" to={link} className="header d-flex">
                        <span className="icon-ic-back-button"></span>
                        <span id="hakukohde-header-nimi">{this.parseNimi()}</span>
                    </Link>
                    <LikeButton />
                </h1>
                
            </div>
        );
    }
}

export default withTranslation()(HakukohdeHeader);