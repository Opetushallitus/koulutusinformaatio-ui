import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';

class SidebarDropdown extends Component {
    render() {
        return (
            <li className={"dropdown" + (this.props.selected ? " open" : "")}>
                <a className="dropdown-toggle" onClick={() => this.props.selectDropdown()}>{this.props.name}</a>
                <ul className="dropdown-menu" role="menu">
                    {this.props.links.map((i) =>
                        <li key={i.name} className={i.link === this.props.location.pathname ? "current-page" : ""}>
                            <Link to={i.link}>{i.name}</Link>
                        </li>
                    )}
                </ul>
            </li>)
    }
}

export default withRouter(SidebarDropdown);