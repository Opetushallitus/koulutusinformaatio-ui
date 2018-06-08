import React, { Component } from 'react';
import superagent from 'superagent';
import qs from 'query-string';
import '../../assets/css/hakutulos.css'
import {observer, inject} from 'mobx-react';
import Hakutulos from '../hakutulos/Hakutulos';
import { withRouter, matchPath } from 'react-router'

@inject("hakuStore")
@inject("hakuehtoStore")
@inject("urlStore")
@observer
class Haku extends Component {

    constructor(props) {
        super(props);
        this.toggleAction = this.toggleAction.bind(this);
    }

    updateStores() {
        const hakuStore = this.props.hakuStore;
        const search = qs.parse(this.props.location.search);
        const match = matchPath(this.props.history.location.pathname, {
            path: '/haku/:keyword',
            exact: true,
            strict: false
        });
        const keywordChange = hakuStore.setKeyword(match.params.keyword);
        const filterChange = hakuStore.setFilter({
            koulutus: search.koulutustyyppi,
            kieli: search.kieli,
            paikkakunta: search.paikkakunta });
        const pagingChange = hakuStore.setPaging({
            pageOppilaitos: search.opage,
            pageKoulutus: search.kpage,
            pageSize: search.pagesize
        });

        hakuStore.setToggle(search.toggle);

        this.props.hakuehtoStore.setKeyword(match.params.keyword);
        this.props.hakuehtoStore.setFilter({
            koulutus: search.koulutustyyppi,
            kieli: search.kieli,
            paikkakunta: search.paikkakunta });

        if(keywordChange || filterChange || pagingChange) {
            this.search(search.toggle)
        }
    }

    componentDidMount() {
        this.updateStores()
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        this.updateStores()
    }

    toggleAction(value) {
        this.props.hakuStore.setToggle(value);
        this.props.history.replace(this.props.hakuStore.createHakuUrl);
    }

    static getKoulutuksetFromBackend(_this, _handleError) {
        return (superagent
            .get(_this.props.urlStore.urls.url('konfo-backend.search.koulutukset'))
            .query({keyword: _this.props.hakuStore.keyword,
                page: _this.props.hakuStore.paging.pageKoulutus,
                size: _this.props.hakuStore.paging.pageSize,
                paikkakunta: _this.props.hakuStore.filter.paikkakunta,
                koulutustyyppi: _this.props.hakuStore.filter.koulutus.join(','),
                kieli: _this.props.hakuStore.filter.kieli.map((k) => 'kieli_' + k).join(',')})
            .catch(_handleError))
    }

    static getOppilaitoksetFromBackend(_this, _handleError) {
        return (superagent
            .get(_this.props.urlStore.urls.url('konfo-backend.search.oppilaitokset'))
            .query({keyword: _this.props.hakuStore.keyword,
                page: _this.props.hakuStore.paging.pageOppilaitos,
                size: _this.props.hakuStore.paging.pageSize,
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

                if(!toggle) {
                    _this.toggleAction(this.props.hakuStore.koulutusCount >= this.props.hakuStore.oppilaitosCount ? 'koulutus' : 'oppilaitos');
                }
            }).catch(_handleError);
        }
    }

    render() {
        return (
            <Hakutulos {...this.props}/>
        );
    }
}

export default Haku;