import React from 'react';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import Markdown from 'markdown-to-jsx';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core';
import { colors } from '../../colors';
import CardHeader from '@material-ui/core/CardHeader';
import Box from '@material-ui/core/Box';
import { useStores } from '../../hooks';

const useStyles = makeStyles({
  card: {
    cursor: 'pointer',
    borderRadius: 1,
    padding: '20px 20px 0px 20px',
    height: '100%',
  },
  avatar: {},
  content: {
    fontSize: '14px',
    color: colors.white,
  },
  header: {
    fontSize: '20px',
    fontWeight: 'bold',
    borderBottomStyle: 'solid',
    borderWidth: '2px',
    borderColor: colors.white,
    color: colors.white,
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
  sininen: {
    background: colors.blue,
  },
  polku: {
    background: colors.green,
  },
});

const Palvelu = observer(({ id, history }) => {
  const classes = useStyles();
  const { contentfulStore } = useStores();
  const { forwardTo } = contentfulStore;
  const { asset } = contentfulStore.data;
  const palvelu = contentfulStore.data.palvelu[id];

  const a = palvelu.image ? asset[palvelu.image.id] : null;
  const color = palvelu.color || 'sininen';
  const forwardToPage = () => {
    if (palvelu.linkki && palvelu.linkki.id) {
      history.push(forwardTo(palvelu.linkki.id));
    }
  };
  const Paragraph = ({ children }) => {
    return (
      <Box lineHeight="21px" fontSize="14px">
        {children}
      </Box>
    );
  };
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        className={clsx(classes.card, classes[color])}
        key={palvelu.id}
        onClick={forwardToPage}
      >
        <CardHeader
          avatar={
            <Avatar
              aria-label={'TODO'}
              src={contentfulStore.assetUrl(a.url)}
              className={classes.avatar}
            />
          }
          className={classes.header}
          disableTypography={true}
          title={palvelu.name}
          subheader=""
        />
        <CardContent className={classes.content}>
          <Markdown
            options={{
              overrides: {
                p: {
                  component: Paragraph,
                },
                span: {
                  component: Paragraph,
                },
              },
            }}
          >
            {palvelu.content}
          </Markdown>
        </CardContent>
      </Card>
    </Grid>
  );
});

export default withRouter(Palvelu);
