import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import { withRouter } from 'react-router-dom';
import {useTranslation, withTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core";
import {colors} from "../../colors";
import Icon from '@material-ui/core/Icon';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles({
    breadcrump: {
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
        paddingRight: "15px",
    }
});

const Murupolku = ({path, history}) => {
    const {t} = useTranslation();
    const classes = useStyles();
    const forwardToFrontPage = (path) => {
        history.push(path);
    };
    return <div className={classes.breadcrump}>
        <Icon className={classes.icon}><HomeOutlinedIcon/></Icon>

        <Link onClick={() => forwardToFrontPage('/')} className={classes.link}>{t('etusivu')}</Link>
        {path.map(({name, link}, ind) => {
            return [
                link ? <Link key={`breadcrumplink-${ind}`} className={classes.link}
                                  to={link}>{name}</Link>
                    : <span key={`breadcrumplink-${ind}`} className={classes.link}>{name}</span>
            ];
        })}
    </div>;
}

export default withRouter(Murupolku);