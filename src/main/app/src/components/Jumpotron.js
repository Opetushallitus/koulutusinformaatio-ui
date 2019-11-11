import React, { Component } from 'react';
import Hakupalkki from './haku/Hakupalkki'
import { withRouter } from 'react-router-dom';
import {translate} from 'react-i18next';
import '../assets/styles/components/_hakupalkki.scss';

@translate()
class Jumpotron extends Component {

    render() {
        const {t} = this.props;
        return (
            <React.Fragment>
                <div className="container-fluid" id="call-to-action">
                    <div className="jumbotron">
                        <div className="container">
                            <div className="row">
                                <div className="col-12 header-search main">
                                    <h1>{t('jumpotron.otsikko')}</h1>
                                    <p>{t('jumpotron.esittely')}</p>
                                    <Hakupalkki/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(Jumpotron);
