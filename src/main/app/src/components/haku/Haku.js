import React, { Component } from 'react';
import superagent from 'superagent';
import qs from 'query-string';
import '../../assets/css/hakutulos.css'
import {observer, inject} from 'mobx-react';
import Hakupalkki from './Hakupalkki';
import Hakutulos from './Hakutulos';

@inject("hakuStore")
@inject("urlStore")
@observer
class Haku extends Component {

    constructor(props) {
        super(props);
        this.searchAction = this.searchAction.bind(this);
        this.toggleAction = this.toggleAction.bind(this);
    }

    componentDidMount() {
        this.handleRefresh();
    }

    handleRefresh() {
        const queryParamToggle = qs.parse(this.props.location.search).toggle;
        if(this.props.hakuStore.keyword != this.props.match.params.keyword) {
            this.props.hakuStore.keyword = this.props.match.params.keyword
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
        if(this.props.hakuStore.keyword != this.props.match.params.keyword) {
            this.props.hakuStore.keyword = this.props.match.params.keyword
            this.search(queryParamToggle)
        } else {
            this.props.hakuStore.toggleKoulutus = ('oppilaitos' !== queryParamToggle)
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
        if(newKeyword != this.props.hakuStore.keyword) {
            this.props.hakuStore.keyword = newKeyword;
            this.search();
        }
    }

    toggleAction(value) {
        this.props.hakuStore.toggleKoulutus = ('oppilaitos' !== value);
        this.changeUrl();
    }

    search(toggle) {
        const _this = this;
        const _handleError = (e) => { console.log(e); _this.setState({error: e})};
        if(this.props.hakuStore.keywordSet) {
            Promise.all([
                superagent
                    .get(_this.props.urlStore.urls.url('konfo-backend.search.koulutukset'))
                    .query({keyword: _this.props.hakuStore.keyword})
                    .catch(_handleError),
                superagent
                    .get(_this.props.urlStore.urls.url('konfo-backend.search.organisaatiot'))
                    .query({keyword: _this.props.hakuStore.keyword})
                    .catch(_handleError)
            ]).then((result) => {
                _this.props.hakuStore.koulutusResult = result[0] ? result[0].body.result : [];
                _this.props.hakuStore.koulutusCount = result[0] ? result[0].body.count : 0;
                _this.props.hakuStore.oppilaitosResult = result[1] ? result[1].body.result : [];
                _this.props.hakuStore.oppilaitosCount = result[1] ? result[1].body.count : 0;
                if(toggle) {
                    _this.toggleAction(('oppilaitos' !== toggle));
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
                <Hakutulos toggleAction={this.toggleAction}/>
            </React.Fragment>
        );
    }
}

export default Haku;