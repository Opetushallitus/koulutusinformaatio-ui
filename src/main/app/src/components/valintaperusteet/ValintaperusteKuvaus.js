import React, {Component} from 'react';
import '../../assets/styles/components/_valintaperuste-page.scss';

class Hakukohde extends Component {

    render () {
        return (
        <div>
            <h1 className="valintaperuste-kuvaus-title">Valintaperusteen kuvaus</h1>
            <h2 className="valintaperuste-kuvaus-title">Pisteitä peruskoulun tai valmistavan koulutuksen suorittaneille</h2>
            <div className="valintaperuste-kuvaus-text">Saat 6 pistettä, jos olet suorittanut perusopetuksen oppimäärän samana tai edellisenä vuonna kun haet.</div>
            <div className="valintaperuste-kuvaus-text">Saat 6 pistettä, jos olet suorittanut jonkin seuraavista samana tai edellisenä vuonna kun haet:</div>
            <div className="valintaperuste-list-wrapper">
                <div className="valintaperuste-list-item valintaperuste-kuvaus-text">kymppiluokan (vähintään 1100 tunnin laajuinen lisäopetus)</div>
                <div className="valintaperuste-list-item valintaperuste-kuvaus-text">ammatilliseen koulutukseen valmentavan koulutuksen, VALMA (vähintään 30 osaamispisteen osasuoritus)</div>
                <div className="valintaperuste-list-item valintaperuste-kuvaus-text">kansanopiston lukuvuoden mittaisen linjan (vähintään 28 opiskelijaviikkoa)</div>
                <div className="valintaperuste-list-item valintaperuste-kuvaus-text">maahanmuuttajille ja muille vieraskielisille tarkoitetun lukiokoulutukseen valmistavan koulutuksen, LUVA (vähintään 25 kurssia)</div>
            </div>
            <div className="valintaperuste-kuvaus-text">Saat 2 pistettä ammatillisesta koulutuksesta, jonka olet hakulomakkeessa merkinnyt 1. hakutoiveeksi.</div>
        </div>
        );
    }
}

export default Hakukohde;