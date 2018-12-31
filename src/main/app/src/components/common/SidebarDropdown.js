import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';

class SidebarDropdown extends Component {
    
    constructor(props) {
        super(props);
        this.collapseMenu = this.collapseMenu.bind(this);       
    this.handleKeyPress = this.handleKeyPress.bind(this);       
    }
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
    handleKeyPress(e) {
        e.key === "Enter" &&
        this.props.selectDropdown(); 
        this.collapseMenu();
    }
    render() {
        return (
            <li className={"dropdown " + (this.props.selected ? "current-page"  : this.state.collapsing)} aria-haspopup="true" aria-expanded={this.props.selected ? true : false } tabIndex="0" onKeyPress={this.handleKeyPress}>
                <a className="dropdown-toggle" role="button" aria-label={this.props.name} onClick={ () => {this.props.selectDropdown(); this.collapseMenu()}}>{this.props.name}</a>
                <ul className={"dropdown-menu " + (this.props.selected ? "expanded" : this.state.collapsing)} >
                    {
                        this.props.links.map((i) =>
                            <li role="none" key={i.name} className={i.link === this.props.location.pathname ? "current-page" : ""}>
                                <Link role="menuitem" tabIndex="0" aria-label={i.name} to={i.link}>{i.name}</Link>
                            </li>
                        )
                    }
                </ul>
            </li>
        )
    }
}

export default withRouter(SidebarDropdown);