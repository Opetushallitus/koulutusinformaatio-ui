import React, { Component } from 'react';
import { translate } from 'react-i18next';

@translate()
class Sidebar extends Component {
    render() {
        const {t} = this.props;
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top" id="sidebar-wrapper">
                <ul className="nav sidebar-nav">
                    <li className="sidebar-brand">
                        {t('valikko')}
                    </li>
                </ul>
            </nav>
        );
    }
}

export default Sidebar;