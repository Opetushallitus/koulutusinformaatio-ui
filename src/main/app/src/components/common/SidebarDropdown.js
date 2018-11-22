import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';

class SidebarDropdown extends Component {
    
    state = {
            collapsing: "collapsed"
        };

    collapseMenu(){
        this.setState({
            collapsing: "collapsing"
        });
        setTimeout(() => {
            this.setState({
                collapsing: "collapsed"
            });
        },175);
    }

    render() {
        return (
            <li className={"dropdown " + (this.props.selected ? "current-page"  : this.state.collapsing)}>
                <a className="dropdown-toggle" onClick={ () => {this.props.selectDropdown(); this.collapseMenu()}}>{this.props.name}</a>
                <ul className={"dropdown-menu " + (this.props.selected ? "expanded" : this.state.collapsing)} role="menu">
                    {
                        this.props.links.map((i) =>
                            <li key={i.name} className={i.link === this.props.location.pathname ? "current-page" : ""}>
                                <Link to={i.link}>{i.name}</Link>
                            </li>
                        )
                    }
                </ul>
            </li>
        )
    }
}

export default withRouter(SidebarDropdown);