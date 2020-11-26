import React from 'react';
import _ from 'lodash';
import { Typography, Box, Grid } from '@material-ui/core';
import { Localizer as l, sanitizedHTMLParser } from '#/src/tools/Utils';
import hyphenated from '#/src/components/valintaperusteet/hyphenated';

const Headers = ['h1', 'h2', 'h3', 'h4', 'h5'];
const isHeader = (tag) => Headers.includes(tag);
const tagHeaders = (node) => {
  if (isHeader(node.name)) {
    const text = node.children[0].data;
    const id = hyphenated(text);
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

export const Sora = ({ metadata: { kuvaus }, nimi }) => {
  const lang = l.getLanguage();
  const html = kuvaus[lang] || _.first(Object.values(kuvaus));

  return (
    <>
      <Grid container spacing={2} justify="flex-start" alignItems="flex-start">
        <Grid item xs={12} sm={12} md={12}>
          <Box py={2}>
            <Typography id={hyphenated(l.localize(nimi))} variant="h2">
              {l.localize(nimi)}
            </Typography>
          </Box>
          {sanitizedHTMLParser(html, {
            transform: tagHeaders,
          })}
        </Grid>
      </Grid>
    </>
  );
};
