import React, { Component } from 'react';
import superagent from 'superagent';
import qs from 'query-string';
import '../../assets/css/hakutulos.css'
import {observer, inject} from 'mobx-react';
import Hakutulos from '../hakutulos/Hakutulos';
import Sivutus from './Sivutus';
import { withRouter, matchPath } from 'react-router'

@inject("hakuStore")
@inject("hakuehtoStore")
@inject("urlStore")
@observer
class Haku extends Component {

    constructor(props) {
        super(props);
        this.toggleAction = this.toggleAction.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
    }

    updateStores() {
        function pos (p, d) { return p > 0 ? p : d; }
        function compare (a1, a2) { return a1.length == a2.length && a1.every((v,i)=> v == a2[i])}

        const queryParams = qs.parse(this.props.location.search);

        const queryParamKoulutusPage = pos(Number(queryParams.kpage), 1);
        const queryParamOppilaitosPage = pos(Number(queryParams.opage), 1);
        const queryParamPageSize = pos(Number(queryParams.pagesize), 20);
        const queryParamFilterKoulutus = queryParams.koulutustyyppi ? queryParams.koulutustyyppi.split(',') : [];
        const queryParamFilterKieli = queryParams.kieli ? queryParams.kieli.split(',') : [];
        const queryParamFilterPaikkakunta = queryParams.paikkakunta ? queryParams.paikkakunta : '';
        const queryParamToggleKoulutus = ('oppilaitos' !== queryParams.toggle);

        const match = matchPath(this.props.history.location.pathname, {
            path: '/haku/:keyword',
            exact: true,
            strict: false
        });
        const keyword = match ? match.params.keyword : '';

        const doSearch =
            !(this.props.hakuStore.keyword == keyword &&
            this.props.hakuStore.currentPageKoulutus == queryParamKoulutusPage &&
            this.props.hakuStore.currentPageOppilaitos == queryParamOppilaitosPage &&
            this.props.hakuStore.pageSize == queryParamPageSize &&
            this.props.hakuStore.filter.paikkakunta == queryParamFilterPaikkakunta &&
            compare(this.props.hakuStore.filter.koulutus, queryParamFilterKoulutus) &&
            compare(this.props.hakuStore.filter.kieli, queryParamFilterKieli));

        this.props.hakuStore.currentPageOppilaitos = queryParamOppilaitosPage;
        this.props.hakuStore.pageSize = queryParamPageSize;
        this.props.hakuStore.currentPageKoulutus = queryParamKoulutusPage;
        this.props.hakuStore.filter.paikkakunta = queryParamFilterPaikkakunta;
        this.props.hakuStore.filter.koulutus = queryParamFilterKoulutus;
        this.props.hakuStore.filter.kieli = queryParamFilterKieli;
        this.props.hakuStore.toggleKoulutus = queryParamToggleKoulutus;
        this.props.hakuStore.keyword = keyword;

        this.props.hakuehtoStore.keyword = keyword;
        this.props.hakuehtoStore.filter.paikkakunta = queryParamFilterPaikkakunta;
        this.props.hakuehtoStore.filter.koulutus = queryParamFilterKoulutus;
        this.props.hakuehtoStore.filter.kieli = queryParamFilterKieli;

        if(doSearch) {
            this.search(queryParams.toggle)
        }
    }

    componentDidMount() {
        this.updateStores()
    }

    handleRefresh() {
        const queryParamToggle = qs.parse(this.props.location.search).toggle;
        const match = matchPath(this.props.history.location.pathname, {
            path: '/haku/:keyword',
            exact: true,
            strict: false
        });
        if(match) {
            this.props.hakuStore.keyword = match.params.keyword ? match.params.keyword : '';
            this.search(queryParamToggle)
        }
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        this.updateStores()
    }

    toggleAction(value) {
        this.props.hakuStore.toggleKoulutus = ('oppilaitos' !== value);
        this.props.history.replace(this.props.hakuStore.createHakuUrl);
    }

    static getKoulutuksetFromBackend(_this, _handleError) {
        return (superagent
            .get(_this.props.urlStore.urls.url('konfo-backend.search.koulutukset'))
            .query({keyword: _this.props.hakuStore.keyword,
                page: _this.props.hakuStore.currentPageKoulutus,
                size: _this.props.hakuStore.pageSize,
                paikkakunta: _this.props.hakuStore.filter.paikkakunta,
                koulutustyyppi: _this.props.hakuStore.filter.koulutus.join(','),
                kieli: _this.props.hakuStore.filter.kieli.map((k) => 'kieli_' + k).join(',')})
            .catch(_handleError))
    }

    static getOppilaitoksetFromBackend(_this, _handleError) {
        return (superagent
            .get(_this.props.urlStore.urls.url('konfo-backend.search.oppilaitokset'))
            .query({keyword: _this.props.hakuStore.keyword,
                page: _this.props.hakuStore.currentPageOppilaitos,
                size: _this.props.hakuStore.pageSize,
                paikkakunta: _this.props.hakuStore.filter.paikkakunta,
                koulutustyyppi: _this.props.hakuStore.filter.koulutus.join(','),
                kieli: _this.props.hakuStore.filter.kieli.map((k) => 'kieli_' + k).join(',')})
            .catch(_handleError))
    }

    search(toggle) {
        const _this = this;
        const _handleError = (e) => { console.log(e); _this.setState({error: e})};
        if(this.props.hakuStore.keywordSet || this.props.hakuStore.filterSet) {
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
                <Hakutulos {...this.props}/>
                <Sivutus handleRefresh={this.handleRefresh}/>
            </React.Fragment>
        );
    }
}

export default Haku;