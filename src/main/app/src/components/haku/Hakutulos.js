import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import '../../assets/css/hakutulos.css'
import {observer, inject} from 'mobx-react';

@inject("hakuStore")
@inject("urlStore")
@observer
class Hakutulos extends Component {

    constructor(props) {
        super(props);
        this.toggleKoulutus = this.toggleKoulutus.bind(this);
        this.toggleOppilaitos = this.toggleOppilaitos.bind(this);
    }

    getKoulutusStyle(koulutus) {
        if(koulutus.tyyppi === 'LUKIOKOULUTUS') {
            return 'lk'
        }
        if(koulutus.tyyppi === 'KORKEAKOULUTUS' && !(koulutus.avoin)) {
            return 'kk'
        }
        if(koulutus.avoin) {
            return 'ako'
        }
        return 'amk'
    }

    getKoulutusNimi(koulutus) {
        if(koulutus.nimi) {
            return koulutus.nimi.kieli_fi;
        } else if(koulutus.hakukohteet && (0 < koulutus.hakukohteet.length)) {
            //Avoimen yliopiston koulutuksen nimi näyttäisi olevan hakukohteen nimenä
            return koulutus.hakukohteet[0].nimi.fi;
        }
        return "Koulutus (ei nimeä)"
    }

    getKoulutusAiheet(koulutus) {
        if (koulutus.opintoala) {
            return koulutus.opintoala.kieli_fi;
        } else if(koulutus.aiheet && (0 < koulutus.aiheet.length)) {
            return koulutus.aiheet.map(a => a.nimi.kieli_fi).join(', ');
        }
        return "";
    }

    getOppilaitosNimi(oppilaitos) {
        if(oppilaitos.nimi.fi) {
            return oppilaitos.nimi.fi;
        } else if (oppilaitos.nimi.sv) {
            return oppilaitos.nimi.sv;
        } else if (oppilaitos.nimi.en) {
            return oppilaitos.nimi.en;
        }
        return "Oppilaitos (ei nimeä)"
    }

    toggleOppilaitos() {
        this.props.toggleAction('oppilaitos');
    }

    toggleKoulutus() {
        this.props.toggleAction('koulutus');
    }

    render() {
        var resultSummary = <div/>
        if(this.props.hakuStore.keywordSet) {
            resultSummary =
                <div class="col Etsinta">
                    <h1>Etsintäsi tuotti {this.props.hakuStore.totalCount} osumaa termillä
                        <span class="highlight"> "{this.props.hakuStore.keyword}"</span>
                    </h1>
                </div>
        }

        var koulutusOppilaitosToggle = <div/>
        if(this.props.hakuStore.keywordSet) {
            koulutusOppilaitosToggle =
                <div class="row">
                    <div class="col-md-2 col-xs-12">
                        <h2 class="KoulutuksetOppilaitokset" onClick={this.toggleKoulutus}>
                            <span class={this.props.hakuStore.toggleKoulutus ? "Valittu" : ""}>Koulutukset</span>&nbsp;
                            <span class="Hakutulos_pallo">{this.props.hakuStore.koulutusCount}</span></h2>
                    </div>
                    <div class="col-md-2 col-xs-12">
                        <h2 class="KoulutuksetOppilaitokset" onClick={this.toggleOppilaitos}>
                            <span class={this.props.hakuStore.toggleKoulutus ? "" : "Valittu"}>Oppilaitokset</span>&nbsp;
                            <span class="Hakutulos_pallo">{this.props.hakuStore.oppilaitosCount}</span></h2>
                    </div>
                </div>
        }

        var resultList = <div/>
        if(this.props.hakuStore.hasKoulutusResult && this.props.hakuStore.toggleKoulutus) {
            resultList = this.props.hakuStore.koulutusResult.map((r) => {
                const koulutusLinkString = '/koulutus/' + r.oid + '?haku=' + encodeURIComponent(this.props.hakuStore.createHakuUrl);
                var tyyli = "col-xs-12 search-box " + this.getKoulutusStyle(r) + (r.haettavissa ? " haku" : "");
                return (
                    <div class="col-xs-12 col-md-6 box-container">
                        <div className={tyyli}>
                            {/*<div class="suosikkit">
                                <i class="fa fa-heart-o" aria-hidden="true"></i>
                            </div>*/}
                            <div class="text">
                                <Link to={koulutusLinkString}>{this.getKoulutusNimi(r)}</Link>
                                <p>{r.tarjoaja ? r.tarjoaja : ""}<br/>{this.getKoulutusAiheet(r)}</p>
                            </div>
                            {/*<div class="compare-button">
                                <span role="button"></span>
                            </div>*/}
                        </div>
                    </div>)
            });
        } else if(this.props.hakuStore.hasOppilaitosResult && !this.props.hakuStore.toggleKoulutus) {
            resultList = this.props.hakuStore.oppilaitosResult.map((r) => {
                const oppilaitosLinkString = '/oppilaitos/' + r.oid + '?haku=' + encodeURIComponent(this.props.hakuStore.createHakuUrl);
                return (
                    <div class="col-xs-12 col-md-6 box-container">
                        <div class="col-xs-12 search-box">
                            {/*<div class="suosikkit">
                                <i class="fa fa-heart-o" aria-hidden="true"></i>
                            </div>*/}
                            <div class="text">
                                <Link to={oppilaitosLinkString}>{this.getOppilaitosNimi(r)}</Link>
                                <p>{r.kayntiosoite ? r.kayntiosoite : ""}<br/>{r.postitoimipaikka ? r.postitoimipaikka : ""}</p>
                            </div>
                            {/*<div class="compare-button">
                                <span role="button"></span>
                            </div>*/}
                        </div>
                    </div>)

            });
        }

        return (
            <React.Fragment>
                <div class="container">
                    <div class="row">
                        {resultSummary}
                    </div>
                    {koulutusOppilaitosToggle}
                </div>
                <div class="container search-results">
                    <div class="row">
                        {resultList}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Hakutulos;
