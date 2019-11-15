import React, { Component } from 'react';
import {observer, inject} from 'mobx-react';
import { withRouter } from 'react-router-dom';
import '../../assets/styles/components/_sivu.scss';
import Murupolku from '../common/Murupolku';
import ReactMarkdown from 'react-markdown';
import parse from "url-parse";
import htmlParser from 'react-markdown/plugins/html-parser';
import HtmlToReact from 'html-to-react';
import TableOfContents from './TableOfContents';

@inject("contentfulStore")
@observer
class Sivu extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }
    static Youtube = (props) => {
        const url = parse(props.url, true);
        return <iframe title={props.url}
                       width="560" height="315"
                       style={{display: "block", margin: "10px 0px"}}
                       src={`https://www.youtube.com/embed/${url.query.v}`}
                       frameBorder="0"
                       allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                       allowFullScreen={true}/>;
    };
    static HeadingLevelToComponent = (level, props) => {
        const value = props.children[0].props.value;
        switch (level) {
            case 1:
                return <h1><a className={"anchor"} name={value}>{value}</a></h1>;
            case 2:
                return <h2><a className={"anchor"} name={value}>{value}</a></h2>;
            case 3:
                return <h3><a className={"anchor"} name={value}>{value}</a></h3>;
            default:
                return <h4><a className={"anchor"} name={value}>{value}</a></h4>
        }
    };
    murupolkuPath = () => {
        const pageId = this.props.match.params.id;
        const {sivu, valikko} = this.props.contentfulStore.data;
        const all = Object.entries(valikko).concat(Object.entries(sivu));
        const page = sivu[pageId];
        const findParent = (id) => {
            const parent = all.find((entry, ind) => {
                const [, item] = entry;
                return (item.linkki || []).find(i => i.id === id);
            });
            if (parent) {
                const [parentId, parentItem] = parent;
                return [parentItem].concat(findParent(parentId));
            } else {
                return [];
            }
        };
        const breadcrump = page ? findParent(pageId).concat([page]) : [];
        return breadcrump.map(b => ({name: b.name, link: `/sivu/${b.id}`}))
    };

    render() {
        const pageId = this.props.match.params.id;
        const {sivu, loading} = this.props.contentfulStore.data;
        const page = sivu[pageId];

        if(page && page.content) {
            const content = page.content;
            const header = page.name;
            var processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);

            var processingInstructions = [
                {
                    shouldProcessNode: function (node) {
                        return node.attribs && node.attribs['class'] === 'embedly-card';
                    },
                    processNode: function (node, children) {
                        return React.createElement(
                            Sivu.Youtube,
                            {url: node.attribs['href']});
                    }
                },
                {
                    shouldProcessNode: function (node) {
                        return true;
                    },
                    processNode: processNodeDefinitions.processDefaultNode
                }
            ];
            const parseHtml = htmlParser({
                isValidNode: node => true,
                processingInstructions: processingInstructions
            });
            const renderers = {
                heading: props => Sivu.HeadingLevelToComponent(props.level, props)
            };
            return (
                <div className="sivu">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <Murupolku path={this.murupolkuPath()}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <TableOfContents content={content}/>
                            </div>
                            <div className="col-6">
                                <h1>{header}</h1>
                                <ReactMarkdown source={content}
                                               escapeHtml={false}
                                               renderers={renderers}
                                               astPlugins={[parseHtml]}
                                />
                            </div>
                        </div>
                    </div>
                </div>);
        } else {
            return (
                <div className="container">
                    <div className="row result-count">
                        <div className="col-12">
                            {loading ? <p>Ladataan...</p>:<h1 aria-live="assertive">Sivua ei löytynyt</h1>}

                        </div>
                    </div>
                </div>);
        }



    }
}

export default withRouter(Sivu);