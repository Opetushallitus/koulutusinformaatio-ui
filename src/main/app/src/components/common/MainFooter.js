import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router-dom';

@translate()
class DefaultFooter extends Component {

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
                <div className="row">
                    <div className="col-sm-4">
                        <ul className="site-links">
                            <li>
                                <a href="/">
                                    <img src={require('../../assets/images/opintopolku_large-fi.png')} alt=""/>
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
                    <div className="col-sm-4">
                        <div className="row site-icons">
                            <div className="col-xs-6">
                                <a href="http://www.minedu.fi/OPM/">
                                    <img src={require('../../assets/images/logo_fi.svg')} alt=""/>
                                </a>
                            </div>
                            <div className="col-xs-6">
                                <a href="https://www.oph.fi">
                                    <img src={require('../../assets/images/OPH_logo-fi.svg')} alt=""/>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="row">
                            <p>{t('footer.vastuuvapauslauseke')}</p>
                            <ul className="social-media">
                                <li id={"language-fi"}><a onClick={() => this.changeLanguage('fi')}>Suomeksi</a></li>
                                <li id={"language-en"}><a onClick={() => this.changeLanguage('en')}>In English</a></li>
                                <li id={"language-sv"}><a onClick={() => this.changeLanguage('sv')}>På svenska</a></li>
                                {/*<li className="separator">|</li>
                                <li>
                                    <a href="">
                                        <img src={require('../../assets/images/twitter-icon.png')} alt=""/>
                                    </a>
                                    //<i  className="fa fa-twitter-square" aria-hidden="true"></i>
                                </li>
                                <li>
                                    <a href="">
                                        <img src={require('../../assets/images/fb-icon.png')} alt=""/>
                                    </a>
                                     //<i href="" className="fa fa-facebook-square" aria-hidden="true"></i>
                                </li>
                                <li>
                                    <a href="">
                                        <img src={require('../../assets/images/insta-icon.png')} alt=""/>
                                    </a>
                                     //<i href="" className="fa fa-instagram" aria-hidden="true"></i>
                                </li>*/}
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>);
    }
}

export default withRouter(DefaultFooter);