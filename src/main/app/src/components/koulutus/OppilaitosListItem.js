import {Component} from "react";
import React from "react";
import { translate } from 'react-i18next';
import {Link} from "react-router-dom";
import { Localizer as l } from '../../tools/Utils';
import {inject} from "mobx-react";

@translate()
@inject("hakuStore", "vertailuStore")
class OppilaitosListItem extends Component {

    render () {
        const oppilaitos = this.props.toteutus;
        const tyyli = "col-xs-12 search-box " + oppilaitos.tyyppi;
        const link = '/toteutus/' + oppilaitos.oid + '?haku=' + encodeURIComponent(this.props.hakuStore.createHakuUrl)
            + '&lng=' + l.getLanguage();
        return (
            <div className="row">
                <div key={oppilaitos.oid} className={tyyli}>
                    {oppilaitos.haettavissa && <div className="haku">{this.props.t("haku.haku")}</div>}
                    <div className="suosikkit">
                        <i className="fa fa-heart-o" aria-hidden="true"/>
                    </div>
                    <div className="text">
                        <Link to={link} className={"hakutulosbox-link"}>{l.localize(oppilaitos.tarjoaja, this.props.t("koulutus.tuntematon"))}</Link>
                        <p>{l.localize(oppilaitos.osaamisala, "")}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default OppilaitosListItem;