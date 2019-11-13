import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {observer, inject} from 'mobx-react';
import '../../assets/styles/components/_etusivu.scss';
import ReactMarkdown from "react-markdown";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {withStyles} from "@material-ui/core";

const uutinenStyles = theme => ({
    card: {
        cursor: "pointer"
    },
    media: {
        height: 0,
        paddingTop: '56.25%'
    }
});

@inject("contentfulStore")
@observer
class Uutinen extends Component {

    render() {
        const {id, classes} = this.props;
        const uutinen = this.props.contentfulStore.data.uutinen[id];
        const link = (uutinen.sivu || {}).id

        const {asset} = this.props.contentfulStore.data;

        const imgUrl = (uutinen) => {
            const assetForEntry = (entry) => {
                const image = entry.image || {};
                return image ? asset[image.id] : null;
            };
            const a = assetForEntry(uutinen)
            return a ? a.url : null;
        };

        const forwardToPage = (id) => {
            this.props.history.push(`sivu/${id}`);
        };

        return <Grid item xs={12} sm={6} md={4}
                     key={uutinen.id}
                     onClick={() => forwardToPage(link)}>
            <Card className={classes.card}
                  elevation={6}
            >
                <CardMedia
                    className={classes.media}
                    image={imgUrl(uutinen)}
                    title="TODO"
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        <ReactMarkdown source={uutinen.content}/>
                    </Typography>
                </CardContent>
            </Card>
        </Grid>;
    }
}

export default withRouter(withStyles(uutinenStyles, { withTheme: true })(Uutinen));
