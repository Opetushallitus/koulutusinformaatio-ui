import React from 'react';
import { withRouter } from 'react-router-dom';
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core";
import Icon from '@material-ui/core/Icon';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import Link from '@material-ui/core/Link';
import clsx from 'clsx';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import {colors} from "../../colors";
import _ from 'lodash';

const useStyles = makeStyles({
    breadcrump: {
        height: "20px"
    },
    forwardIcon: {
        color: colors.lightGrey,
        marginRight: "10px",
        marginLeft: "10px"
    },
    icon: {
        marginRight: "10px"

    },
    link: {
        fontWeight: "400",
        maxWidth: "250px",
        display: "inline-block",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        verticalAlign: "top",
        color: colors.grey
    },
    lastLink: {
        color: colors.green
    }
});

const Murupolku = ({path, history}) => {
    const {t} = useTranslation();
    const classes = useStyles();
    const forwardToFrontPage = (path) => {
        history.push(path);
    };
    const last = path[path.length - 1];
    return <div className={classes.breadcrump}>
        <Icon className={classes.icon}><HomeOutlinedIcon/></Icon>
        <Link onClick={() => forwardToFrontPage('/')} className={classes.link}>{t('etusivu')}</Link>
        {path.map(({...currentLink, name, link}, ind) => {
            return [
                <ArrowForwardIosIcon style={{ fontSize: "12px", height: "20px" }}
                                     key={`breadcrumpseparator-${ind}`}
                                     className={classes.forwardIcon}/>,
                link ? <Link key={`breadcrumplink-${ind}`}
                             className={clsx(classes.link, _.isEqual(currentLink, last) && classes.lastLink)}
                             to={link}>{name}</Link>
                    : <span key={`breadcrumplink-${ind}`}
                            className={clsx(classes.link)}>{name}</span>
            ];
        })}
    </div>;
}

export default withRouter(Murupolku);