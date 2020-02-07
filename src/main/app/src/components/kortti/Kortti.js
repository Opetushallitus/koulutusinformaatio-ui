import React from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Grid, Link, makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import clsx from 'clsx';
import { colors } from '../../colors';
import Icon from '@material-ui/core/Icon';
import { useStores } from '../../hooks';

const useStyles = makeStyles({
  card: {
    height: '100%',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  link: {
    color: colors.white,
    display: 'block',
    fontSize: '16px',
    lineHeight: '35px',
  },
  linkElement: {
    color: colors.white,
    textDecoration: 'none',
    verticalAlign: 'super',
  },
  otsikko: {
    color: colors.white,
    fontFamily: 'Open Sans',
    fontSize: '24px',
    fontWeight: 'bold',
    lineHeight: '28px',
    paddingTop: '10px',
    paddingBottom: '15px',
  },
  haku: {
    background: colors.blue,
  },
  verkko: {
    background: colors.red,
  },
  polku: {
    background: colors.green,
  },
});

const Kortti = observer(({ id }) => {
  const classes = useStyles();
  const { contentfulStore } = useStores();
  const { asset, sivu } = contentfulStore.data;
  const { forwardTo } = contentfulStore;
  const kortti = contentfulStore.data.kortti[id];

  const linkit = kortti.linkit || [];
  const imgUrl = (uutinen) => {
    const assetForEntry = (entry) => {
      const image = entry.image || {};
      return image ? asset[image.id] : null;
    };
    const a = assetForEntry(uutinen);
    return a ? contentfulStore.assetUrl(a.url) : null;
  };
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card className={clsx(classes.card, classes[kortti.color])}>
        <CardMedia
          className={classes.media}
          image={imgUrl(kortti)}
          title={kortti.name}
        />
        <CardContent>
          <h2 className={classes.otsikko}>{kortti.name}</h2>
          {linkit.map((l) => {
            const page = sivu[(l || {}).id];
            return page ? (
              <div className={classes.link} key={page.id}>
                <Icon>chevron_right</Icon>
                <Link
                  className={classes.linkElement}
                  href={`/konfo${forwardTo(page.id)}`}
                  data-cy="kortti-link">
                  {page.name}
                </Link>
              </div>
            ) : null;
          })}
        </CardContent>
      </Card>
    </Grid>
  );
});

export default withRouter(Kortti);
