import React, {Component} from 'react';
import '../../assets/styles/components/_valintaperuste-page.scss';

class Valintakokeet extends Component {

    render () {
        return (
        <div className="valintaperuste-box-wrapper">
            <h2 className="valintaperuste-kuvaus-title">Valintakokeet</h2>
            <div className="valintaperuste-valintakoe-box">
                <h3 className="valintaperuste-kuvaus-title">Pääsy- ja sovelutuvuuskoe</h3>
                <div className="valintaperuste-valintakoe-text-title">Osoite</div>
                <div className="valintaperuste-valintakoe-text">Ståhlberginkatu 6, 15000 Lahti</div>
                <div className="valintaperuste-valintakoe-ajoitus">
                    <div className="valintaperuste-valintakoe-alkaa">
                        <div className="valintaperuste-valintakoe-text-title">Alkaa</div>
                        <div className="valintaperuste-valintakoe-text">07.10.2019   Klo 09:00</div>
                    </div>
                    <div className="valintaperuste-valintakoe-päättyy">
                        <div className="valintaperuste-valintakoe-text-title">Päättyy</div>
                        <div className="valintaperuste-valintakoe-text">07.10.2019   Klo 16:00</div>
                    </div>
                </div>
                <div className="valintaperuste-valintakoe-text-title">Lisätietoa</div>
                <div className="valintaperuste-valintakoe-text">Hakijoiden tulee esittää henkilöllisyystodistus ennen kokeen alkamista.</div>
            </div>
        </div>
        );
    }
}

export default Valintakokeet;