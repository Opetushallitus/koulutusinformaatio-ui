import React, { Component } from 'react';
// import { Link } from 'react-router-dom'

class Footer extends Component {
    render() {
        return (
            <footer className="container-fluid">
                <div className="row">
                    <div className="col-sm-4">
                        <ul className="site-links">
                            <li>
                                <a href="/">
                                    <img src={require('../assets/images/opintopolku_large-fi.png')} alt=""/>
                                </a>
                            </li>
                            <li>
                                <a href="/oma-opintopolku">Oma Opintopolku</a>
                            </li>
                            <li>
                                <a href="/tietoa-palvelusta">Mikä on opintopolku</a>
                            </li>
                            <li>
                                <a href="/tietoturvaseloste">Tietoturvaseloste</a>
                            </li>
                            <li>
                                <a href="/palaute">Anna palautetta</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-sm-4">
                        <div className="row site-icons">
                            <div className="col-xs-6">
                                <a href="http://www.minedu.fi/OPM/">
                                    <img src={require('../assets/images/logo_fi.svg')} alt=""/>
                                </a>
                            </div>
                            <div className="col-xs-6">
                                <a href="https://www.oph.fi">
                                    <img src={require('../assets/images/OPH_logo-fi.svg')} alt=""/>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="row">
                            <p>Koulutuksen järjestäjät ja korkeakoulut ylläpitävät tietoja koulutuksistaan Opintopolussa. Tietojen oikeellisuuden
                                voit tarkistaa kyseisestä oppilaitoksesta tai korkeakoulusta.</p>
                            {/*<ul className="social-media">
                                // <li>Suomeksi</li>
                                // <li>In English</li>
                                // <li>På svenska</li>
                                <li className="separator">|</li>
                                <li>
                                    <a href="">
                                        <img src={require('../assets/images/twitter-icon.png')} alt=""/>
                                    </a>
                                    // <i  className="fa fa-twitter-square" aria-hidden="true"></i>
                                </li>
                                <li>
                                    <a href="">
                                        <img src={require('../assets/images/fb-icon.png')} alt=""/>
                                    </a>
                                    // <i href="" className="fa fa-facebook-square" aria-hidden="true"></i>
                                </li>
                                <li>
                                    <a href="">
                                        <img src={require('../assets/images/insta-icon.png')} alt=""/>
                                    </a>
                                    // <i href="" className="fa fa-instagram" aria-hidden="true"></i>
                                </li>
                            </ul>*/}
                        </div>
                    </div>
                </div>
            </footer>);
    }
}

export default Footer;











