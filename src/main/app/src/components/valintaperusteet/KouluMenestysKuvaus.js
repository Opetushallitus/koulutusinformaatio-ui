import React, {Component} from 'react';
import '../../assets/styles/components/_valintaperuste-page.scss';

class KouluMenestysKuvaus extends Component {

    render () {
        return (
        <div className="valintaperuste-box-wrapper">
            <h2 className="valintaperuste-kuvaus-title">Pisteitä yleisestä kolumenestyksestä</h2>
            <div className="valintaperuste-kuvaus-text">Saat 1–16 pistettä yleisestä koulumenestyksestä keskiarvon perusteella. Valinnassa lasketaan keskiarvo seuraavista oppiaineista: äidinkieli ja kirjallisuus, toinen kotimainen kieli, vieraat kielet, uskonto tai elämänkatsomustieto, historia, yhteiskuntaoppi, matematiikka, fysiikka, kemia, biologia, maantieto, liikunta, terveystieto, musiikki, kuvataide, käsityö, kotitalous.</div>
            <div className="valintaperuste-kuvaus-text">Jos sinulla on arvosana useammasta samaan yhteiseen oppiaineeseen kuuluvasta vähintään kahden vuosiviikkotunnin valinnaisaineesta, lasketaan valinnassa ensin niiden keskiarvo. Pisteesi yleisestä koulumenestyksestä lasketaan siis yhteisen aineen arvosanan ja siihen kuuluvan valinnaisaineen keskiarvosta tai valinnaisaineiden keskiarvosta.</div>
        </div>
        );
    }
}

export default KouluMenestysKuvaus;