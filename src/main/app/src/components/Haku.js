import React, { Component } from 'react';
import superagent from 'superagent';
import { Link } from 'react-router-dom'
import '../assets/css/hakutulos.css'
import {observer, inject} from 'mobx-react';

@inject("hakuStore")
@inject("urlStore")
@observer
class Haku extends Component {

    constructor(props) {
        super(props);
        this.state = {
            keywordInput : props.location.state && props.location.state.keyword ? props.location.state.keyword : '',
            toggleKoulutus : true,
            error: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    async componentDidMount() {
        if(this.state.keywordInput) {
            this.search();
        }
    }

    search() {
        const _this = this;
        const _handleError = (e) => { console.log(e); _this.setState({error: e})};
        if(this.state.keywordInput && !(0 === this.state.keywordInput.length)) {
            Promise.all([
                superagent
                    .get(this.props.urlStore.urls.url('konfo-backend.search.koulutukset'))
                    .query({keyword: this.state.keywordInput})
                    .catch(_handleError),
                superagent
                    .get(this.props.urlStore.urls.url('konfo-backend.search.organisaatiot'))
                    .query({keyword: this.state.keywordInput})
                    .catch(_handleError)
            ]).then((result) => {
                _this.props.hakuStore.koulutusResult = result[0] ? result[0].body.result : [];
                _this.props.hakuStore.koulutusCount = result[0] ? result[0].body.count : 0;
                _this.props.hakuStore.oppilaitosResult = result[1] ? result[1].body.result : [];
                _this.props.hakuStore.oppilaitosCount = result[1] ? result[1].body.count : 0;
                _this.props.hakuStore.keyword = _this.state.keywordInput;
                _this.setState({toggleKoulutus : this.props.hakuStore.koulutusCount >= this.props.hakuStore.oppilaitosCount});
            }).catch(_handleError);
        }
    }

    handleChange(event) {
        this.setState({keywordInput: event.target.value});
    }

    handleSubmit(event){
        this.search();
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

    render() {
        const result = this.props.hakuStore.koulutusResult;
        const total = this.props.hakuStore.totalCount;
        const keyword = this.props.hakuStore.keyword;
        const keywordSet = this.props.hakuStore.keywordSet;

        var resultSummary = <div/>
        if(keywordSet) {
            resultSummary =
                <div class="col Etsinta">
                    <h1>Etsintäsi tuotti {total} osumaa, termillä
                        <span class="highlight"> "{keyword}"</span>
                    </h1>
                </div>
        }

        var koulutusOppilaitosToggle = <div/>
        if(keywordSet) {
            koulutusOppilaitosToggle =
                <div class="row">
                    <div class="col-md-2 col-xs-12">
                        <h2 class="KoulutuksetOppilaitokset" onClick={(e) => {this.setState({toggleKoulutus: true})}}>
                            <span class={this.state.toggleKoulutus ? "Valittu" : ""}>Koulutukset</span>&nbsp;
                            <span class="Hakutulos_pallo">{this.props.hakuStore.koulutusCount}</span></h2>
                    </div>
                    <div class="col-md-2 col-xs-12">
                        <h2 class="KoulutuksetOppilaitokset" onClick={(e) => {this.setState({toggleKoulutus: false})}}>
                            <span class={this.state.toggleKoulutus ? "" : "Valittu"}>Oppilaitokset</span>&nbsp;
                            <span class="Hakutulos_pallo">{this.props.hakuStore.oppilaitosCount}</span></h2>
                    </div>
                </div>
        }

        var resultList = <div/>
        if(this.props.hakuStore.hasKoulutusResult && this.state.toggleKoulutus) {
            resultList = result.map((r) => {
                var tyyli = "col-xs-12 search-box " + this.getKoulutusStyle(r) + (r.haettavissa ? " haku" : "");
                return (
                    <div class="col-xs-12 col-md-6 box-container">
                        <div className={tyyli}>
                            {/*<div class="suosikkit">
                                <i class="fa fa-heart-o" aria-hidden="true"></i>
                            </div>*/}
                            <div class="text">
                                <Link to={{ pathname: '/koulutus/'+r.oid, state: r }}>{this.getKoulutusNimi(r)}</Link>
                                <p>{r.tarjoaja ? r.tarjoaja : ""}<br/>{this.getKoulutusAiheet(r)}</p>
                            </div>
                            {/*<div class="compare-button">
                                <span role="button"></span>
                            </div>*/}
                        </div>
                    </div>)

            });
        } else if(this.props.hakuStore.hasOppilaitosResult && !this.state.toggleKoulutus) {
            resultList = this.props.hakuStore.oppilaitosResult.map((r) => {
                return (
                    <div class="col-xs-12 col-md-6 box-container">
                        <div class="col-xs-12 search-box">
                            {/*<div class="suosikkit">
                                <i class="fa fa-heart-o" aria-hidden="true"></i>
                            </div>*/}
                            <div class="text">
                                <Link to={{ pathname: '/oppilaitos/'+r.oid, state: r }}>{r.nimi}</Link>
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
                <div class="container-fluid" id="call-to-action-secondary">
                    <div class="jumbotron">
                        <div class="container">
                            <div class="row">
                                <div class="col-xs-12 col-md-8 header-search">
                                    <input id="regular-input" class="oph-input" type="text" placeholder="Etsi ja vertaile koulutuksia ja oppilaitoksia"
                                           onChange={this.handleChange} onKeyPress={(e) => { if(e.key === 'Enter'){ this.handleSubmit() }}}/>
                                    <button class="search-button" onClick={this.handleSubmit}/>
                                </div>
                            </div>
                        </div>
                        <div class="container">
                            <div class="row">
                                <div class="col-xs-12">
                                    <div class="filter-button" role="button">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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

export default Haku;