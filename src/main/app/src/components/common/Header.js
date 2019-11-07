import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { translate } from 'react-i18next';
import MenuButton from './MenuButton';
import '../../assets/styles/components/_header.scss';

@translate()
class Header extends Component {
    
    render() {
        const {t, toggleMenu, isOpen} = this.props;
        return (
            <React.Fragment>
                <div className="navigation-header-wrapper">
                    <div className="navigation-bar"/>
                    <div className="navigation">
                        <div className="row">
                            <MenuButton changeLanguage={this.changeLanguage} toggleMenu={toggleMenu} isOpen={isOpen}/>
                            <Link to={{ pathname: '/'}} className="navbar-brand" aria-label="Link to home page">
                                <span>{t('opintopolku')}</span>
                                <span className="navbar-studyinfo">{t('studyinfo.fi')}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Header;