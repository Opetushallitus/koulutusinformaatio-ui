import React, { Component } from 'react';
import Hakurajain from './Hakurajain';
import {observer, inject} from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import {translate} from 'react-i18next';
import Media from 'react-media';
import '../../assets/styles/components/_hakupalkki.scss';

@translate()
@inject ("hakuehtoStore")
@observer
class Hakupalkki extends Component {

    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        if(event.target.value) {
            this.props.hakuehtoStore.keyword = event.target.value
        } else {
            this.props.hakuehtoStore.keyword = ''
        }
    }

    handleSubmit(event) {
        this.handleChange(event);
        event.preventDefault();
        this.props.hakuehtoStore.closeRajain();
        this.props.history.push(this.props.hakuehtoStore.createHakuUrl);
    }

    closeRajain() {
        this.props.hakuehtoStore.closeRajain();
    }

    render() {
        const {t} = this.props;
        const link = '/haku/' + this.props.hakuehtoStore.keyword;
        const search = this.props.hakuehtoStore.searchParams;
        //const value = this.props.hakuehtoStore.keyword ? this.props.hakuehtoStore.keyword : '';
        return (
            <React.Fragment>
                <div className="hakupalkki-search">
                    <div className="search-wrapper">
                        <input id="regular-input" className="search-wrapper-input search-wrapper-item" aia-label={t('haku.kehoite')} type="search"
                               placeholder={t('haku.kehoite')}
                            //value={value}
                               onChange={this.handleChange}
                               onKeyPress={(e) => { if(e.key === 'Enter' && this.props.hakuehtoStore.keyword.length > 2){ this.handleSubmit(e)}}}/>
                        <Hakurajain shareVisibility={this.props.isRajainVisible}/>
                        <Link role="button" aria-label={t('haku.etsi')} to={{
                            pathname: this.props.hakuehtoStore.keyword.length > 2 ? link : undefined,
                            search: search
                        }} className="search-button search-wrapper-item" onClick={() => {this.closeRajain()}}>
                            <Media query="(max-width: 768px)">
                                {
                                    matches => matches ? ("") : (t('haku.etsi'))
                                }
                            </Media>
                        </Link>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(Hakupalkki);
