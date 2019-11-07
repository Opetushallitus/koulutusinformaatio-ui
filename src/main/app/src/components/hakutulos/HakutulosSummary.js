import React, { Component } from 'react';
import {observer, inject} from 'mobx-react';
import {translate} from 'react-i18next';

@translate()
@inject("hakuStore")
@observer
class HakutulosSummary extends Component {

    UNSAFE_componentWillReceiveProps(nextProps){
        this.props = nextProps;
    }

    renderKeywordResultSummary() {
        const {t} = this.props;
        return (
            <div className="col-12 Etsinta">
                {/* <h1 aria-live="assertive">{`${t('haku.summary', {count: this.props.hakuStore.totalCount})} ${t('haku.hakusanalla')}`}
                    <span className="highlight">{this.props.hakuStore.keyword}</span>
                </h1> */}
                <h1 aria-live="assertive"><b>{`${t('haku.hakusana')} `}</b>
                    <span className="highlight">{this.props.hakuStore.keyword}</span>
                </h1>
            </div>
        )
    }

    renderFilterResultSummary() {
        const {t} = this.props;
        const koulutustyypit = this.props.hakuStore.filter.koulutus.map((k) => {
            switch (k) {
                case 'lk': return 'lukiot';
                case 'amm': return 'ammatilliset tutkinnot';
                case 'kk': return 'korkeakoulut';
                case 'yo': return 'korkeakoulut';
                case 'amk': return 'korkeakoulut';
                case 'muu': return 'muut koulutukset';
                default: return '';
            }
        }).filter((k) => !!k).join(', ');
        const kielet = this.props.hakuStore.filter.kieli.map((k) => {
            switch (k) {
                case 'oppilaitoksenopetuskieli_1': return 'suomi';
                case 'oppilaitoksenopetuskieli_2': return 'ruotsi';
                case 'oppilaitoksenopetuskieli_4': return 'englanti';
                default: return '';
            }
        }).filter((k) => !!k).join(', ');
        const paikkakunta = this.props.hakuStore.filter.paikkakunta;

        return (
            <div className="col-12 Etsinta">
                <h1 aria-live="assertive">{this.props.hakuStore.keywordSet ? t('ja') : t('haku.summary', {count: this.props.hakuStore.totalCount})}
                    {koulutustyypit ? (' ' + t('haku.koulutustyypillä', {count: this.props.hakuStore.filter.koulutus.length})) + ' ' : '' }
                    {koulutustyypit ? <span className="highlight">{koulutustyypit}</span> : '' }
                    {kielet ? (koulutustyypit ? ' ' + t('ja') : '') + (' ' + t('haku.kielellä', {count: this.props.hakuStore.filter.kieli.length})) + ' ' : '' }
                    {kielet ? <span className="highlight">{kielet}</span> : '' }
                    {paikkakunta ? ((koulutustyypit || kielet) ? ' ' + t('sekä') : '' ) + (' ' + t('haku.paikkakunnalla') + ' ') : ''}
                    {paikkakunta ? <span className="highlight">{paikkakunta}</span> : '' }
                </h1>
            </div>
        )
    }

    render() {
        return (
            <div className="row result-count">
                {this.props.hakuStore.keywordSet ? this.renderKeywordResultSummary() : ''}
                {this.props.hakuStore.filterSet ? this.renderFilterResultSummary() : ''}
            </div>
        )
    }
}

export default HakutulosSummary;