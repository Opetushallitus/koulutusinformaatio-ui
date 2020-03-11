import React from 'react';
import { useTranslation } from 'react-i18next';
import MenuIcon from '@material-ui/icons/Menu';
import { colors } from '../../colors';
import HeaderIcon from '../../assets/images/Header.svg';
import { Link as RouterLink } from 'react-router-dom';
import {
  Chip,
  IconButton,
  Icon,
  Link,
  makeStyles,
  CssBaseline,
  AppBar,
  Toolbar,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  inputRoot: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  betaLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  icon: {
    width: '160px',
    height: '100%',
    cursor: 'pointer',
  },
  beta: {
    color: colors.green,
    borderRadius: 2,
    marginLeft: 20,
    padding: '0px 5px',
    background: 'white',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  iconButton: {
    padding: 10,
  },

  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

const Header = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { toggleMenu, isOpen } = props;
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleMenu}
            edge="start"
            className={classes.menuButton}>
            {isOpen ? <Icon>close</Icon> : <MenuIcon />}
          </IconButton>
          <Link component={RouterLink} to={`/`}>
            <Icon className={classes.icon}>
              <img alt={t('opintopolku.brand')} src={HeaderIcon} />
            </Icon>
          </Link>
          <Chip
            className={classes.beta}
            size="small"
            classes={{ label: classes.betaLabel }}
            label={t('opintopolku.beta')}
          />
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default Header;
