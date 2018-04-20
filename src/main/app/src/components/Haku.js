import React, { Component } from 'react';
import superagent from 'superagent';
import { Link } from 'react-router-dom'
import {observer, inject} from 'mobx-react';

@inject("hakuStore")
@inject("urlStore")
@observer
class Haku extends Component {

    constructor(props) {
        super(props);
        this.state = {
            keywordInput : props.location.state && props.location.state.keyword ? props.location.state.keyword : '',
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
        if(this.state.keywordInput && !(0 === this.state.keywordInput.length)) {
            superagent
                .get(this.props.urlStore.urls.url('konfo-backend.search.koulutukset'))
                .query({keyword: this.state.keywordInput})
                .end((err, res) => {
                    //console.log(res.body.result.map((m) => m.nimi));
                    this.props.hakuStore.keyword = this.state.keywordInput;
                    this.props.hakuStore.result = res ? res.body.result : [];
                    this.props.hakuStore.total = res ? res.body.count : 0;
                    this.setState({
                        keywordInput: '',
                        error: err
                    })
                });
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
        const result = this.props.hakuStore.result;
        const count = this.props.hakuStore.count;
        const total = this.props.hakuStore.total;
        const keyword = this.props.hakuStore.keyword;
        const keywordSet = this.props.hakuStore.keywordSet;

        var resultSummary = <div/>
        if(keywordSet) {
            resultSummary =
                <div class="col-xs-12">
                    <h1>Etsintäsi tuotti {total} osumaa, termillä
                        <span class="highlight"> "{keyword}"</span>
                    </h1>
                </div>
        }

        var resultList = <div/>
        if(0 < count) {
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
                <div class="container search-results">
                    <div class="row">
                        {resultSummary}
                    </div>
                    <div class="row">
                        {resultList}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Haku;