import React, { Component } from 'react';

class Sidebar extends Component {
    render() {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top" id="sidebar-wrapper" role="navigation">
                <ul className="nav sidebar-nav">
                    <li className="sidebar-brand">
                        Valikko
                    </li>
                </ul>
            </nav>
        );
    }
}

export default Sidebar;