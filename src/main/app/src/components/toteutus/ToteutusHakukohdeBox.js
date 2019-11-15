import React, {Component} from 'react';
import '../../assets/styles/components/_toteutus-additional-info-box.scss';
import '../../assets/styles/components/_toteutus-page.scss';
import { Localizer as l } from '../../tools/Utils';
import {Link} from "react-router-dom";

class ToteutusHakukohdeBox extends Component {

    render () {
        const valintaperusteOid= '1.2.246.562.20.00000000000000000002';
        const valintaperusteLink = '/valintaperusteet/' + valintaperusteOid + '&lng=' + l.getLanguage();
        return (
        <div>
            <h1 className="toteutus-additional-info-header">Koulutuksen hakukohteet</h1>
            <div className="rectangle"></div>
            <div className="hakukohde-info-wrapper">
                <div className="hakukohde-info-box">
                    <div className="hakukohde-info-text-box">
                        <h2 className="hakukohde-info-title">Sosiaali- ja terveysalan perustutkinto</h2>
                        <div className="hakukohde-info-span-box">
                            <div className="hakukohde-info-span-box-cell-title">
                                <span>Haku:</span>
                                <span>Hakuaika:</span>
                                <span>Opiskelupaikkoja:</span>
                                <span>Pohjakoulutus:</span>
                                <span>Tutkintonimike:</span>
                                <span>Osaamisalat:</span>
                            </div>
                            <div className="hakukohde-info-span-box-cell">
                                <span>Yhteishaku</span>
                                <span>19.2.2019-12.3.2019</span>
                                <span>25</span>
                                <span>Ylioppilastutkinto</span>
                                <span>Lähihoitaja</span>
                                <span>-</span>
                            </div>
                        </div>
                        <div>
                            <span>Viipulantien toimipaikka - Vilppulantie 14, 00700 Helsinki</span>
                        </div>
                        <div className="hakukohde-haku-button-wrapper hakulomake">
                            <a role="button" aria-label="Etsi" className="hakukohde-button paattynyt" href="">Haku päättynyt</a>
                        </div>
                        <div className="hakukohde-haku-button-wrapper valintaperusteet">
                            <Link to={{ pathname: valintaperusteLink, state: {valintaperusteOid: valintaperusteOid }}} className="valintaperusteet-button">Lisätietoja valintaperusteista</Link>
                        </div>
                    </div>
                </div>
                <div className="hakukohde-info-box">
                    <div className="hakukohde-info-text-box">
                        <h2 className="hakukohde-info-title">Sosiaali- ja terveysalan perustutkinto</h2>
                        <div className="hakukohde-info-span-box">
                            <div className="hakukohde-info-span-box-cell-title">
                                <span>Haku:</span>
                                <span>Hakuaika:</span>
                                <span>Opiskelupaikkoja:</span>
                                <span>Pohjakoulutus:</span>
                                <span>Tutkintonimike:</span>
                                <span>Osaamisalat:</span>
                            </div>
                            <div className="hakukohde-info-span-box-cell">
                                <span>Yhteishaku</span>
                                <span>19.2.2019-12.3.2019</span>
                                <span>25</span>
                                <span>Ylioppilastutkinto</span>
                                <span>Lähihoitaja</span>
                                <span>-</span>
                            </div>
                        </div>
                        <div>
                            <span>Viipulantien toimipaikka - Vilppulantie 14, 00700 Helsinki</span>
                        </div>
                        <div className="hakukohde-haku-button-wrapper hakulomake">
                            <a role="button" aria-label="Etsi" className="hakukohde-button aktiivinen" href="">Haku käynnissä</a>
                        </div>
                        <div className="hakukohde-haku-button-wrapper valintaperusteet">
                            <Link to={{ pathname: valintaperusteLink, state: {valintaperusteOid: valintaperusteOid }}} className="valintaperusteet-button">Lisätietoja valintaperusteista</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default ToteutusHakukohdeBox;