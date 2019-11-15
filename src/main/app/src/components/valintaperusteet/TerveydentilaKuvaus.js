import React, {Component} from 'react';
import '../../assets/styles/components/_valintaperuste-page.scss';

class Hakukohde extends Component {

    render () {
        return (
        <div>
            <h1 className="valintaperuste-kuvaus-title">Hakijan terveydentila ja toimintakyky</h1>
            <div className="valintaperuste-kuvaus-text">Terveydentilasi tai toimintakykysi ei tarvitse olla opiskelijavalinnan esteenä. Sinua ei kuitenkaan voida valita koulutukseen, jos et kykene opintoihin liittyviin käytännön tehtäviin oppilaitoksessa, työpaikalla tai muussa oppimisympäristössä, jos tutkintoihin liittyvät turvallisuusvaatimukset sitä edellyttävät ja jos estettä ei voida kohtuullisin toimin poistaa.</div>
            <h2 className="valintaperuste-kuvaus-title">Esteenä opiskelijaksi ottamiselle voi olla:</h2>
            <div className="valintaperuste-list-wrapper">
                <div className="valintaperuste-list-item valintaperuste-kuvaus-text">ajankohtainen hoitamaton psykoosi tai vaikea toimintakykyä laskeva masennus tai muu</div>
                <div className="valintaperuste-list-item valintaperuste-kuvaus-text">psyykkistä terveyttä ja toimintakykyä rajoittava sairaus</div>
                <div className="valintaperuste-list-item valintaperuste-kuvaus-text">tuki- ja liikuntaelimistön sairaus, vamma tai muu fyysistä terveyttä ja toimintakykyä rajoittava sairaus</div>
                <div className="valintaperuste-list-item valintaperuste-kuvaus-text">toimintakykyä rajoittava ihon sairaus kuten krooninen ihottuma</div>
                <div className="valintaperuste-list-item valintaperuste-kuvaus-text">päihteiden ongelmakäyttö tai päihderiippuvuus.</div>
            </div>
        </div>
        );
    }
}

export default Hakukohde;