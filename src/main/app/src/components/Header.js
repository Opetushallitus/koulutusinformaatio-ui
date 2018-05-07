import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Header extends Component {
    render() {
        return (
            <div className="container navigation">
                <div className="row">
                    <button type="button" className="menu is-closed" data-toggle="offcanvas">
                        <span className="hamb-top"></span>
                        <span className="hamb-middle"></span>
                        <span className="hamb-bottom"></span>
                    </button>
                    <Link to={{ pathname: '/'}} className="navbar-brand">Opintopolku</Link>
                    <div className="wrapper">
                        <input type="text" className="nabvar-search oph-input" placeholder="Etsi..."/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;