import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Murupolku from '../common/Murupolku';
import TableOfContents from './TableOfContents';
import Sisalto from './Sisalto';
import Grid from '@material-ui/core/Grid';
import { colors } from '../../colors';
import { makeStyles } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks';
import { observer } from 'mobx-react-lite';

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
    color: colors.grey,
  },
});

const Sivu = observer((props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { contentfulStore } = useStores();
  const { forwardTo } = contentfulStore;

  useEffect(() => {
    const el = window.location.hash
      ? document.getElementById(window.location.hash.substring(1))
      : null;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
  const murupolkuPath = () => {
    const pageId = props.match.params.id;
    const { sivu, valikko } = contentfulStore.data;
    const all = Object.entries(valikko).concat(Object.entries(sivu));
    const page = sivu[pageId];
    const findParent = (id) => {
      const childId = (sivu[id] || {}).id || id;
      const parent = all.find((entry, ind) => {
        const [, item] = entry;
        return (item.linkki || []).find((i) => i.id === childId);
      });
      if (parent) {
        const [parentId, parentItem] = parent;
        return findParent(parentId).concat([parentItem]);
      } else {
        return [];
      }
    };
    const breadcrump = page ? findParent(pageId).concat([page]) : [];
    return breadcrump.map((b) => ({ name: b.name, link: forwardTo(b.id) }));
  };

  const pageId = props.match.params.id;
  const { sivu, loading } = contentfulStore.data;
  const page = sivu[pageId];

  if (page && page.content) {
    const { content, description, name, sideContent } = page;
    const tableOfContents = page.tableOfContents === 'true';
    const isBlank = (str) => {
      return !str || /^\s*$/.test(str);
    };
    const hasSideContent = !isBlank(sideContent);

    return (
      <React.Fragment>
        <div className={classes.component}>
          <Grid
            container
            direction="row"
            justify="center"
            spacing={2}
            alignItems="center"
          >
            <Grid
              item
              xs={12}
              sm={12}
              md={tableOfContents ? (hasSideContent ? 12 : 10) : 6}
            >
              <Murupolku path={murupolkuPath()} />
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
            <Grid
              item
              xs={12}
              sm={12}
              md={tableOfContents ? (hasSideContent ? 9 : 7) : 6}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={hasSideContent ? 8 : 12}>
                  <Sisalto
                    content={content}
                    contentfulStore={contentfulStore}
                  />
                </Grid>
                {hasSideContent ? (
                  <Grid item xs={12} sm={12} md={4}>
                    <Sisalto
                      content={sideContent}
                      alwaysFullWidth={true}
                      contentfulStore={contentfulStore}
                    />
                  </Grid>
                ) : null}
              </Grid>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  } else {
    return (
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.component}
      >
        {loading ? null : (
          <Grid item xs={12} sm={6} md={6} className={classes.notFound}>
            <h1 className={classes.header1}>
              {t('sisaltohaku.sivua-ei-löytynyt')}
            </h1>
            <p>{t('sisaltohaku.etsimääsi-ei-löydy')}</p>
            <Link href={'/'}>{t('sisaltohaku.takaisin')}</Link>
          </Grid>
        )}
      </Grid>
    );
  }
});

export default withRouter(Sivu);
