import React, { Component } from 'react';
import '../assets/css/oph-styles-min.css';
import '../assets/css/styles.css';
import '../assets/css/font-awesome.min.css'
import '../assets/css/bootstrap.min.css'

class Header extends Component {
    render() {
        return (
            <div class="container">
                <div class="row">
                    <button type="button" class="menu is-closed" data-toggle="offcanvas">
                        <span class="hamb-top"></span>
                        <span class="hamb-middle"></span>
                        <span class="hamb-bottom"></span>
                    </button>
                    <a class="navbar-brand" href="#">Opintopolku</a>
                    <div class="wrapper">
                        <input type="text" class="nabvar-search oph-input" placeholder="Etsi..."/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;