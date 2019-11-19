import React from 'react';
import {observer, inject} from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Murupolku from '../common/Murupolku';
import ReactMarkdown from 'react-markdown';
import htmlParser from 'react-markdown/plugins/html-parser';
import HtmlToReact from 'html-to-react';
import TableOfContents from './TableOfContents';
import Accordion from './Accordion';
import Heading from './Heading';
import Youtube from './Youtube';
import Grid from '@material-ui/core/Grid';
import {colors} from "../../colors";
import {withStyles} from "@material-ui/core";

const useStyles = theme => ({
    header1: {
        fontSize: "40px",
        lineHeight: "48px",
        marginTop: "15px",
        marginBottom: "30px",
        fontWeight: "600",
        color: colors.black
    },
    image: {
        display: 'block',
    },
    component: {
        paddingTop: "32px",
        "&:last-child": {
            paddingBottom: "32px"
        },
        fontSize: "16px",
        lineHeight: "27px",
        color: colors.grey
    }
});

const Sivu = inject(stores => ({contentfulStore: stores.contentfulStore}))(observer(({...props,classes}) => {

    const ImageComponent = ({src, alt}) => {
        return <img className={classes.image} src={src} alt={alt}/>
    };

    const murupolkuPath = () => {
        const pageId = props.match.params.id;
        const {sivu, valikko} = props.contentfulStore.data;
        const all = Object.entries(valikko).concat(Object.entries(sivu));
        const page = sivu[pageId];
        const findParent = (id) => {
            const parent = all.find((entry, ind) => {
                const [, item] = entry;
                return (item.linkki || []).find(i => i.id === id);
            });
            if (parent) {
                const [parentId, parentItem] = parent;
                return findParent(parentId).concat([parentItem]);
            } else {
                return [];
            }
        };
        const breadcrump = page ? findParent(pageId).concat([page]) : [];
        return breadcrump.map(b => ({name: b.name, link: `/sivu/${b.id}`}))
    };

    const pageId = props.match.params.id;
    const {sivu, loading} = props.contentfulStore.data;
    const page = sivu[pageId];

    if (page && page.content) {
        const {content,description,tableOfContents,name} = page;
        var processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
        var id = 0;
        var processingInstructions = [
            {
                shouldProcessNode: function (node) {
                    return true;
                },
                processNode: function (node, children) {
                    switch (node.name) {
                        case "a":
                            return ((node.attribs || {})['class'] === 'embedly-card') &&
                                React.createElement(
                                    Youtube,
                                    {url: node.attribs['href']});
                        case "details":
                            return React.createElement(
                                Accordion,
                                {key: `key-${++id}`,
                                summary: ((node.children.filter(n => n.name === 'summary')[0] || {}).children || []).map(d => d.data).join(""),
                                text: (node.children.filter(n => n.type === 'text') || []).map(d => d.data).join("")});
                        default:
                            return null;
                    }
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
            imageReference: props => ImageComponent(props),
            heading: props => Heading(props)
        };

        return (
            <React.Fragment>
                <Grid container
                      direction="row"
                      justify="center"
                      alignItems="center"
                      className={classes.component}>
                    <Grid item xs={12} sm={12} md={10}>
                        <Murupolku path={murupolkuPath()}/>
                    </Grid>
                </Grid>
                <Grid container
                      direction="row"
                      justify="center"
                      alignItems="center"
                      className={classes.component}>
                    <Grid item xs={12} sm={12} md={10}>
                        <h1 className={classes.header1}>{name}</h1>
                        <p>{description}</p>
                        <Grid container>
                            {tableOfContents ?<Grid item xs={12} sm={3}>
                                <TableOfContents content={content}/>
                            </Grid> : null}
                            <Grid item xs={12} sm={tableOfContents ? 9 : 12}>
                                <ReactMarkdown source={content}
                                               escapeHtml={false}
                                               renderers={renderers}
                                               disallowedTypes={['paragraph']}
                                               unwrapDisallowed
                                               astPlugins={[parseHtml]}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </React.Fragment>);
    } else {
        return (
            <div className="container">
                <div className="row result-count">
                    <div className="col-12">
                        {loading ? <p>Ladataan...</p> : <h1 aria-live="assertive">Sivua ei löytynyt</h1>}

                    </div>
                </div>
            </div>);
    }
}));

export default withRouter(withStyles(useStyles, { withTheme: true })(Sivu));