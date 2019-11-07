import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {observer, inject} from 'mobx-react';
import '../../assets/styles/components/_etusivu.scss';
import ReactMarkdown from "react-markdown";

@inject("contentfulStore")
@observer
class Palvelu extends Component {
    render() {
        const id = this.props.id;
        const {asset} = this.props.contentfulStore.data;
        const palvelu = this.props.contentfulStore.data.palvelu[id];

        const a = palvelu.image ? asset[palvelu.image.id] : null;
        const color = palvelu.color || "sininen";
        return <div className={`services-item ${color}`} key={palvelu.id}  >
            <div className="services-item-header">
                { a ? <img className="card-icon" src={a.url} key={a.id} alt="star"/> : null }{palvelu.name}
            </div>
            <div className="services-item-content">
                <ReactMarkdown source={palvelu.content}/>
            </div>
        </div>;

    }
}

export default withRouter(Palvelu);
