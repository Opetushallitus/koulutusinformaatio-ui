import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {observer, inject} from 'mobx-react';
import '../../assets/styles/components/_etusivu.scss';

@inject("contentfulStore")
@observer
class Kortti extends Component {

    render() {
        const id = this.props.id;
        const {asset, sivu} = this.props.contentfulStore.data;
        const kortti = this.props.contentfulStore.data.kortti[id];

        const linkit = kortti.linkit || [];
        const Image = (props) => {
            const assetForEntry = (entry) => {
                const image = entry.image || {};
                return image ? asset[image.id] : null;
            };
            const a = assetForEntry(props.asset)
            return a ? <img className="menu-item-header-image" src={a.url} key={a.id} alt="info"/> : null;
        };

        return <div className={`menu-item ${kortti.color}`}>
            <div className="menu-item-header">
                <Image asset={kortti}/>
            </div>
            <div className="menu-item-content">
                <h2>{kortti.name}</h2>
                {linkit.map(l => {
                    const page = sivu[l.id];
                    return page ? <Link key={page.id} to={`sivu/${page.id}`}>{page.name}</Link> : null;
                })}
            </div>
        </div>;

    }
}

export default withRouter(Kortti);
