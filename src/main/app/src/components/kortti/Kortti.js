import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {observer, inject} from 'mobx-react';
import '../../assets/styles/components/_etusivu.scss';
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import {withStyles} from "@material-ui/core";
import clsx from 'clsx';
import {colors} from "../../colors";
import Icon from '@material-ui/core/Icon';

const korttiStyles = theme => ({
    card: {
        width: "100%"
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    link: {
        color: colors.white,
        display: "block",
    },
    linkElement: {
        color: colors.white,
        textDecoration: "none",
        verticalAlign: "super"
    },
    otsikko: {
        color: colors.white
    },
    haku: {
        background: colors.blue
    },
    verkko: {
        background: colors.red
    },
    polku: {
        background: colors.green
    }
});

@inject("contentfulStore")
@observer
class Kortti extends Component {

    render() {
        const {id, classes} = this.props;
        const {asset, sivu} = this.props.contentfulStore.data;
        const kortti = this.props.contentfulStore.data.kortti[id];

        const linkit = kortti.linkit || [];
        const imgUrl = (uutinen) => {
            const assetForEntry = (entry) => {
                const image = entry.image || {};
                return image ? asset[image.id] : null;
            };
            const a = assetForEntry(uutinen)
            return a ? a.url : null;
        };

        return <Grid item xs={12} sm={6} md={4}
                     key={kortti.id}>
            <Card className={clsx(classes.card, classes[kortti.color])} >
                <CardMedia
                    className={classes.media}
                    image={imgUrl(kortti)}
                    title="TODO"
                />
                <CardContent>
                    <h2 className={classes.otsikko}>{kortti.name}</h2>
                    {linkit.map(l => {
                        const page = sivu[l.id];
                        return page ?
                            <div className={classes.link}>
                                <Icon>chevron_right</Icon>
                            <Link key={page.id}
                                            className={classes.linkElement}
                                            to={`sivu/${page.id}`}>{page.name}</Link>
                            </div> : null;
                    })}
                </CardContent>
            </Card>
        </Grid>;

    }
}

export default withRouter(withStyles(korttiStyles, { withTheme: true })(Kortti));
