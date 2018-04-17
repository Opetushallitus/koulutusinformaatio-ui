import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Header extends Component {
    render() {
        return (
            <div class="container navigation">
                <div class="row">
                    <button type="button" class="menu is-closed" data-toggle="offcanvas">
                        <span class="hamb-top"></span>
                        <span class="hamb-middle"></span>
                        <span class="hamb-bottom"></span>
                    </button>
                    <Link to={{ pathname: '/'}} class="navbar-brand">Opintopolku</Link>
                    <div class="wrapper">
                        <input type="text" class="nabvar-search oph-input" placeholder="Etsi..."/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;