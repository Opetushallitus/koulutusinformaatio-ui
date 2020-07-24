import React from 'react';
import Markdown from 'markdown-to-jsx';
import { useTranslation } from 'react-i18next';
import { makeStyles, Link } from '@material-ui/core';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import { colors } from '../../colors';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';
import { observer } from 'mobx-react-lite';
import OpetushallitusIcon from '../../assets/images/OpetushallitusIcon.svg';
import OPHIcon from '../../assets/images/OPH logo.png';
import Box from '@material-ui/core/Box';
import { useStores } from '../../hooks';

const useStyles = makeStyles({
  footer: {
    backgroundColor: colors.white,
    lineHeight: '21px',
  },
  link: {
    display: 'block',
    fontSize: '14px',
    lineHeight: '26px',
  },
  content: {
    paddingTop: '36px',
    paddingBottom: '36px',
  },
  hr: {
    backgroundColor: colors.white,
    width: '100%',
    overflow: 'visible',
    padding: '0',
    border: 'none',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors.lightAlphaGrey,
    textAlign: 'center',
  },
  ophIcon: {
    height: '30px',
    top: '-15px',
    position: 'relative',
    backgroundColor: colors.white,
    padding: '0 68px',
  },
  icon: {
    height: '68px',
    top: '-24px',
    position: 'relative',
    backgroundColor: colors.white,
    padding: '0 40px 0 40px',
  },
  spaceOnBorders: {
    paddingLeft: 90,
    paddingRight: 90,
  },
  smSpaceOnBorders: {
    paddingLeft: 10,
    paddingRight: 10,
  },
});

const Footer = () => {
  const { t } = useTranslation();
  const { contentfulStore } = useStores();
  const matches = useMediaQuery('(min-width: 979px)');
  const classes = useStyles();
  const single = (entry) => Object.values(entry || {})[0] || {};
  const { content, contentRight, contentCenter, lopputekstit } = single(
    contentfulStore.data.footer
  );
  const overrides = {
    overrides: {
      a: {
        component: Link,
        props: {
          className: classes.link,
        },
      },
    },
  };
  return (
    <footer>
      <div
        className={clsx(
          classes.footer,
          matches ? classes.spaceOnBorders : classes.smSpaceOnBorders
        )}>
        <Grid container>
          <Grid item xs={12}>
            <div className={classes.hr}>
              <img
                alt={t('opintopolku.brand')}
                className={classes.ophIcon}
                src={OpetushallitusIcon}
              />
            </div>
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justify="space-evenly"
          alignItems="flex-start"
          className={classes.content}>
          <Grid item xs={12} sm={4} md={3}>
            <Box lineHeight={'21px'} m={1}>
              <Markdown options={overrides}>{content || ''}</Markdown>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Box lineHeight={'21px'} m={1}>
              <Markdown options={overrides}>{contentCenter || ''}</Markdown>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Box lineHeight={'21px'} m={1}>
              <Markdown options={overrides}>{contentRight || ''}</Markdown>
            </Box>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <div className={classes.hr}>
              <img alt={t('opintopolku.brand')} className={classes.icon} src={OPHIcon} />
            </div>
          </Grid>
        </Grid>
        <Grid container justify="center" className={classes.content}>
          <Grid item xs={12} sm={12} md={8}>
            <Markdown options={overrides}>{lopputekstit || ''}</Markdown>
          </Grid>
        </Grid>
      </div>
    </footer>
  );
};

export default observer(Footer);
