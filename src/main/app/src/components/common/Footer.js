import React, { Component } from 'react';
import '../../assets/styles/components/_footer.scss';
import Media from 'react-media';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router-dom';

@translate()
class Footer extends Component {

    changeLanguage(lng) {
        this.props.i18n.changeLanguage(lng);

        if (!this.props.history.location.search) {
            this.props.history.replace(this.props.history.location.pathname + "?lng=" + lng);
        } else if (this.props.history.location.search.indexOf('lng') !== -1) {
            this.props.history.replace(this.props.history.location.pathname + this.props.history.location.search.replace(/lng=../g, "lng=" + lng));
        } else {
            this.props.history.replace(this.props.history.location.pathname + this.props.history.location.search + "&lng=" + lng);
        }
    }

    render() {
        const { t } = this.props;
        return (
            <footer className="container-fluid">
                <div className="container">
                    <div className="row">
                        <div className="col-6 col-sm-7 col-lg-4 d-flex justify-content-start">
                            <div className="row">
                                <ul className="site-links">
                                    <li>
                                        <a href="/">
                                            <img src={require('../../assets/images/opintopolku_large-fi.png')} alt="Opintopolku logo"/>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/oma-opintopolku">{t('footer.oma-opintopolku')}</a>
                                    </li>
                                    <li>
                                        <a href="/tietoa-palvelusta">{t('footer.mikä-opintopolku')}</a>
                                    </li>
                                    <li>
                                        <a href="/tietoturvaseloste">{t('footer.tietoturvaseloste')}</a>
                                    </li>
                                    <li>
                                        <a onClick={this.props.togglePalaute}>{t('footer.palaute')}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-6 col-sm-5 col-lg-4 d-flex align-items-md-end flex-lg-row justify-content-end justify-content-md-center">
                            <div className="row site-icons d-flex flex-column flex-lg-row flex-md-col">
                                <a href="http://www.minedu.fi/OPM/">
                                    <img src={require('../../assets/images/logo_fi.svg')} alt="Opetus ja kulttuuriministeriö"/>
                                </a>

                                <a href="https://www.oph.fi">
                                    <img src={require('../../assets/images/OPH_logo-fi.svg')} alt="Opetushallitus"/>
                                </a>
                            </div>
                        </div>
                        <Media query="(max-width: 992px)">
                            {
                                matches => matches ? ("") : 
                                (
                                    <div className="col-12 col-md-12 col-lg-4 d-none d-lg-block">
                                        <p>{t('footer.vastuuvapauslauseke')}</p>
                                        <ul className="social-media">
                                            <li id={"language-fi"}><a onClick={() => this.changeLanguage('fi')}>Suomeksi</a></li>
                                            <li id={"language-en"}><a onClick={() => this.changeLanguage('en')}>In English</a></li>
                                            <li id={"language-sv"}><a onClick={() => this.changeLanguage('sv')}>På svenska</a></li>
                                        </ul>
                                    </div>
                                )
                            }
                        </Media>                      
                    </div>
                </div>
                <Media query="(max-width: 992px)">
                    {
                        matches => matches ? (
                            <div className="row d-block d-sm-block d-lg-none">
                                <div className="container">
                                    <div className="col-12">
                                        <p>{t('footer.vastuuvapauslauseke')}</p>
                                        <ul className="social-media">
                                            <li id={"language-fi"}><a onClick={() => this.changeLanguage('fi')}>Suomeksi</a></li>
                                            <li id={"language-en"}><a onClick={() => this.changeLanguage('en')}>In English</a></li>
                                            <li id={"language-sv"}><a onClick={() => this.changeLanguage('sv')}>På svenska</a></li>
                                        </ul>   
                                    </div>    
                                </div>
                            </div>
                        ) : ("")
                    }
                </Media>   
            </footer>);
    }
}

export default withRouter(Footer);
