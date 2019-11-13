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
import Grid from '@material-ui/core/Grid';
import {colors} from "../colors";
import {withStyles} from "@material-ui/core";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import clsx from "clsx";

const etusivuStyles = theme => ({
    content: {
        marginLeft: "90px",
        marginRight: "90px"
    },
    header: {
        fontSize: "28px",
        paddingLeft: "12px",
        paddingTop: "60px"
    },
    spaceOnBorders: {
        paddingLeft: 90,
        paddingRight: 90,

    },
    oikopolut: {
        backgroundColor: colors.white,
        paddingBottom: "100px"
    },
    uutiset: {
        backgroundColor: colors.lightGreyBackground,
        paddingBottom: "100px"
    },
    palvelut: {
        backgroundColor: colors.white,
        paddingBottom: "100px"
    },
});




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
        this.showAll = this.showAll.bind(this);
    }

    componentDidMount() {
        this.props.hakuehtoStore.clearHakuehdot();
        this.props.hakuStore.clearHaku();
    }

    showAll() {
        this.setState({...this.state,
            showMore: !this.state.showMore
        })
    }

    render() {
        const {
            info, uutiset, ohjeetJaTuki,
            kortit, palvelut} = this.props.contentfulStore.data;
        const {classes} = this.props;
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
                return <Grid container key={rivi.map(u => u.id).join()}>
                    <h1 className={classes.header}>{props.otsikko}</h1>
                <Grid container item xs={12} spacing={3} >

                    {rivi.map(p => <Palvelu id={p.id} key={p.id}/>)}
                </Grid>
                </Grid>;
            })};

        const EtusivuContent = (props) => {
            const matches = useMediaQuery('(min-width: 979px)');
            return <React.Fragment>
                <Route exact path='/' render={() => <Jumpotron/>}/>
                <div className={clsx(classes.oikopolut, matches? classes.spaceOnBorders: null)}>
                    <Grid container spacing={3}>
                        {infos.map((info) => {
                            return <Grid item xs={12} key={info.id}>
                                <div className="front-page-notification item-link"
                                     onClick={() => forwardToPage(info.linkki.id)}>
                            <span className="notification-content">
                                     <ReactMarkdown source={info.content}/>
                            </span>
                                </div>
                            </Grid>;
                        })}
                        <h1 className={classes.header}>Oikopolut</h1>
                        <Grid container item xs={12} spacing={3}>
                            {(single(kortit).kortit || []).map(k => {
                                return <Kortti id={k.id}
                                               key={k.id}/>;
                            })}
                        </Grid>

                    </Grid>
                </div>

                <div className={clsx(classes.uutiset, matches? classes.spaceOnBorders: null)}>
                    <Grid container spacing={3}>

                        <Grid container item xs={12} spacing={3}>
                            <h1 className={classes.header}>Ajankohtaista ja uutisia</h1>
                        </Grid>

                        {uutisrivit.map((rivi) => {
                            return <Grid container item xs={12} spacing={3}
                                         key={rivi.map(u => u.id).join()}>
                                {rivi.map(u => <Uutinen id={u.id}
                                                        key={u.id}/>)}
                            </Grid>
                        })}

                        <Grid container item xs={12} spacing={3}>
                            {showMore ?
                                <div className="news-show-more">
                                    <a role="button" aria-label={"Näytä kaikki"} onClick={this.showAll}
                                       className="news-show-button">Näytä kaikki</a>
                                </div> : null
                            }
                        </Grid>

                    </Grid>
                </div>

                <div className={clsx(classes.palvelut, matches? classes.spaceOnBorders: null)}>
                    <Grid container spacing={3}>
                        <Palvelut otsikko={"Muut palvelut"} rivit={palvelurivit}/>
                        <Palvelut otsikko={"Ohjeet ja tuki"} rivit={ohjerivit}/>
                    </Grid>
                </div>
            </React.Fragment>
        };
        return <EtusivuContent/>;
    }
}


export default withRouter(withStyles(etusivuStyles, { withTheme: true })(Etusivu));


