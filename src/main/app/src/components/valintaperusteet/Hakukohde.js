import React, {Component} from 'react';
import '../../assets/styles/components/_toteutus-additional-info-box.scss';
import '../../assets/styles/components/_toteutus-page.scss';
import { Localizer as l } from '../../tools/Utils';
import {Link} from "react-router-dom";

class Hakukohde extends Component {

    render () {
        return (
        <div>
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
                            <a role="button" aria-label="Etsi" className="hakukohde-button aktiivinen" href="">Täytä hakulomake</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default Hakukohde;