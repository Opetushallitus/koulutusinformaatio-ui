import React  from 'react';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';
import '../../assets/styles/components/_etusivu.scss';
import {colors} from "../../colors";
import Grid from "@material-ui/core/Grid";
import Palvelu from "./Palvelu";
import _ from "lodash";
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import { inject } from "mobx-react";
import { observer } from "mobx-react-lite";
import {useTranslation} from 'react-i18next';

const useStyles = makeStyles({
    header: {
        fontSize: "28px",
        paddingTop: "60px",
        paddingBottom: "28px",
        fontWeight: "700"
    },
    spaceOnBorders: {
        paddingLeft: 90,
        paddingRight: 90,
    },
    smSpaceOnBorders: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    palvelut: {
        backgroundColor: colors.white,
        paddingBottom: "100px"
    },
});

const Palvelut = inject(stores => ({contentfulStore: stores.contentfulStore}))(observer(({contentfulStore}) => {
    const {t} = useTranslation();
    const matches = useMediaQuery('(min-width: 979px)');
    const {ohjeetJaTuki, palvelut} = (contentfulStore.data || {});
    const classes = useStyles();

    const single = (entry) => (Object.values(entry || [])[0] || {});

    const palvelurivit = _.chunk(single(palvelut).linkit, 3);
    const ohjerivit = _.chunk(single(ohjeetJaTuki).linkit, 3);

    const Rivi = (props) => {
        return props.rivit.map(rivi => {
            return <Grid container key={rivi.map(u => u.id).join()}>
                <h1 className={classes.header}>{props.otsikko}</h1>
                <Grid container spacing={3} >

                    {rivi.map(p => <Palvelu id={p.id} key={p.id}/>)}
                </Grid>
            </Grid>;
        })};

    return <div className={clsx(classes.palvelut, matches? classes.spaceOnBorders: classes.smSpaceOnBorders)}>
        <Grid container>
            <Rivi otsikko={"Muut palvelut"} rivit={palvelurivit}/>
            <Rivi otsikko={"Ohjeet ja tuki"} rivit={ohjerivit}/>
        </Grid>
    </div>;
}));

export default withRouter(Palvelut);
