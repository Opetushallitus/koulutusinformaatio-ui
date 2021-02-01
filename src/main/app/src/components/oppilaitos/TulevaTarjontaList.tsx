import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import Spacer from '#/src/components/common/Spacer';
import { TulevaKoulutusCard } from './TulevaKoulutusCard';
import { TulevaTarjontaPagination } from './TulevaTarjontaPagination';
import { educationTypeColorCode } from '#/src/colors';
import { usePaginatedTarjonta } from './hooks';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '100px',
  },
});

type Tarjonta = {
  koulutusName: string;
  koulutusOid: string;
  koulutustyypit: string;
  opintojenlaajuus: string;
  tutkintonimikkeet: string;
  tyyppi: keyof typeof educationTypeColorCode;
};

type Props = {
  oid: string;
  isOppilaitosOsa: boolean;
};

export const TulevaTarjontaList = ({ oid, isOppilaitosOsa }: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const { queryResult } = usePaginatedTarjonta({
    oid,
    isOppilaitosOsa,
    isTuleva: true,
  });

  const { data: tulevaTarjonta = {} } = queryResult;
  const { values, total } = tulevaTarjonta as {
    values: Array<Tarjonta>;
    total: number;
  };

  return values ? (
    <Container maxWidth="lg" className={classes.container}>
      <Typography variant="h2">{t('oppilaitos.tulevat-koulutukset')}</Typography>
      <Spacer />
      <Grid container direction="row" justify="center" alignItems="stretch" spacing={1}>
        {values.map((kts) => (
          <Grid item key={kts.koulutusOid} xs={12} md={4}>
            <LocalizedLink
              underline="none"
              component={RouterLink}
              to={`/koulutus/${kts.koulutusOid}`}>
              <TulevaKoulutusCard
                koulutusName={kts.koulutusName}
                tutkintonimikkeet={kts.tutkintonimikkeet}
                koulutustyypit={kts.koulutustyypit}
                opintojenlaajuus={kts.opintojenlaajuus}
                tyyppi={kts.tyyppi}
              />
            </LocalizedLink>
          </Grid>
        ))}
      </Grid>
      <TulevaTarjontaPagination
        total={total}
        oid={oid}
        isOppilaitosOsa={isOppilaitosOsa}
      />
    </Container>
  ) : null;
};
