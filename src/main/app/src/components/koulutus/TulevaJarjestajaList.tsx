import React from 'react';

import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import Spacer from '#/src/components/common/Spacer';
import { Localizer as l } from '#/src/tools/Utils';
import { Koodi } from '#/src/types/common';
import { Jarjestaja } from '#/src/types/ToteutusTypes';

import { OppilaitosCard } from './OppilaitosCard';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '100px',
  },
});

const localizeArrayToString = (toLocalizeArray: Array<Koodi>) =>
  toLocalizeArray.map(l.localize).sort().join(', ');

type Props = {
  jarjestajat: Array<Jarjestaja>;
};

export const TulevaJarjestajaList = ({ jarjestajat }: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Typography variant="h3">
        {t('koulutus.muut-koulutusta-jarjestavat-oppilaitokset')}
      </Typography>
      <Spacer />
      <Grid container direction="row" justify="center" spacing={2}>
        {jarjestajat.map((jarjestaja) => (
          <OppilaitosCard
            key={jarjestaja.oppilaitosOid}
            heading={l.localize(jarjestaja.nimi)}
            locations={localizeArrayToString(jarjestaja.kunnat)}
            tyyppi={jarjestaja.koulutustyyppi}
            oppilaitosOid={jarjestaja.oppilaitosOid}
            image={jarjestaja.kuva}
          />
        ))}
      </Grid>
    </Container>
  );
};
