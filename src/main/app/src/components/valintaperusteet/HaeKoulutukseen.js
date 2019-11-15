import React, {Component} from 'react';
import '../../assets/styles/components/_valintaperuste-page.scss';

class KouluMenestysKuvaus extends Component {

    render () {
        return (
        <div className="valintaperuste-box-wrapper">
            <h2 className="valintaperuste-kuvaus-title">Hae koulutukseen</h2>
            <div className="valintaperuste-haku-button-wrapper hakulomake">
                <a role="button" aria-label="Etsi" className="hakukohde-button" href="">Täytä hakulomake</a>
            </div>
            <div className="valintaperuste-haku-button-wrapper paluu">
                <a role="button" aria-label="Etsi" className="paluu-button" href="">Sulje valintaperusteet</a>
            </div>
        </div>
        );
    }
}

export default KouluMenestysKuvaus;