import React, { Component } from 'react';
import Jumpotron from './Jumpotron';
import { Route, withRouter } from 'react-router-dom';
import {observer, inject} from 'mobx-react';
import _ from 'lodash';
import '../assets/styles/components/_etusivu.scss';
import ReactMarkdown from 'react-markdown';
import Kortti from "./kortti/Kortti";
import Uutinen from "./uutinen/Uutinen";
import Palvelu from "./palvelu/Palvelu";

@inject("hakuStore")
@inject("contentfulStore")
@inject("hakuehtoStore")
@observer
class Etusivu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFilterDisplayed: false,
            showMore: false

        };
        this.moveMainContent = this.moveMainContent.bind(this);
        this.showAll = this.showAll.bind(this);
    }

    componentDidMount() {
        this.props.hakuehtoStore.clearHakuehdot();
        this.props.hakuStore.clearHaku();
    }

    moveMainContent() {
        this.setState({...this.state,
            isFilterDisplayed: !this.state.isFilterDisplayed            
        })
    }

    showAll() {
        this.setState({...this.state,
            showMore: !this.state.showMore
        })
    }

    render() {
        let moveMainContent =  this.state.isFilterDisplayed;
        const {
            info, uutiset, ohjeetJaTuki,
            kortit, palvelut} = this.props.contentfulStore.data;

        const forwardToPage = (id) => {
            this.props.history.push(`sivu/${id}`);
        };

        const infos = Object.values(info);
        const single = (entry) => (Object.values(entry)[0] || {});

        const palvelurivit = _.chunk(single(palvelut).linkit, 3);
        const ohjerivit = _.chunk(single(ohjeetJaTuki).linkit, 3);
        let uutisrivit = _.chunk(single(uutiset).linkit, 3);
        const showMore = this.state.showMore === false && uutisrivit.length > 1;
        uutisrivit = showMore ? _.take(uutisrivit, 1) : uutisrivit;

        const Palvelut = (props) => {
            return props.rivit.map(rivi => {
                return <div className="shortcut-container" key={rivi.map(u => u.id).join()}>
                    <h1 className="services-container-title">{props.otsikko}</h1>
                    <div className="services-item-container">
                        {rivi.map(p => <Palvelu id={p.id} key={p.id}/>)}
                    </div>
                </div>;
            })};

        return (
            <React.Fragment>
                <Route exact path='/' render={() => <Jumpotron/>}/>
                <div id="main-content" className={`container ${moveMainContent ? "move-right" : "center-content"}`}>
                    {infos.map((info) =>
                    {
                        return <div className="front-page-notification item-link"
                                    key={info.id}
                                    onClick={() => forwardToPage(info.linkki.id)}>
                            <span className="notification-content">
                                     <ReactMarkdown source={info.content}/>
                            </span>
                        </div>;
                    })}
                    <div className="menu-container">
                        {(single(kortit).kortit || []).map(k => {
                            return <Kortti id={k.id} key={k.id}/>
                        })}
                    </div>
                    <div className="news-container">
                        <h1 className="news-container-title">Ajankohtaista ja uutisia</h1>
                    </div>

                    {uutisrivit.map((rivi) =>
                    {
                        return <div className="news-container" key={rivi.map(u => u.id).join()}>
                                {rivi.map(u => <Uutinen id={u.id} key={u.id}/>)}
                        </div>
                    })}
                    <div className="news-container">
                        {showMore ?
                            <div className="news-show-more">
                                <a role="button" aria-label={"Näytä kaikki"} onClick={this.showAll} className="news-show-button">Näytä kaikki</a>
                            </div> : null
                        }
                    </div>
                    <Palvelut otsikko={"Muut palvelut"} rivit={palvelurivit} />
                    <Palvelut otsikko={"Ohjeet ja tuki"} rivit={ohjerivit} />
                </div>
            </React.Fragment>
        );  
    }
}

export default withRouter(Etusivu);


