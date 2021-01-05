import { Box, Grid, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toId } from '#/src/tools/Utils';
import { LocalizedHTML } from './LocalizedHTML';

const Headers = ['h1', 'h2', 'h3', 'h4', 'h5'];
const isHeader = (tag: string) => Headers.includes(tag);
const tagHeaders = (node: any) => {
  if (isHeader(node.name)) {
    const text = node.children[0].data;
    const id = toId(text);
    const isH1 = 'h1' === node.name;
    return (
      <Box pb={0.33} pt={isH1 ? 0.5 : 0} key={id}>
        <Typography id={id} variant={node.name} gutterBottom={true}>
          {text}
        </Typography>
      </Box>
    );
  }
};

type Props = { metadata: { kuvaus: object } };

export const Sora = ({ metadata: { kuvaus } }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <Grid container spacing={2} justify="flex-start" alignItems="flex-start">
        <Grid item xs={12} sm={12} md={12}>
          <Box py={2}>
            <Typography variant="h2">
              {t('valintaperuste.hakijan-terveydentila-ja-toimintakyky')}
            </Typography>
          </Box>
          <LocalizedHTML data={kuvaus} transform={tagHeaders} />
        </Grid>
      </Grid>
    </>
  );
};
