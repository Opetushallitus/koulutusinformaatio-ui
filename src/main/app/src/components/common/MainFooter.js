import React, { Component } from 'react';
import Palaute from "./Palaute";
// import { Link } from 'react-router-dom'
import { translate } from 'react-i18next';
import i18n from '../../i18n';

@translate()
class DefaultFooter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            togglePalaute: false
        };
        this.togglePalaute = this.togglePalaute.bind(this);
    }

    togglePalaute() {
        this.setState({togglePalaute: !this.state.togglePalaute})
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
                                <a onClick={this.togglePalaute}>{t('footer.palaute')}</a>
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
                                <li><a onClick={() => i18n.changeLanguage('fi')}>Suomeksi</a></li>
                                <li><a onClick={() => i18n.changeLanguage('en')}>In English</a></li>
                                <li><a onClick={() => i18n.changeLanguage('sv')}>På svenska</a></li>
                                {/*<li className="separator">|</li>*/}
                                {/*<li>*/}
                                    {/*<a href="">*/}
                                        {/*<img src={require('../../assets/images/twitter-icon.png')} alt=""/>*/}
                                    {/*</a>*/}
                                     {/*/!*<i  className="fa fa-twitter-square" aria-hidden="true"></i>*!/*/}
                                {/*</li>*/}
                                {/*<li>*/}
                                    {/*<a href="">*/}
                                        {/*<img src={require('../../assets/images/fb-icon.png')} alt=""/>*/}
                                    {/*</a>*/}
                                     {/*/!*<i href="" className="fa fa-facebook-square" aria-hidden="true"></i>*!/*/}
                                {/*</li>*/}
                                {/*<li>*/}
                                    {/*<a href="">*/}
                                        {/*<img src={require('../../assets/images/insta-icon.png')} alt=""/>*/}
                                    {/*</a>*/}
                                     {/*/!*<i href="" className="fa fa-instagram" aria-hidden="true"></i>*!/*/}
                                {/*</li>*/}
                            </ul>
                        </div>
                    </div>
                    {this.state.togglePalaute && <Palaute togglePalaute={this.togglePalaute}/>}
                </div>
            </footer>);
    }
}

export default DefaultFooter;