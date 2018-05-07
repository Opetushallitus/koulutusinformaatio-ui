import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Footer extends Component {
    render() {
        return (
            <footer className="container-fluid">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 col-md-4">
                            <ul className="site-links">
                                <li>
                                    <a href="#">
                                        <img src="images/opintopolku_large-fi.png" alt=""/>
                                    </a>
                                </li>
                                <li>Oma Opintopolku</li>
                                <li>Mikä on opintopolku</li>
                                <li>Tietoturvaseloste</li>
                                <li>
                                    <a href="">Anna palautetta</a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-xs-12 col-md-4">
                            <div className="row site-icons">
                                <div className="col-xs-6">
                                    <img src="images/logo_fi.svg" alt=""/>
                                </div>
                                <div className="col-xs-6">
                                    <img src="images/OPH_logo-fi.svg" alt=""/>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-4">
                            <div className="row">
                                <div className="col-xs-12">
                                    <p>Koulutuksen järjestäjät ja korkeakoulut ylläpitävät tietoja koulutuksistaan Opintopolussa. Tietojen oikeellisuuden
                                        voit tarkistaa kyseisestä oppilaitoksesta tai korkeakoulusta.</p>
                                </div>
                                <div className="col-xs-12">
                                    <ul className="social-media">
                                        <li>Suomeksi</li>
                                        <li>In English</li>
                                        <li>På svenska</li>
                                        <li className="separator">|</li>
                                        <li>
                                            <i className="fa fa-twitter-square" aria-hidden="true"></i>
                                        </li>
                                        <li>
                                            <i className="fa fa-facebook-square" aria-hidden="true"></i>
                                        </li>
                                        <li>
                                            <i className="fa fa-instagram" aria-hidden="true"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>);
    }
}

export default Footer;











