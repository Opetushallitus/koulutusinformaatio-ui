import React, { Component } from 'react';
import Hakupalkki from './haku/Hakupalkki'
import { Link, Route } from 'react-router-dom'
import {observer, inject} from 'mobx-react';
import '../assets/styles/components/_etusivu.scss';

@inject("hakuStore")
@inject("hakuehtoStore")
@observer
class Etusivu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFilterDisplayed: false
        };
        this.moveMainContent = this.moveMainContent.bind(this);
    }

    componentDidMount() {
        this.props.hakuehtoStore.clearHakuehdot();
        this.props.hakuStore.clearHaku();
    }

    moveMainContent() {
        this.setState({
            isFilterDisplayed: !this.state.isFilterDisplayed            
        })
    }

    render() {
        let moveMainContent =  this.state.isFilterDisplayed; 
        return (
            <React.Fragment>
                <Route exact path='/' render={() => <Hakupalkki isRajainVisible={this.moveMainContent} main={true}/>}/>
                <div id="main-content" className={`container ${moveMainContent ? "move-right" : "center-content"}`}>
                    <div className="front-page-notification">
                        <span className="notification-content"><img className="notification-icon" src={require('../assets/images/info.svg')} alt="info"/> Haku perusopetuksen jälkeisiin valmistaviin koulutuksiin 21.5.-23.7. <a className="notification-link"> Hae koulutuksiin</a> </span>
                    </div>
                    <div className="menu-container">
                        <div className="menu-item polku">
                            <div className="menu-item-header">
                                <img className="menu-item-header-image" src={require('../assets/images/polku.jpg')} alt="info"/>
                            </div>
                            <div className="menu-item-content">
                                <h2>Löydä oma polkusi</h2>
                                <p>> Ammatin valinta</p>
                                <p>> Maahanmuuttajien koulutus</p>
                                <p>> Missä minun pitää kehittyä?</p>
                                <p>> Tukea osaamisen tunnistamiseen</p>    
                            </div>
                        </div>
                        <div className="menu-item haku">
                            <div className="menu-item-header">
                                <img className="menu-item-header-image" src={require('../assets/images/haku-koulutukseen.jpg')} alt="info"/>
                            </div>
                            <div className="menu-item-content">
                                <h2>Hae koulutukseen</h2>
                                <p>> Seuraava yhteishaku: 8.5 - 22.5.2019</p>
                                <p>> Hakuajat</p>
                                <p>> Hakulomakkeet</p>
                                <p>> Tietoa hakeutumisesta</p> 
                            </div>
                        </div>
                        <div className="menu-item verkko">
                            <div className="menu-item-header">
                                <img className="menu-item-header-image" src={require('../assets/images/asioi-verkossa.jpg')} alt="info"/>
                            </div>
                            <div className="menu-item-content">
                                <h2>Asioi verkossa</h2>
                                <p>> Katso hakemuksiasi</p>
                                <p>> Katso opintosuorituksiasi</p>
                                <p>> Ota tarjottu opiskelupaikka vastaan</p>
                                <p>> Tarkastele Europassiasi</p> 
                            </div>
                        </div>
                    </div>
                    <div className="news-container">
                        <h1 className="news-container-title">Ajankohtaista ja uutisia</h1>
                        <div className="news-item-container">
                            <div className="news-item">
                                <div className="news-item-header">
                                    <img className="notification-icon" src={require('../assets/images/star.svg')} alt="star"/>Uutisen otsikko
                                </div>
                                <div className="news-item-content">
                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </div>
                            </div>
                            <div className="news-item">
                                <div className="news-item-header">
                                    <img className="notification-icon" src={require('../assets/images/sun.svg')} alt="sun"/>Ajankohtainen otsiko
                                </div>
                                <div className="news-item-content">
                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </div>
                            </div>
                        </div>
                        <div className="news-item-container">
                            <div className="news-item">
                                <div className="news-item-header">
                                    <img className="notification-icon" src={require('../assets/images/error.svg')} alt="error"/>Häiriötiedote
                                </div>
                                <div className="news-item-content">
                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </div>
                            </div>
                            <div className="news-item">
                                <div className="news-item-header">
                                    <img className="notification-icon" src={require('../assets/images/star.svg')} alt="star"/>Uutisen otsikko
                                </div>
                                <div className="news-item-content">
                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </div>
                            </div>
                        </div>
                        <div className="news-show-more">
                            <Link role="button" aria-label={"Näytä kaikki"} to={{pathname: undefined}} className="news-show-button">Näytä kaikki</Link>
                        </div>
                    </div>
                    <div className="services-container">
                        <h1 className="services-container-title">Muut Palvelut</h1>
                        <div className="services-item-container">
                            <div className="services-item">
                                <div className="services-item-header">
                                    <img className="notification-icon" src={require('../assets/images/ehoks.svg')} alt="ehoks"/>ePerusteet
                                </div>
                                <div className="services-item-content">
                                    ePerusteet-palvelussa löytyvät kaikki opetussuunnitelmien, tutkintojen ja koulutusten perusteet varhaiskasvatuksesta toiselle asteelle.
                                </div>
                            </div>
                            <div className="services-item">
                                <div className="services-item-header">
                                    <img className="notification-icon" src={require('../assets/images/ehoks.svg')} alt="ehoks"/>eHoks
                                </div>
                                <div className="services-item-content">
                                    eHOKS palvelussa näet henkilökohtaisen osaamisen kehittämissuunnitelman tietoja.
                                </div>
                            </div>
                            <div className="services-item">
                                <div className="services-item-header">
                                    <img className="notification-icon" src={require('../assets/images/ehoks.svg')} alt="ehoks"/>Europass
                                </div>
                                <div className="services-item-content">
                                    Europassilla voi osoittaa hankitut tiedot ja taidot kansainvälisesti vertailukelpoisella tavalla.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="shortcut-container">
                        <h1 className="shortcut-container-title">Muut Palvelut</h1>
                        <div className="shortcut-item-container">
                            <div className="shortcut-item">
                                <div className="shortcut-item-header">
                                    <img className="notification-icon" src={require('../assets/images/hakukalenteri.svg')} alt="hakukalenteri"/>hakukalenteri
                                </div>
                                <div className="shortcut-item-content">
                                    Hakukalenterissa näet yhdellä silmäyksellä seuraavien yhteishakujen ajankohdat.
                                </div>
                            </div>
                            <div className="shortcut-item">
                                <div className="shortcut-item-header">
                                    <img className="notification-icon" src={require('../assets/images/faq.svg')} alt="faq"/>Neuvonta ja ohjaus
                                </div>
                                <div className="shortcut-item-content">
                                    Löydä kootusti koulutuksen ja ammatin valintaan liittyvien ohjaus- ja neuvontapalveluiden yhteystietoja.
                                </div>
                            </div>
                            <div className="shortcut-item">
                                <div className="shortcut-item-header"> 
                                    <img className="notification-icon" src={require('../assets/images/faq.svg')} alt="faq"/>Kysytyimmät kysymykset
                                </div>
                                <div className="shortcut-item-content">
                                    Löydä vastaukset opiskeloiden useimmin kysyttyihin kysymyksiin kätevästi yhdestä paikasta.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );  
    }
}

export default Etusivu;


