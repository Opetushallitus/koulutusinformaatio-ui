import React from 'react';

import { makeStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';
import Markdown from 'markdown-to-jsx';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { colors } from '#/src/colors';
import { useContentful } from '#/src/hooks';

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
    background: colors.brandGreen,
  },
});

const Paragraph = ({ children }: { children: React.ReactNode }) => (
  <Box lineHeight="21px" fontSize="14px">
    {children}
  </Box>
);

export const Palvelu = ({ id }: { id: string }) => {
  const classes = useStyles();
  const history = useHistory();
  const { data, forwardTo, assetUrl } = useContentful();
  const { i18n } = useTranslation();
  const { asset } = data;
  const palvelu = data.palvelu[id];

  const a = palvelu.image ? asset[palvelu.image.id] : null;
  const color = (palvelu.color as keyof typeof classes) || 'sininen';
  const forwardToPage = () => {
    if (palvelu.linkki && palvelu.linkki.id) {
      history.push(`/${i18n.language}${forwardTo(palvelu.linkki.id)}`);
    }
  };

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        className={clsx(classes.card, classes[color])}
        key={palvelu.id}
        tabIndex={0}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            forwardToPage();
          }
        }}
        onClick={forwardToPage}>
        <CardHeader
          avatar={
            <Avatar
              aria-label={palvelu.name}
              src={assetUrl(a.url)}
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
            }}>
            {palvelu.content}
          </Markdown>
        </CardContent>
      </Card>
    </Grid>
  );
};
