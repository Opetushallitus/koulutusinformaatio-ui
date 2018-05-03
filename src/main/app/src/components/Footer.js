import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Footer extends Component {
    render() {
        return (
            <footer class="container-fluid">
                <div class="container">
                    <div class="row">
                        <div class="col-xs-12 col-md-4">
                            <ul class="site-links">
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
                        <div class="col-xs-12 col-md-4">
                            <div class="row site-icons">
                                <div class="col-xs-6">
                                    <img src="images/logo_fi.svg" alt=""/>
                                </div>
                                <div class="col-xs-6">
                                    <img src="images/OPH_logo-fi.svg" alt=""/>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-12 col-md-4">
                            <div class="row">
                                <div class="col-xs-12">
                                    <p>Koulutuksen järjestäjät ja korkeakoulut ylläpitävät tietoja koulutuksistaan Opintopolussa. Tietojen oikeellisuuden
                                        voit tarkistaa kyseisestä oppilaitoksesta tai korkeakoulusta.</p>
                                </div>
                                <div class="col-xs-12">
                                    <ul class="social-media">
                                        <li>Suomeksi</li>
                                        <li>In English</li>
                                        <li>På svenska</li>
                                        <li class="separator">|</li>
                                        <li>
                                            <i class="fa fa-twitter-square" aria-hidden="true"></i>
                                        </li>
                                        <li>
                                            <i class="fa fa-facebook-square" aria-hidden="true"></i>
                                        </li>
                                        <li>
                                            <i class="fa fa-instagram" aria-hidden="true"></i>
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











