import React from 'react';
import {observer, inject} from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Murupolku from '../common/Murupolku';
import TableOfContents from './TableOfContents';
import {Accordion, Summary} from './Accordion';
import Heading from './Heading';
import Paragraph from './Paragraph';
import Youtube from './Youtube';
import Grid from '@material-ui/core/Grid';
import {colors} from "../../colors";
import {withStyles} from "@material-ui/core";
import Link from '@material-ui/core/Link';
import Markdown from 'markdown-to-jsx';
import { withTranslation } from 'react-i18next';

const useStyles = theme => ({
    notFound: {
        textAlign: "center"
    },
    header1: {
        fontSize: "40px",
        lineHeight: "48px",
        marginTop: "15px",
        marginBottom: "30px",
        fontWeight: "700",
        color: colors.black
    },
    image: {
        display: 'block',
        marginBottom: "15px",
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

const Sivu = inject(stores => ({contentfulStore: stores.contentfulStore}))(observer(({...props,t, classes, contentfulStore}) => {
    const ImageComponent = ({...props, src, alt}) => {
        const url = src.replace("//images.ctfassets.net/", "")
        return <img className={classes.image} src={contentfulStore.assetUrl(url)} alt={alt}/>
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
        const LinkOrYoutube = ({...props, className}) => {
            if(className === "embedly-card") {
                return <Youtube {...props}/>
            } else {
                return <Link {...props}/>
            }
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
                            {tableOfContents ?<Grid item xs={12} sm={12} md={3}>
                                <TableOfContents content={content}/>
                            </Grid> : null}
                            <Grid item xs={12} sm={12} md={tableOfContents ? 9 : 12}>
                                <Markdown
                                    options={{
                                        overrides: {
                                            img: {
                                                component: ImageComponent
                                            },
                                            h1: {
                                                component: Heading,
                                                props: {
                                                    level: 1
                                                },
                                            },
                                            h2: {
                                                component: Heading,
                                                props: {
                                                    level: 2
                                                },
                                            },
                                            h3: {
                                                component: Heading,
                                                props: {
                                                    level: 3
                                                },
                                            },
                                            h4: {
                                                component: Heading,
                                                props: {
                                                    level: 4
                                                },
                                            },
                                            p: {
                                                component: Paragraph
                                            },
                                            a: {
                                                component: LinkOrYoutube
                                            },
                                            details: {
                                                component: Accordion
                                            },
                                            summary: {
                                                component: Summary
                                            }
                                        }
                                    }}>
                                    {content}
                                </Markdown>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </React.Fragment>);
    } else {
        return (
            <Grid container
                  direction="row"
                  justify="center"
                  alignItems="center"
                  className={classes.component}>
                <Grid item xs={12} sm={6} md={6}
                      className={classes.notFound}>
                    <h1 className={classes.header1}>{t('sisaltohaku.sivua-ei-löytynyt')}</h1>
                    <p>{t('sisaltohaku.etsimääsi-ei-löydy')}</p>
                    <Link href={"/"}>{t('sisaltohaku.takaisin')}</Link>
                </Grid>
            </Grid>);
    }
}));

export default withTranslation()(withRouter(withStyles(useStyles, { withTheme: true })(Sivu)));