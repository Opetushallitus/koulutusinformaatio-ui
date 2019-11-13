import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';
import {observer, inject} from 'mobx-react';
import '../../assets/styles/components/_etusivu.scss';
import ReactMarkdown from "react-markdown";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Avatar from "@material-ui/core/Avatar";
import CardContent from "@material-ui/core/CardContent";
import {withStyles} from "@material-ui/core";
import {colors} from "../../colors";
import CardHeader from '@material-ui/core/CardHeader';

const palveluStyles = theme => ({
    card: {
        cursor: "pointer",
        minHeight: "255px",
        borderRadius: 1,
        padding: "20px 20px 0px 20px",
    },
    avatar: {

    },
    content: {
        fontSize: "14px",
        color: colors.white

    },
    header: {
        fontSize: "20px",
        fontWeight: "bold",
        borderBottomStyle: "solid",
        borderWidth: "2px",
        borderColor: colors.white,
        color: colors.white
    },
    media: {
        height: 0,
        paddingTop: '56.25%'
    },
    sininen: {
        background: colors.blue
    },
    polku: {
        background: colors.green
    }
});

@inject("contentfulStore")
@observer
class Palvelu extends Component {
    render() {
        const {id, classes} = this.props;
        const {asset} = this.props.contentfulStore.data;
        const palvelu = this.props.contentfulStore.data.palvelu[id];

        const a = palvelu.image ? asset[palvelu.image.id] : null;
        const color = palvelu.color || "sininen";
        const forwardToPage = () => {
            if(palvelu.linkki && palvelu.linkki.id) {
                this.props.history.push(`sivu/${palvelu.linkki.id}`);
            }
        };

        return <Grid item xs={12} sm={6} md={4}
                     key={palvelu.id}>
            <Card className={clsx(classes.card, classes[color])} key={palvelu.id} onClick={forwardToPage}>
                <CardHeader
                    avatar={
                        <Avatar aria-label={"TODO"}
                                src={a.url}
                                className={classes.avatar}>
                        </Avatar>
                    }
                    className={classes.header}
                    disableTypography={true}
                    title={palvelu.name}
                    subheader=""
                />
                <CardContent className={classes.content}>
                    <ReactMarkdown source={palvelu.content}/>
                </CardContent>
            </Card>
        </Grid>;
    }
}

export default withRouter(withStyles(palveluStyles, { withTheme: true })(Palvelu));
