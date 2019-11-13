import React, { Component } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom'
import { translate } from 'react-i18next';
import '../../assets/styles/components/_header.scss';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import MenuIcon from '@material-ui/icons/Menu';
import Icon from '@material-ui/core/Icon';
import {withStyles} from "@material-ui/core";
import { colors } from '../../colors';
import HeaderIcon from '../../assets/images/Header.svg'

const headerStyles = theme => ({
    root: {
        display: 'flex',
    },
    inputRoot: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
    },
    betaLabel: {
        fontSize: 12,
        fontWeight: "bold",
        textTransform: 'uppercase'

    },
    icon: {
        width: "160px",
        height: "25px"
    },
    beta: {
        color: colors.green,
        borderRadius: 2,
        marginLeft: 20,
        padding: '0px 5px',
        background: 'white'
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1
    },
    iconButton: {
        padding: 10,
    },

    menuButton: {
        marginRight: theme.spacing(2)
    },
});

@translate()
class Header extends Component {
    
    render() {
        const {t, toggleMenu, isOpen, classes} = this.props;
        return (<React.Fragment>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar)}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleMenu}
                            edge="start"
                            className={clsx(classes.menuButton)}>
                            {isOpen?<Icon>close</Icon>: <MenuIcon />}
                        </IconButton>
                        <Icon className={classes.icon}>
                            <img alt={t('opintopolku.brand')} src={HeaderIcon}/>
                        </Icon>
                        <Chip className={classes.beta}
                              size='small'
                              classes={{label: classes.betaLabel}}
                              label={t('opintopolku.beta')}/>
                    </Toolbar>
                </AppBar>
            </React.Fragment>
        );
    }
}

export default withStyles(headerStyles, { withTheme: true })(Header);
