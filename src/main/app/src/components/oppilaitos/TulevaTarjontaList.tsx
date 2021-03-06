import React from 'react';

import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { educationTypeColorCode } from '#/src/colors';
import {
  LoadingCircle,
  OverlayLoadingCircle,
} from '#/src/components/common/LoadingCircle';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import Spacer from '#/src/components/common/Spacer';

import { usePaginatedTarjonta } from './hooks';
import { TulevaKoulutusCard } from './TulevaKoulutusCard';
import { TulevaTarjontaPagination } from './TulevaTarjontaPagination';

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

  const { data: tulevaTarjonta = {}, isFetching, status } = queryResult;
  const { values, total } = tulevaTarjonta as {
    values: Array<Tarjonta>;
    total: number;
  };

  switch (status) {
    case 'loading':
      return <LoadingCircle />;
    case 'success':
      return _.isEmpty(values) ? null : (
        <Container maxWidth="lg" className={classes.container}>
          <Typography variant="h2">{t('oppilaitos.tulevat-koulutukset')}</Typography>
          <Spacer />
          <div style={{ position: 'relative' }}>
            <OverlayLoadingCircle isLoading={isFetching} />
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="stretch"
              spacing={1}>
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
          </div>
          <TulevaTarjontaPagination
            total={total}
            oid={oid}
            isOppilaitosOsa={isOppilaitosOsa}
          />
        </Container>
      );
    default:
      return null;
  }
};
