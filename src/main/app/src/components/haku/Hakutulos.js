import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import '../../assets/css/hakutulos.css'
import {observer, inject} from 'mobx-react';
import {Localizer as l} from '../../tools/Utils';

@inject("hakuStore")
@inject("urlStore")
@observer
class Hakutulos extends Component {

    constructor(props) {
        super(props);
        this.toggleKoulutus = this.toggleKoulutus.bind(this);
        this.toggleOppilaitos = this.toggleOppilaitos.bind(this);
    }

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

    toggleOppilaitos() {
        this.props.toggleAction('oppilaitos');
    }

    toggleKoulutus() {
        this.props.toggleAction('koulutus');
    }

    renderKeywordResultSummary() {
        return (
            <div className="col Etsinta">
                <h1>Etsintäsi tuotti {this.props.hakuStore.totalCount} osumaa termillä
                    <span className="highlight"> "{this.props.hakuStore.keyword}"</span>
                </h1>
            </div>
        )
    }

    renderFilterResultSummary() {
        const koulutustyypit = this.props.hakuStore.filterKoulutus.map((k) => {
            switch (k) {
                case 'lk': return 'lukiot';
                case 'amm': return 'ammatilliset tutkinnot';
                case 'kk': return 'korkeakoulut';
                case 'muu': return 'muut koulutukset';
                default: return '';
            }
        }).filter((k) => !!k).join(', ');
        const paikkakunta = this.props.hakuStore.filterPaikkakunta;

        return (
            <div className="col Etsinta">
                <h1>{this.props.hakuStore.keywordSet ? 'ja' : 'Etsintäsi tuotti ' + this.props.hakuStore.totalCount + ' osumaa'}
                    {koulutustyypit ? (this.props.hakuStore.filterKoulutus.length > 1 ? ' koulutustyypeillä ' : ' koulutustyypillä ') : '' }
                    {koulutustyypit ? <span className="highlight">"{koulutustyypit}"</span> : '' }
                    {paikkakunta ? (koulutustyypit ? ' sekä' : '' ) + ' paikkakunnalla ' : '' }
                    {paikkakunta ? <span className="highlight"> "{paikkakunta}"</span> : '' }
                </h1>
            </div>
        )
    }

    renderResultList() {
        if(this.props.hakuStore.toggleKoulutus) {
            return this.props.hakuStore.koulutusResult.map((r) => {
                const koulutusLinkString = '/koulutus/' + r.oid + '?haku=' + encodeURIComponent(this.props.hakuStore.createHakuUrl);
                const tyyli = "col-xs-12 search-box " + r.tyyppi + (r.haettavissa ? " haku" : "");
                return (
                    <div key={r.oid} className="col-xs-12 col-md-6 box-container">
                        <div className={tyyli}>
                            {/*<div className="suosikkit">
                                <i className="fa fa-heart-o" aria-hidden="true"></i>
                            </div>*/}
                            <div className="text">
                                <Link to={koulutusLinkString}>{this.getKoulutusNimi(r)}</Link>
                                <p>{r.tarjoaja ? r.tarjoaja : ""}<br/>{this.getKoulutusAiheet(r)}</p>
                            </div>
                            {/*<div className="compare-button">
                                <span role="button"></span>
                            </div>*/}
                        </div>
                    </div>)
            });
        } else {
            return this.props.hakuStore.oppilaitosResult.map((r) => {
                const oppilaitosLinkString = '/oppilaitos/' + r.oid + '?haku=' + encodeURIComponent(this.props.hakuStore.createHakuUrl);
                const tyyli = "col-xs-12 search-box " + r.tyyppi;
                return (
                    <div key={r.oid} className="col-xs-12 col-md-6 box-container">
                        <div className={tyyli}>
                            {/*<div className="suosikkit">
                                <i className="fa fa-heart-o" aria-hidden="true"></i>
                            </div>*/}
                            <div className="text">
                                <Link to={oppilaitosLinkString}>{this.getOppilaitosNimi(r)}</Link>
                                <p>{r.kayntiosoite ? r.kayntiosoite : ""}<br/>{r.postitoimipaikka ? r.postitoimipaikka : ""}</p>
                            </div>
                            {/*<div className="compare-button">
                                <span role="button"></span>
                            </div>*/}
                        </div>
                    </div>)
            })
        }
    }

    render() {
        const koulutusOppilaitosToggle =
            <div className="row">
                <div className="col-md-2 col-xs-12">
                    <h2 className="KoulutuksetOppilaitokset" onClick={this.toggleKoulutus}>
                        <span className={this.props.hakuStore.toggleKoulutus ? "Valittu" : ""}>Koulutukset</span>&nbsp;
                        <span className="Hakutulos_pallo">{this.props.hakuStore.koulutusCount}</span></h2>
                </div>
                <div className="col-md-2 col-xs-12">
                    <h2 className="KoulutuksetOppilaitokset" onClick={this.toggleOppilaitos}>
                        <span className={this.props.hakuStore.toggleKoulutus ? "" : "Valittu"}>Oppilaitokset</span>&nbsp;
                        <span className="Hakutulos_pallo">{this.props.hakuStore.oppilaitosCount}</span></h2>
                </div>
            </div>;

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
                    <div className="row">
                        {this.props.hakuStore.keywordSet ? this.renderKeywordResultSummary() : ''}
                        {this.props.hakuStore.filterSet ? this.renderFilterResultSummary() : ''}
                    </div>
                    {koulutusOppilaitosToggle}
                </div>
                <div className="container search-results">
                    <div className="row">
                        {this.renderResultList()}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Hakutulos;
