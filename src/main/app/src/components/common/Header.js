import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { translate } from 'react-i18next';
import Sidebar from '../common/Sidebar';
@translate()
class Header extends Component {
    render() {
        const {t} = this.props;
        return (
            <React.Fragment>
                <div className="container-fluid navigation-bar"/>
                <div className="container navigation">
                    <div className="row">
                        <Sidebar changeLanguage={this.changeLanguage} togglePalaute={this.togglePalaute}/>
                        <Link to={{ pathname: '/'}} className="navbar-brand">{t('opintopolku')}</Link>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Header;