import React from 'react';
import { Accordion, Summary } from './Accordion';
import Markdown from 'markdown-to-jsx';
import Link from '@material-ui/core/Link';
import Youtube from './Youtube';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { colors } from '../../colors';
import { makeStyles, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';

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
  image: {
    display: 'block',
    marginBottom: '15px',
  },

  media: {
    height: 0,
    paddingTop: '56.25%',
  },
  card: {},
  imageContainer: {},
  youtube: {
    paddingTop: '0',
    paddingBottom: '20px',
  },
});

const Sisalto = observer(
  ({ content, contentfulStore, alwaysFullWidth, excludeMedia, ...props }) => {
    const classes = useStyles();
    const { forwardTo } = contentfulStore;
    const { sivu } = contentfulStore.data;
    const forwardToPage = (e, id) => {
      props.history.push(forwardTo(id));
      e.preventDefault();
    };
    const Null = (props) => null;
    const ImageComponent = ({ src, alt, ...props }) => {
      const url = src.replace('//images.ctfassets.net/', '');
      return (
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          className={classes.imageContainer}
        >
          <Grid
            item
            xs={12}
            sm={alwaysFullWidth ? 12 : 12}
            md={alwaysFullWidth ? 12 : 12}
          >
            <Card className={classes.card} elevation={0}>
              <CardMedia
                className={classes.media}
                image={contentfulStore.assetUrl(url)}
                title={alt}
              />
            </Card>
          </Grid>
        </Grid>
      );
    };
    const SivuLink = (props) => {
      const id = props.children[0];
      return <Link onClick={(e) => forwardToPage(e, id)}>{sivu[id].name}</Link>;
    };
    const LinkOrYoutube = ({ children, className, ...props }) => {
      if (className === 'embedly-card') {
        return (
          <div className={classes.youtube}>
            <Youtube {...props} />
          </div>
        );
      } else {
        return (
          <Link target="_blank" rel="noopener" {...props}>
            {children}
            <OpenInNewIcon className={classes.icon} />
          </Link>
        );
      }
    };
    return (
      <Markdown
        options={{
          overrides: {
            img: {
              component: excludeMedia ? Null : ImageComponent,
            },
            h1: {
              component: Typography,
              props: {
                variant: 'h1',
                gutterBottom: true,
              },
            },
            h2: {
              component: Typography,
              props: {
                variant: 'h2',
                gutterBottom: true,
              },
            },
            h3: {
              component: Typography,
              props: {
                variant: 'h3',
                gutterBottom: true,
              },
            },
            h4: {
              component: Typography,
              props: {
                variant: 'h4',
                gutterBottom: true,
              },
            },
            p: {
              component: Typography,
              props: {
                variant: 'body1',
                component: 'div',
                paragraph: true,
              },
            },
            a: {
              component: excludeMedia ? Null : LinkOrYoutube,
            },
            details: {
              component: excludeMedia ? Null : Accordion,
            },
            summary: {
              component: excludeMedia ? Null : Summary,
            },
            sivu: {
              component: SivuLink,
            },
          },
        }}
      >
        {content}
      </Markdown>
    );
  }
);

export default withRouter(Sisalto);
