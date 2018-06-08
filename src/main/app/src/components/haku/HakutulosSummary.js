import React, { Component } from 'react';
import '../../assets/css/hakutulos.css'
import {observer, inject} from 'mobx-react';

@inject("hakuStore")
@observer
class HakutulosSummary extends Component {

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
                <h1>{this.props.hakuStore.keywordSet ? 'ja' : 'Etsintäsi tuotti ' + this.props.hakuStore.totalCount + ' osumaa'}
                    {koulutustyypit ? (this.props.hakuStore.filter.koulutus.length > 1 ? ' koulutustyypeillä ' : ' koulutustyypillä ') : '' }
                    {koulutustyypit ? <span className="highlight">"{koulutustyypit}"</span> : '' }
                    {kielet ? (koulutustyypit ? ' ja' : '') + (this.props.hakuStore.filter.kieli.length > 1 ? ' kielillä ' : ' kielellä ') : '' }
                    {kielet ? <span className="highlight">"{kielet}"</span> : '' }
                    {paikkakunta ? ((koulutustyypit || kielet) ? ' sekä' : '' ) + ' paikkakunnalla ' : '' }
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