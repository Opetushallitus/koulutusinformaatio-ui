import React from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import Markdown from 'markdown-to-jsx';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core';
import { colors } from '../../colors';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks';

const useStyles = makeStyles({
  card: {
    cursor: 'pointer',
    fontSize: '19px',
    lineHeight: '26px',
    color: colors.green,
    height: '100%',
  },
  content: {
    marginTop: '20px',
    marginBottom: '5px',
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
  kategoria: {
    textTransform: 'uppercase',
    color: colors.grey,
    fontSize: '14px',
    lineHeight: '19px',
    fontWeight: 'light',
  },
  pvm: {
    color: colors.grey,
    fontSize: '14px',
    lineHeight: '19px',
    textAlign: 'end',
  },
});

const Uutinen = observer(({ id, history }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { contentfulStore } = useStores();
  const { forwardTo } = contentfulStore;
  const uutinen = contentfulStore.data.uutinen[id];
  const link = (uutinen.sivu || {}).id;

  const { asset } = contentfulStore.data;
  const imgUrl = (uutinen) => {
    const assetForEntry = (entry) => {
      const image = entry.image || {};
      return image ? asset[image.id] : null;
    };
    const a = assetForEntry(uutinen);
    return a ? contentfulStore.assetUrl(a.url) : null;
  };

  const forwardToPage = (id) => {
    history.push(forwardTo(id));
  };

  return (
    <Grid item xs={12} sm={6} md={4} onClick={() => forwardToPage(link)}>
      <Card className={classes.card} elevation={6}>
        <CardMedia
          className={classes.media}
          image={imgUrl(uutinen)}
          title="TODO"
        />
        <CardContent>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item xs={6} className={classes.kategoria}>
              {t('uutinen.kategoria')}
            </Grid>
            <Grid item xs={6} className={classes.pvm}>
              07.11.2019
            </Grid>
          </Grid>
          <div className={classes.content}>
            <Markdown>{uutinen.content}</Markdown>
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
});

export default withRouter(Uutinen);
