import React, { useEffect } from 'react';

import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { observer } from 'mobx-react-lite';
import { withRouter } from 'react-router-dom';

import { colors } from '../../colors';
import { useStores } from '../../hooks';
import Murupolku from '../common/Murupolku';
import Sisalto from './Sisalto';
import TableOfContents from './TableOfContents';

const useStyles = makeStyles({
  notFound: {
    textAlign: 'center',
  },
  header1: {
    fontSize: '40px',
    lineHeight: '48px',
    marginTop: '15px',
    marginBottom: '30px',
    fontWeight: '700',
    color: colors.black,
  },
  icon: {
    fontSize: '16px',
  },
  component: {
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingTop: '32px',
    '&:last-child': {
      paddingBottom: '32px',
    },
    fontSize: '16px',
    lineHeight: '27px',
    color: colors.darkGrey,
  },
});

const Sivu = observer(({ id }) => {
  const classes = useStyles();
  const { contentfulStore } = useStores();
  const { murupolku } = contentfulStore;

  useEffect(() => {
    const el = window.location.hash
      ? document.getElementById(window.location.hash.substring(1))
      : null;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  const pageId = id;
  const { sivu } = contentfulStore.data;
  const page = sivu[pageId];

  const { content, description, name } = page;
  const tableOfContents = page.tableOfContents === 'true';

  return (
    <React.Fragment>
      <div className={classes.component}>
        <Grid container direction="row" justify="center" spacing={2} alignItems="center">
          <Grid item xs={12} sm={12} md={tableOfContents ? 10 : 6}>
            <Murupolku path={murupolku(pageId)} />
            <h1 className={classes.header1}>{name}</h1>
            <p>{description}</p>
          </Grid>
        </Grid>
        <Grid container direction="row" spacing={2} justify="center">
          {tableOfContents ? (
            <Grid item xs={12} sm={12} md={3}>
              <TableOfContents content={content} />
            </Grid>
          ) : null}
          <Grid item xs={12} sm={12} md={tableOfContents ? 7 : 6}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12}>
                <Sisalto content={content} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
});

export default withRouter(Sivu);
