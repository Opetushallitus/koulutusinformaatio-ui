import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { translate } from 'react-i18next';

@translate()
class Header extends Component {
    render() {
        const {t} = this.props;
        return (
            <div className="container navigation">
                <div className="row">
                    <button type="button" className="menu is-closed" data-toggle="offcanvas">
                        <span className="hamb-top"></span>
                        <span className="hamb-middle"></span>
                        <span className="hamb-bottom"></span>
                    </button>
                    <Link to={{ pathname: '/'}} className="navbar-brand">{t('opintopolku')}</Link>
                </div>
            </div>
        );
    }
}

export default Header;