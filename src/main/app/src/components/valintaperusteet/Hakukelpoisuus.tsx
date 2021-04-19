import React from 'react';

import { Box, Divider, Grid, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { toId } from '#/src/tools/Utils';
import { Translateable } from '#/src/types/common';

type Props = {
  hakukelpoisuus: Translateable;
};

export const Hakukelpoisuus = ({ hakukelpoisuus }: Props) => {
  const { t } = useTranslation();

  return (
    <Grid item container direction="column" xs={12}>
      <Box py={4}>
        <Divider />
      </Box>

      <Grid item xs={12}>
        <Typography id={toId(t('valintaperuste.hakukelpoisuus'))} variant="h2">
          {t('valintaperuste.hakukelpoisuus')}
        </Typography>
        <LocalizedHTML data={hakukelpoisuus} />
      </Grid>
    </Grid>
  );
};
