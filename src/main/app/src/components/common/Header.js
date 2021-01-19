import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MenuIcon from '@material-ui/icons/Menu';
import { colors } from '#/src/colors';
import OPOLogoFI from '#/src/assets/images/OPO_Logo_Header_suomi.svg';
import OPOLogoSV from '#/src/assets/images/OPO_Logo_Header_ruotsi.svg';
import OPOLogoEN from '#/src/assets/images/OPO_Logo_Header_englanti.svg';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Chip,
  IconButton,
  Icon,
  makeStyles,
  CssBaseline,
  AppBar,
  Toolbar,
  Hidden,
} from '@material-ui/core';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import BetaBanner from '#/src/components/common/BetaBanner';
import clsx from 'clsx';
import LanguageDropDown from './LanguageDropDown';
import { Localizer as l } from '#/src/tools/Utils';

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
    color: colors.brandGreen,
    borderRadius: 2,
    marginLeft: 20,
    padding: '0px 5px',
    background: 'white',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  betaBanner: {
    height: '90px',
  },
  iconButton: {
    padding: 10,
  },

  menuButton: {
    marginRight: theme.spacing(2),
  },
  languageSelector: {
    marginLeft: 'auto',
  },
}));

const Header = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { toggleMenu, isOpen } = props;
  const [betaBanner, setBetaBanner] = useState(true);

  const OpintopolkuHeaderLogo = () => {
    switch (l.getLanguage()) {
      case 'fi':
        return OPOLogoFI;
      case 'en':
        return OPOLogoEN;
      case 'sv':
        return OPOLogoSV;
      default:
        return OPOLogoFI;
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx([classes.appBar, betaBanner ? classes.betaBanner : null])}>
        {betaBanner ? <BetaBanner onClose={() => setBetaBanner(false)} /> : null}
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleMenu}
            edge="start"
            className={classes.menuButton}>
            {isOpen ? <Icon>close</Icon> : <MenuIcon />}
          </IconButton>
          <LocalizedLink component={RouterLink} to={`/`}>
            <Icon className={classes.icon}>
              <img alt={t('opintopolku.brand')} src={OpintopolkuHeaderLogo()} />
            </Icon>
          </LocalizedLink>
          <Chip
            className={classes.beta}
            size="small"
            classes={{ label: classes.betaLabel }}
            label={t('opintopolku.beta')}
          />
          <Hidden xsDown>
            <Box className={classes.languageSelector}>
              <LanguageDropDown />
            </Box>
          </Hidden>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default Header;
