import React, { Component } from 'react';
import qs from 'query-string';
import '../../assets/css/hakutulos.css'
import {observer, inject} from 'mobx-react';
import Hakutulos from '../hakutulos/Hakutulos';
import { matchPath } from 'react-router'

@inject("hakuStore")
@inject("hakuehtoStore")
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
        const keyword = match ? match.params.keyword : '';
        const keywordChange = hakuStore.setKeyword(keyword);
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

        this.props.hakuehtoStore.setKeyword(keyword);
        this.props.hakuehtoStore.setFilter({
            koulutus: search.koulutustyyppi,
            kieli: search.kieli,
            paikkakunta: search.paikkakunta });

        if(keywordChange || filterChange || pagingChange) {
            this.props.hakuStore.searchAll()
            if(!search.toggle) {
                this.toggleAction(this.props.hakuStore.koulutusCount >= this.props.hakuStore.oppilaitosCount ? 'koulutus' : 'oppilaitos');
            }
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

    render() {
        return (
            <Hakutulos {...this.props}/>
        );
    }
}

export default Haku;