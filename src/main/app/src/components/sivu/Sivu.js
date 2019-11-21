import React from 'react';
import {observer, inject} from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Murupolku from '../common/Murupolku';
import TableOfContents from './TableOfContents';
import Sisalto from './Sisalto';
import Grid from '@material-ui/core/Grid';
import {colors} from "../../colors";
import {withStyles} from "@material-ui/core";
import Link from '@material-ui/core/Link';
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
    icon: {
        fontSize: "16px"
    },
    component: {
        paddingLeft: "10px",
        paddingRight: "10px",
        paddingTop: "32px",
        "&:last-child": {
            paddingBottom: "32px"
        },
        fontSize: "16px",
        lineHeight: "27px",
        color: colors.grey
    },
});

const Sivu = inject(stores => ({contentfulStore: stores.contentfulStore}))(observer(({...props,t, classes, contentfulStore}) => {
    const {forwardTo} = contentfulStore;

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
        return breadcrump.map(b => ({name: b.name, link: forwardTo(b.id)}))
    };

    const pageId = props.match.params.id;
    const {sivu, loading} = props.contentfulStore.data;
    const page = sivu[pageId];

    if (page && page.content) {
        const {content,description,name, sideContent} = page;
        const tableOfContents = page.tableOfContents === true;
        const isBlank = (str) => {
            return (!str || /^\s*$/.test(str))
        };
        const hasSideContent = !isBlank(sideContent);


        return (
            <React.Fragment>
                <div className={classes.component}>
                    <Grid container
                          direction="row"
                          justify="center"
                          alignItems="center">
                        <Grid item xs={12} sm={12} md={tableOfContents ? (hasSideContent ? 12 : 10) : 7}>
                            <Murupolku path={murupolkuPath()}/>
                            <h1 className={classes.header1}>{name}</h1>
                            <p>{description}</p>
                        </Grid>
                    </Grid>
                    <Grid container
                          direction="row"
                          justify="center">
                        {tableOfContents ? <Grid item xs={12} sm={12} md={3}>
                            <TableOfContents content={content}/>
                        </Grid> : null}
                        <Grid item xs={12} sm={12} md={tableOfContents ? (hasSideContent ? 9 : 7) : 7}>
                            <Grid container>
                                <Grid item xs={12} sm={12} md={hasSideContent ? 8 : 12}>
                                    <Sisalto content={content}
                                             contentfulStore={contentfulStore}/>
                                </Grid>
                                {hasSideContent ?
                                    <Grid item xs={12} sm={12} md={4}>
                                        <Sisalto content={sideContent}
                                                 alwaysFullWidth={true}
                                                 contentfulStore={contentfulStore}/>
                                    </Grid> : null}
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </React.Fragment>);
    } else {
        return (
            <Grid container
                  direction="row"
                  justify="center"
                  alignItems="center"
                  className={classes.component}>
                {loading ? null :
                    <Grid item xs={12} sm={6} md={6}
                          className={classes.notFound}>
                        <h1 className={classes.header1}>{t('sisaltohaku.sivua-ei-löytynyt')}</h1>
                        <p>{t('sisaltohaku.etsimääsi-ei-löydy')}</p>
                        <Link href={"/"}>{t('sisaltohaku.takaisin')}</Link>
                    </Grid>}
            </Grid>);
    }
}));

export default withTranslation()(withRouter(withStyles(useStyles, { withTheme: true })(Sivu)));