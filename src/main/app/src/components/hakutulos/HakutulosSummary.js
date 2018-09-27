import React, { Component } from 'react';
import '../../assets/styles/hakutulos.css'
import {observer, inject} from 'mobx-react';
import {translate} from 'react-i18next';

@translate()
@inject("hakuStore")
@observer
class HakutulosSummary extends Component {

    renderKeywordResultSummary() {
        const {t} = this.props;
        return (
            <div className="col Etsinta">
                <h1>{t('haku.summary', {count: this.props.hakuStore.totalCount}) + " " + t('haku.hakusanalla')}
                    <span className="highlight"> "{this.props.hakuStore.keyword}"</span>
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
                case 'muu': return 'muut koulutukset';
                default: return '';
            }
        }).filter((k) => !!k).join(', ');
        const kielet = this.props.hakuStore.filter.kieli.map((k) => {
            switch (k) {
                case 'fi': return 'suomi';
                case 'sv': return 'ruotsi';
                case 'en': return 'englanti';
                default: return '';
            }
        }).filter((k) => !!k).join(', ');
        const paikkakunta = this.props.hakuStore.filter.paikkakunta;

        return (
            <div className="col Etsinta">
                <h1>{this.props.hakuStore.keywordSet ? t('ja') : t('haku.summary', {count: this.props.hakuStore.totalCount})}
                    {koulutustyypit ? (' ' + t('haku.koulutustyypillä', {count: this.props.hakuStore.filter.koulutus.length})) + ' ' : '' }
                    {koulutustyypit ? <span className="highlight">"{koulutustyypit}"</span> : '' }
                    {kielet ? (koulutustyypit ? ' ' + t('ja') : '') + (' ' + t('haku.kielellä', {count: this.props.hakuStore.filter.kieli.length})) + ' ' : '' }
                    {kielet ? <span className="highlight">"{kielet}"</span> : '' }
                    {paikkakunta ? ((koulutustyypit || kielet) ? ' ' + t('sekä') : '' ) + (' ' + t('haku.paikkakunnalla') + ' ') : ''}
                    {paikkakunta ? <span className="highlight"> "{paikkakunta}"</span> : '' }
                </h1>
            </div>
        )
    }

    render() {
        return (
            <div className="row">
                {this.props.hakuStore.keywordSet ? this.renderKeywordResultSummary() : ''}
                {this.props.hakuStore.filterSet ? this.renderFilterResultSummary() : ''}
            </div>
        )
    }
}

export default HakutulosSummary;