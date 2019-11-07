import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';

class SidebarValikko extends Component {

    render() {
        const {match, select} = this.props;
        const SivuItem = (props) => {
            const {name,id} = props;
            const link = `${match.url}sivu/${id}`;
            return <li role="none" key={name}>
                <Link role="menuitem" tabIndex="0" aria-label={name} to={link}>{name}</Link>
            </li>;
        };
        const ValikkoItem = (props) => {
            const {name,id} = props;
            return <li role="none" >
                <a role="menuitem" tabIndex="0" aria-label={name} onClick={() => select(id)}>
                    {name}
                    <span className="material-icons">arrow_forward_ios</span>
                </a>
            </li>;
        };

        return (
            <div className="sidebar-valikko">
                <h3 className="" aria-label={this.props.name}>{this.props.name}</h3>
                <ul className="sidebar-valikko--item" >
                    {
                        // className={i.link === this.props.location.pathname ? "current-page" : ""}
                        this.props.links.map((i) => {
                            if(i.type === 'sivu') {
                                return <SivuItem key={i.name} name={i.name} id={i.id}/>
                            } else {
                                return <ValikkoItem key={i.name} name={i.name} id={i.id}/>
                            }
                        })
                    }
                </ul>
            </div>
        )
    }
}

export default withRouter(SidebarValikko);