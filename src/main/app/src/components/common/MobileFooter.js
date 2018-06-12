import React, { Component } from 'react';
import { translate } from 'react-i18next';

@translate()
class MobileFooter extends Component {
    render() {
        const {t} = this.props;
        return (
            <footer className="container-fluid">
                <div className="col-xs-6">
                    <div className="site-links">
                        <a href="/">
                            <img src={require('../../assets/images/opintopolku_large-fi.png')} alt=""/>
                        </a>
                    </div>
                    <ul className="social-media">
                        <li>
                            <a href="">
                                <img src={require('../../assets/images/twitter-icon.png')} alt=""/>
                            </a>
                            {/*<i  className="fa fa-twitter-square" aria-hidden="true"></i>*/}
                        </li>
                        <li>
                            <a href="">
                                <img src={require('../../assets/images/fb-icon.png')} alt=""/>
                            </a>
                            {/*<i href="" className="fa fa-facebook-square" aria-hidden="true"></i>*/}
                        </li>
                        <li>
                            <a href="">
                                <img src={require('../../assets/images/insta-icon.png')} alt=""/>
                            </a>
                            {/*<i href="" className="fa fa-instagram" aria-hidden="true"></i>*/}
                        </li>
                    </ul>
                </div>
                <div className="col-xs-6">
                    <ul className="site-links">
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
                            <a onClick={this.togglePalaute}>{t('footer.palaute')}</a>
                        </li>
                    </ul>
                </div>
                <div className="col-xs-12">
                    <hr/>
                    <p>{t('footer.vastuuvapauslauseke')}</p>
                </div>
                <div className="col-xs-12 site-icons">
                    <div className="col-xs-6">
                        <a className="pull-right" href="http://www.minedu.fi/OPM/">
                            <img src={require('../../assets/images/logo_fi.svg')} alt=""/>
                        </a>
                    </div>
                    <div className="col-xs-6">
                        <a href="https://www.oph.fi">
                            <img src={require('../../assets/images/OPH_logo-fi.svg')} alt=""/>
                        </a>
                    </div>
                </div>
            </footer>);
    }
}

export default MobileFooter;