import React, { Component } from 'react';
import '../assets/css/oph-styles-min.css';
import '../assets/css/styles.css';
import '../assets/css/font-awesome.min.css'
import '../assets/css/bootstrap.min.css'

class Sidebar extends Component {
    render() {
        return (
            <nav class="navbar navbar-inverse navbar-fixed-top" id="sidebar-wrapper" role="navigation">
                <ul class="nav sidebar-nav">
                    <li class="sidebar-brand">
                        Valikko
                    </li>
                </ul>
            </nav>
        );
    }
}

export default Sidebar;