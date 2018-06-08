import React, { Component } from 'react';
import '../../assets/css/hakutulos.css'
import {observer, inject} from 'mobx-react';
import {Localizer as l} from '../../tools/Utils';
import HakutulosToggle from "./HakutulosToggle";
import HakutulosSummary from "./HakutulosSummary";
import HakutulosBox from "./HakutulosBox";
import Sivutus from './Sivutus';

@inject("hakuStore")
@observer
class Hakutulos extends Component {

    getKoulutusNimi(koulutus) {
        return l.localize(koulutus, "Koulutus (ei nimeä)");
    }

    getKoulutusAiheet(koulutus) {
        if(koulutus.aiheet && (0 < koulutus.aiheet.length)) {
            return koulutus.aiheet.map(a => l.localize(a, null)).filter(a => a != null).join(', ');
        }
        return "";
    }

    getOppilaitosNimi(oppilaitos) {
        return l.localize(oppilaitos, "Oppilaitos (ei nimeä)");
    }

    renderResultList() {
        if(this.props.hakuStore.toggleKoulutus) {
            return this.props.hakuStore.koulutusResult.map((r) => {
                const link = '/koulutus/' + r.oid + '?haku=' + encodeURIComponent(this.props.hakuStore.createHakuUrl);
                return (
                    <HakutulosBox key={r.oid}
                                  oid={r.oid}
                                  tyyppi={r.tyyppi}
                                  haettavissa={r.haettavissa}
                                  nimi={this.getKoulutusNimi(r)}
                                  link={link}
                                  text1={r.tarjoaja ? r.tarjoaja : ""}
                                  text2={this.getKoulutusAiheet(r)}/>)
            });
        } else {
            return this.props.hakuStore.oppilaitosResult.map((r) => {
                const link = '/oppilaitos/' + r.oid + '?haku=' + encodeURIComponent(this.props.hakuStore.createHakuUrl);
                return (
                    <HakutulosBox key={r.oid}
                                  oid={r.oid}
                                  tyyppi={r.tyyppi}
                                  haettavissa={false}
                                  nimi={this.getOppilaitosNimi(r)}
                                  link={link}
                                  text1={r.kayntiosoite ? r.kayntiosoite : ""}
                                  text2={r.postitoimipaikka ? r.postitoimipaikka : ""}/>)
            })
        }
    }

    render() {

        if(!this.props.hakuStore.keywordSet && !this.props.hakuStore.filterSet) {
            return (
                <React.Fragment>
                    <div className="container">
                        <div className="row">
                            <h1>Lisää hakusana tai hakurajain
                            </h1>
                        </div>
                    </div>
                </React.Fragment>
            )
        }

        return (
            <React.Fragment>
                <div className="container">
                    <HakutulosSummary/>
                    <HakutulosToggle/>
                </div>
                <div className="container search-results">
                    <div className="row">
                        {this.renderResultList()}
                    </div>
                </div>
                <Sivutus/>
            </React.Fragment>
        );
    }
}

export default Hakutulos;
