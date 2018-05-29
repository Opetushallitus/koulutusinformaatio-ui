import React, { Component } from 'react';
import superagent from 'superagent';
import qs from 'query-string';
import '../../assets/css/hakutulos.css'
import {observer, inject} from 'mobx-react';
import Hakupalkki from './Hakupalkki';
import Hakutulos from './Hakutulos';
import Sivutus from './Sivutus';
import Hakurajain from "./Hakurajain";

@inject("hakuStore")
@inject("urlStore")
@observer
class Haku extends Component {

    constructor(props) {
        super(props);
        this.searchAction = this.searchAction.bind(this);
        this.toggleAction = this.toggleAction.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
    }

    componentDidMount() {
        const queryParamPage = Number(qs.parse(this.props.location.search).page);
        const queryParamPageSize = Number(qs.parse(this.props.location.search).pagesize);
        const queryParamFilterOppilaitos = qs.parse(this.props.location.search).oppilaitos;
        const queryParamFilterPaikkakunta = qs.parse(this.props.location.search).paikkakunta;

        if (this.props.hakuStore.toggleKoulutus) {
            this.props.hakuStore.currentPageKoulutus = queryParamPage > 0 ? queryParamPage : 1;
            this.props.hakuStore.pageSizeKoulutus = queryParamPageSize > 0 ? queryParamPageSize : 20;
        } else {
            this.props.hakuStore.currentPageOppilaitos = queryParamPage > 0 ? queryParamPage : 1;
            this.props.hakuStore.pageSizeOppilaitos = queryParamPageSize > 0 ? queryParamPageSize : 20;
        }

        this.props.hakuStore.filterPaikkakunta = queryParamFilterPaikkakunta ? queryParamFilterPaikkakunta : '';
        this.props.hakuStore.filterOppilaitos = queryParamFilterOppilaitos ? queryParamFilterOppilaitos.split(',') : [];
        this.handleRefresh();
    }

    handleRefresh(paginationEvent = false) {
        const queryParamToggle = qs.parse(this.props.location.search).toggle;

        if(this.props.hakuStore.keyword !== this.props.match.params.keyword || paginationEvent) {
            this.props.hakuStore.keyword = this.props.match.params.keyword;

            this.search(queryParamToggle)
        } else if(queryParamToggle) {
            this.toggleAction(queryParamToggle)
        }
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        this.handleHistory()
    }

    handleHistory() {
        const queryParamToggle = qs.parse(this.props.location.search).toggle;

        if(this.props.hakuStore.keyword !== this.props.match.params.keyword) {
            this.props.hakuStore.keyword = this.props.match.params.keyword;
            this.search(queryParamToggle)
        } else {
            this.props.hakuStore.toggleKoulutus = ('oppilaitos' !== queryParamToggle);
        }
    }

    changeUrl() {
        if(this.props.hakuStore.keyword === this.props.match.params.keyword) {
            this.props.history.replace(this.props.hakuStore.createHakuUrl);
        } else {
            this.props.history.push(this.props.hakuStore.createHakuUrl);
        }
    }

    searchAction(newKeyword) {
        if(newKeyword !== this.props.hakuStore.keyword) {
            this.props.hakuStore.keyword = newKeyword;
            this.props.hakuStore.currentPageKoulutus = 1;
            this.props.hakuStore.currentPageOppilaitos = 1;
            this.search();
        }
    }

    toggleAction(value) {
        this.props.hakuStore.toggleKoulutus = ('oppilaitos' !== value);
        this.changeUrl();
    }

    static getKoulutuksetFromBackend(_this, _handleError) {
        return (superagent
            .get(_this.props.urlStore.urls.url('konfo-backend.search.koulutukset'))
            .query({keyword: _this.props.hakuStore.keyword,
                page: _this.props.hakuStore.currentPageKoulutus,
                size: _this.props.hakuStore.pageSizeKoulutus,
                paikkakunta: _this.props.hakuStore.filterPaikkakunta,
                oppilaitostyyppi: _this.props.hakuStore.filterOppilaitos.join(',')})
            .catch(_handleError))
    }

    static getOppilaitoksetFromBackend(_this, _handleError) {
        return (superagent
            .get(_this.props.urlStore.urls.url('konfo-backend.search.oppilaitokset'))
            .query({keyword: _this.props.hakuStore.keyword,
                page: _this.props.hakuStore.currentPageOppilaitos,
                size: _this.props.hakuStore.pageSizeOppilaitos,
                paikkakunta: _this.props.hakuStore.filterPaikkakunta,
                oppilaitostyyppi: _this.props.hakuStore.filterOppilaitos.join(',')})
            .catch(_handleError))
    }

    search(toggle) {
        const _this = this;
        const _handleError = (e) => { console.log(e); _this.setState({error: e})};
        if(this.props.hakuStore.keywordSet) {
            Promise.all([
                Haku.getKoulutuksetFromBackend(_this, _handleError()),
                Haku.getOppilaitoksetFromBackend(_this, _handleError())
            ]).then((result) => {
                _this.props.hakuStore.koulutusResult = [];
                _this.props.hakuStore.oppilaitosResult = [];
                _this.props.hakuStore.koulutusResult = result[0] ? result[0].body.result : [];
                _this.props.hakuStore.koulutusCount = result[0] ? result[0].body.count : 0;
                _this.props.hakuStore.oppilaitosResult = result[1] && result[1].body ? result[1].body.result : [];
                _this.props.hakuStore.oppilaitosCount = result[1] && result[1].body ? result[1].body.count : 0;

                if(toggle) {
                    _this.toggleAction(toggle);
                } else {
                    _this.toggleAction(this.props.hakuStore.koulutusCount >= this.props.hakuStore.oppilaitosCount ? 'koulutus' : 'oppilaitos');
                }
            }).catch(_handleError);
        }
    }

    render() {
        return (
            <React.Fragment>
                <Hakupalkki searchAction={this.searchAction}/>
                <Hakurajain hakuStore={this.props.hakuStore} handleRefresh={this.handleRefresh}/>
                <Hakutulos toggleAction={this.toggleAction}/>
                <Sivutus handleRefresh={this.handleRefresh}/>
            </React.Fragment>
        );
    }
}

export default Haku;