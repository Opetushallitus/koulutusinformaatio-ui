import React, { Component } from 'react';

class SidebarDropdown extends Component {
    render() {
        return (
            <li className={"dropdown" + (this.props.selected ? " open" : "")}>
                <a className="dropdown-toggle" onClick={() => this.props.selectDropdown()}>{this.props.name}
                    <span className="caret"/>
                </a>
                <ul className="dropdown-menu" role="menu">
                    {this.props.links.map((i) =>
                        <li key={i.name}>
                            <a href={i.link}>{i.name}</a>
                        </li>
                    )}
                </ul>
            </li>)
    }
}

export default SidebarDropdown