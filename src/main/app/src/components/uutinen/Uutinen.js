import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {observer, inject} from 'mobx-react';
import '../../assets/styles/components/_etusivu.scss';
import ReactMarkdown from "react-markdown";

@inject("contentfulStore")
@observer
class Uutinen extends Component {

    render() {
        const id = this.props.id;
        const uutinen = this.props.contentfulStore.data.uutinen[id];
        const link = (uutinen.sivu || {}).id

        const {asset} = this.props.contentfulStore.data;
        const Image = (props) => {
            const assetForEntry = (entry) => {
                const image = entry.image || {};
                return image ? asset[image.id] : null;
            };
            const a = assetForEntry(props.asset)
            return a ? <img className="menu-item-header-image card-icon" src={a.url} key={a.id} alt="info"/> : null;
        };

        const forwardToPage = (id) => {
            this.props.history.push(`sivu/${id}`);
        };

        return <div className={`news-item ${link?"item-link":""}`}
                    key={uutinen.id}
                    onClick={() => forwardToPage(link)}>
            <div className="news-item-header">
                <Image asset={uutinen}/>
            </div>
            <div className="news-item-content">
                <ReactMarkdown source={uutinen.content} />
            </div>
        </div>;

    }
}

export default withRouter(Uutinen);
