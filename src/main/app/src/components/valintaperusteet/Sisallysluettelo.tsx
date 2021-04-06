import React from 'react';

import { Grid, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { HashLink as Link } from 'react-router-hash-link';

import { colors } from '#/src/colors';
import { scrollIntoView, toId } from '#/src/tools/Utils';

const useStyles = makeStyles({
  toc: {
    position: 'sticky',
    alignSelf: 'flex-start',
    height: 'auto',
    top: '90px',
    paddingTop: '30px',
    paddingBottom: '10px',
  },
  link: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '14px',
    lineHeight: '27px',
    color: colors.brandGreen,
    borderLeftColor: colors.lightGrey,
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    textDecoration: 'none',
    display: 'block',
    paddingLeft: '21px',
    paddingBottom: '10px',
    paddingTop: '10px',
    '&:last-child': {
      borderBottomStyle: 'none',
    },
  },
});

type Props = {
  kuvausVisible: boolean;
  valintatavatVisible: boolean;
  valintakokeetVisible: boolean;
  sorakuvausVisible: boolean;
  liitteetVisible: boolean;
};

export const Sisallysluettelo = (props: Props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const visibleIds = [
    props.kuvausVisible && t('valintaperuste.kuvaus'),
    props.valintatavatVisible && t('valintaperuste.valintatavat'),
    props.valintakokeetVisible && t('valintaperuste.valintakokeet'),
    props.sorakuvausVisible && t('valintaperuste.sorakuvaus'),
    props.liitteetVisible && t('valintaperuste.liitteet'),
  ].filter(Boolean) as Array<string>;

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      className={classes.toc}>
      <Grid item xs={10}>
        {visibleIds.map((name, i) => (
          <Link
            key={`${name}-${i}`}
            className={classes.link}
            aria-label={name}
            to={`#${toId(name)}`}
            scroll={(el: HTMLElement) => scrollIntoView(el)}>
            {name}
          </Link>
        ))}
      </Grid>
    </Grid>
  );
};
