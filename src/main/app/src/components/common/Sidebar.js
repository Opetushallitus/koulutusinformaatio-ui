import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { withRouter, Link } from 'react-router-dom';
import { Localizer as l } from "../../tools/Utils";
import SidebarDropdown from "./SidebarDropdown";

@translate()
class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            selected: ""
        };
        this.openMenu = this.openMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.selectDropdown = this.selectDropdown.bind(this);
    }

    openMenu() {
        this.setState({open: true});
    }

    closeMenu() {
        this.setState({open: false});
        this.props.togglePalaute(false);
    }

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


    selectDropdown(dropdown) {
        if (dropdown !== this.state.selected){
            this.setState({selected: dropdown});
        } else {
            this.setState({selected: ""});
        }
    }

    render() {
        const {t} = this.props;
        return (
            <React.Fragment>
                {!this.state.open ?
                    <button type="button" className={"menu is-closed"} onClick={this.openMenu}>
                        <span className="hamb-top"/>
                        <span className="hamb-middle"/>
                        <span className="hamb-bottom"/>
                        <span className="menu-text">{t('valikko')}</span>
                    </button>
                :
                    <React.Fragment>
                        <div className="overlay"/>
                        <nav className="navbar navbar-inverse navbar-fixed-top" id="sidebar-wrapper">
                            <div className="sidebar-brand">
                                <span>Valikko</span>
                                <a className="sidebar-close" onClick={this.closeMenu}><i className="fa fa-times"/></a>
                            </div>
                            <div className="sidebar-nav">
                                   <ul className="languages">
                                        <li className={l.getLanguage() === 'fi' ? 'selected' : ''}>
                                            <a onClick={() => this.changeLanguage('fi')}>SUOMEKSI</a>
                                        </li>
                                        <li className={l.getLanguage() === 'sv' ? 'selected' : ''}>
                                            <a onClick={() => this.changeLanguage('sv')}>PÅ SVENSKA</a>
                                        </li>
                                        <li className={l.getLanguage() === 'en' ? 'selected' : ''}>
                                            <a onClick={() => this.changeLanguage('en')}>IN ENGLISH</a>
                                        </li>
                                    </ul>

                                <div className="sidebar-input">
                                    <input type="text" placeholder={t("sidebar.etsi-tietoa-opintopolusta")}/>
                                </div>
                                <ul className="nav">
                                    <li className="open frontpage-link">
                                        <Link to="/">ETUSIVULLE</Link>
                                    </li>
                                    <SidebarDropdown selectDropdown={() => this.selectDropdown('lukio')}
                                                     name={t("sidebar.lukio")} selected={this.state.selected === "lukio"}
                                                     links={[
                                                         {link: "", name: t("sidebar.opinnot-lukiossa")},
                                                         {link: "", name: t("sidebar.näin-haet-yhteishaussa")},
                                                         {link: "", name: t("sidebar.opiskelijoiden-valinta-lukioihin")},
                                                         {link: "", name: t("sidebar.ylioppilastutkinto")},
                                                         {link: "", name: t("sidebar.erityislukiot")},
                                                         {link: "", name: t("sidebar.kansainvälinen-lukiokoulutus")},
                                                         {link: "", name: t("sidebar.etälukiot")},
                                                         {link: "", name: t("sidebar.vaihto-opiskelijaksi")}
                                                     ]}
                                    />
                                    <SidebarDropdown selectDropdown={() => this.selectDropdown('amm')}
                                                     name={t("sidebar.ammatillinen-koulutus")} selected={this.state.selected === "amm"}
                                                     links={[
                                                         {link: "", name: t("sidebar.mitä-ammatillisessa-ovi-opiskella")},
                                                         {link: "", name: t("sidebar.ammatillinen-perustutkinto")},
                                                         {link: "", name: t("sidebar.valma-koulutus")},
                                                         {link: "", name: t("sidebar.ammatillinen-erityisopetus")},
                                                         {link: "", name: t("sidebar.oppisopimuskoulutus")},
                                                         {link: "", name: t("sidebar.kaksoistutkinto")},
                                                         {link: "", name: t("sidebar.näin-haet-yhteishaussa")},
                                                         {link: "", name: t("sidebar.valintaperusteet-ammatilliseen")},
                                                         {link: "", name: t("sidebar.hakijan-terveyden-tila")}
                                                     ]}
                                    />
                                    <SidebarDropdown selectDropdown={() => this.selectDropdown('ako')}
                                                     name={t("sidebar.ammattikorkeakoulu")} selected={this.state.selected === "ako"}
                                                     links={[
                                                         {link: "", name: t("sidebar.ammattikorkeakouluopintojen-rakenne")},
                                                         {link: "", name: t("sidebar.mitä-amkssa-voi-opiskella")},
                                                         {link: "", name: t("sidebar.kuka-voi-hakea")},
                                                         {link: "", name: t("sidebar.miten-opiskelijat-valitaan")},
                                                         {link: "", name: t("sidebar.amk-tutkinto-töiden-ohella")},
                                                         {link: "", name: t("sidebar.ylempi-amk-tutkinto")},
                                                         {link: "", name: t("sidebar.siirtohaut")},
                                                         {link: "", name: t("sidebar.ammattikorkeakoulujen-erillishaut")},
                                                         {link: "", name: t("sidebar.ammattikorkeakoulujen-hakijapalvelut")},
                                                         {link: "", name: t("sidebar.ammatilliset-opettajakorkeakoulut")},
                                                         {link: "", name: t("sidebar.avoin-ammattikorkeakoulu")},
                                                         {link: "", name: t("sidebar.erikoistumiskoulutus-ammattikorkeakoulussa")},
                                                         {link: "", name: t("sidebar.täydennyskoulutus")}
                                                     ]}
                                    />
                                    <SidebarDropdown selectDropdown={() => this.selectDropdown('yliopisto')}
                                                     name={t("sidebar.yliopisto")} selected={this.state.selected === "yliopisto"}
                                                     links={[
                                                         {link: "", name: t("sidebar.yliopistotutkintojen-rakenne")},
                                                         {link: "", name: t("sidebar.mitä-yliopistossa-voi-opiskella")},
                                                         {link: "", name: t("sidebar.kuka-voi-hakea")},
                                                         {link: "", name: t("sidebar.miten-opiskelijat-valitaan")},
                                                         {link: "", name: t("sidebar.yliopistojen-erillishaut")},
                                                         {link: "", name: t("sidebar.siirtohaku-yliopistossa")},
                                                         {link: "", name: t("sidebar.yliopistojen-maisterikoulutukset")},
                                                         {link: "", name: t("sidebar.erillisarvosanan-suorittaminen")},
                                                         {link: "", name: t("sidebar.jatkotutkinnot-ja-koulutukset")},
                                                         {link: "", name: t("sidebar.yliopistojen-hakijapalvelut")},
                                                         {link: "", name: t("sidebar.avoin-yliopisto")},
                                                         {link: "", name: t("sidebar.erikoistumiskoulutus-yliopistossa")},
                                                         {link: "", name: t("sidebar.täydennyskoulutus")}
                                                     ]}
                                    />
                                    <SidebarDropdown selectDropdown={() => this.selectDropdown('oppisopimus')}
                                                     name={t("sidebar.oppisopimus")} selected={this.state.selected === "oppisopimus"}
                                                     links={[
                                                         {link: "", name: t("sidebar.opiskelijalle")},
                                                         {link: "", name: t("sidebar.työnantajalle")},
                                                         {link: "", name: t("sidebar.yrittäjälle")}
                                                     ]}
                                    />
                                    <SidebarDropdown selectDropdown={() => this.selectDropdown('aikuiskoulutus')}
                                                     name={t("sidebar.aikuiskoulutus")} selected={this.state.selected === "aikuiskoulutus"}
                                                     links={[
                                                         {link: "", name: t("sidebar.mietitkö-aikuiskoulutusta")},
                                                         {link: "", name: t("sidebar.peruskoulu-aikuisille")},
                                                         {link: "", name: t("sidebar.aikuislukio")},
                                                         {link: "", name: t("sidebar.aikuisten-ammatillinen-koulutus")},
                                                         {link: "", name: t("sidebar.korkeakouluopinnot-aikuisille")},
                                                         {link: "", name: t("sidebar.opettajan-koulutus")},
                                                         {link: "", name: t("sidebar.kansanopistot")},
                                                         {link: "", name: t("sidebar.kansalais-ja-työväenopistot")},
                                                         {link: "", name: t("sidebar.kesäyliopistot")},
                                                         {link: "", name: t("sidebar.opintokeskukset-ja-opintokerhot")},
                                                         {link: "", name: t("sidebar.kielitutkinnot-ja-kielikokeet")},
                                                         {link: "", name: t("sidebar.työvoimakoulutus")}
                                                     ]}
                                    />
                                    <SidebarDropdown selectDropdown={() => this.selectDropdown('valinta')}
                                                     name={t("sidebar.koulutuksen-valinta")} selected={this.state.selected === "valinta"}
                                                     links={[
                                                         {link: "", name: t("sidebar.mitä-peruskoulun-jälkeen")},
                                                         {link: "", name: t("sidebar.muita-vaihtoehtoja-peruskoulun-jälkeen")},
                                                         {link: "", name: t("sidebar.ammatinvalinta")},
                                                         {link: "", name: t("sidebar.yhteishaku")},
                                                         {link: "", name: t("sidebar.jos-sinulla-on-jo-tutkinto")},
                                                         {link: "", name: t("sidebar.ohjaus-ja-neuvontapalvelut")},
                                                         {link: "", name: t("sidebar.opintojen-rahoitus")},
                                                         {link: "", name: t("sidebar.opiskelijamaksut")},
                                                         {link: "", name: t("sidebar.ulkomailla-opiskelu")},
                                                         {link: "", name: t("sidebar.maahanmuuttajien-koulutus")},
                                                         {link: "", name: t("sidebar.esteettömyys-ja-oppimisen-tuki")},
                                                         {link: "", name: t("sidebar.yrittäjäksi")}
                                                     ]}
                                    />
                                    <li className="open">
                                        <a onClick={this.props.togglePalaute}>{t("sidebar.palaute")}</a>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </React.Fragment>
                }
            </React.Fragment>
        );
    }
}

export default withRouter(Sidebar);