import React from 'react';
import { Typography, Grid, Container, makeStyles } from '@material-ui/core';
import Spacer from '../common/Spacer';
import { Localizer as l } from '../../tools/Utils';
import OppilaitosCard from './OppilaitosCard';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '100px',
  },
});

const localizeArrayToString = (toLocalizeArray) => {
  return toLocalizeArray
    .map((item) => l.localize(item.nimi))
    .sort()
    .join(', ');
};

const TulevaJarjestajaList = (props) => {
  const classes = useStyles();
  const { jarjestajat } = props;
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Typography variant="h3">
        {t('koulutus.muut-koulutusta-jarjestavat-oppilaitokset')}
      </Typography>
      <Spacer />
      <Grid container direction="row" justify="center" spacing={1}>
        {jarjestajat.map((jarjestaja, i) => (
          <OppilaitosCard
            key={i}
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

export default TulevaJarjestajaList;
