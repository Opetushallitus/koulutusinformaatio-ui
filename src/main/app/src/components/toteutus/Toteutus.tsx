import React, { useEffect, useMemo, useState } from 'react';

import { Box, Button, Grid, Link, makeStyles, Typography } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import clsx from 'clsx';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

import { getToteutusOsaamisalaKuvaus } from '#/src/api/konfoApi';
import { colors } from '#/src/colors';
import { Accordion } from '#/src/components/common/Accordion';
import HtmlTextBox from '#/src/components/common/HtmlTextBox';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import Murupolku from '#/src/components/common/Murupolku';
import Spacer from '#/src/components/common/Spacer';
import TeemakuvaImage from '#/src/components/common/TeemakuvaImage';
import { useUrlParams } from '#/src/components/hakutulos/UseUrlParams';
import { getHakuParams, getHakuUrl } from '#/src/store/reducers/hakutulosSliceSelector';
import {
  fetchKoulutusWithRelatedData,
  selectKoulutus,
  selectLoading as selectKoulutusLoading,
} from '#/src/store/reducers/koulutusSlice';
import {
  fetchToteutus,
  selectHakukohteet,
  selectLoading as selectToteutusLoading,
  selectToteutus,
} from '#/src/store/reducers/toteutusSlice';
import { getLanguage, localize } from '#/src/tools/localization';
import { getLocalizedOpintojenLaajuus, sanitizedHTMLParser } from '#/src/tools/Utils';
import { Toteutus } from '#/src/types/ToteutusTypes';

import ContentWrapper from '../common/ContentWrapper';
import { TextWithBackground } from '../common/TextWithBackground';
import { useOppilaitokset } from '../oppilaitos/hooks';
import { hasYhteystiedot, Yhteystiedot } from '../oppilaitos/Yhteystiedot';
import { HakuKaynnissaCard } from './HakuKaynnissaCard';
import { ToteutusHakuEiSahkoista } from './ToteutusHakuEiSahkoista';
import { ToteutusHakukohteet } from './ToteutusHakukohteet';
import { ToteutusHakuMuu } from './ToteutusHakuMuu';
import { ToteutusInfoGrid } from './ToteutusInfoGrid';

const useStyles = makeStyles((theme) => ({
  accordion: {
    width: '50%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  root: { marginTop: '100px' },
  img: {
    maxWidth: '150px',
    maxHeight: '120px',
  },
}));

type AccordionProps = {
  titleTranslationKey: string;
  data: React.ComponentProps<typeof Accordion>['items'];
};

const AccordionWithTitle = ({ titleTranslationKey, data }: AccordionProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <Box
      className={clsx([classes.accordion, classes.root])}
      display="flex"
      flexDirection="column"
      alignItems="center">
      <Typography variant="h2">{t(titleTranslationKey)}</Typography>
      <Spacer />
      <Accordion
        items={data}
        ContentWrapper={({ children }) => (
          <Typography component="div">{children}</Typography>
        )}
      />
    </Box>
  );
};

type OsaamisalatProps = {
  ePerusteId: string;
  requestParams: { 'koodi-urit': string };
};

const getOsaamisalatPageData = async ({
  ePerusteId,
  requestParams,
}: OsaamisalatProps) => {
  const osaamisalat: Array<any> = await getToteutusOsaamisalaKuvaus({
    ePerusteId,
    requestParams,
  });
  return { osaamisalat };
};

const useOsaamisalatPageData = ({ ePerusteId, requestParams }: OsaamisalatProps) => {
  return useQuery(
    ['getOsaamisalatPageData', { ePerusteId, requestParams }],
    () => getOsaamisalatPageData({ ePerusteId, requestParams }),
    {
      enabled: !_.isNil(ePerusteId) && !_.isEmpty(requestParams),
    }
  );
};

// NOTE: In most cases there is only one oppilaitos per KOMOTO but there is no limit in data model
const ToteutuksenYhteystiedot = ({ oids }: { oids: Array<string> }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const oppilaitokset = useOppilaitokset({
    isOppilaitosOsa: false,
    oids,
  });
  const filtered = useMemo(
    () =>
      oppilaitokset
        .filter(
          (v) =>
            !_.isEmpty(v.data.metadata?.wwwSivu) ||
            !_.isEmpty(v.data.metadata?.esittely) ||
            hasYhteystiedot(v.data.metadata)
        )
        .map((v) => v.data),
    [oppilaitokset]
  );

  return (
    <>
      {filtered?.length > 0 && (
        <Box
          mt={8}
          width="100%"
          display="flex"
          flexDirection="column"
          alignItems="center">
          {filtered.map((oppilaitos: any) => (
            <React.Fragment key={oppilaitos.oid}>
              <Typography variant="h2">
                {t('oppilaitos.tietoa-oppilaitoksesta')}
              </Typography>
              <Spacer />
              {oppilaitos.metadata.esittely && (
                <Grid
                  item
                  container
                  sm={12}
                  md={6}
                  direction="column"
                  alignItems="center">
                  {oppilaitos.logo && (
                    <img
                      className={classes.img}
                      src={oppilaitos.logo}
                      alt={t('oppilaitos.oppilaitoksen-logo')}
                    />
                  )}
                  <LocalizedHTML data={oppilaitos.metadata.esittely} noMargin />
                </Grid>
              )}

              {oppilaitos.metadata.wwwSivu && (
                <Button
                  style={{
                    marginTop: 20,
                    fontWeight: 600,
                  }}
                  target="_blank"
                  href={localize(oppilaitos.metadata.wwwSivu.url)}
                  variant="contained"
                  size="medium"
                  color="primary">
                  {!_.isEmpty(oppilaitos.metadata.wwwSivu.nimi)
                    ? localize(oppilaitos.metadata.wwwSivu)
                    : t('oppilaitos.oppilaitoksen-www-sivut')}
                  <OpenInNewIcon fontSize="small" />
                </Button>
              )}
              <Yhteystiedot
                id={localize(oppilaitos)}
                key={oppilaitos.oid}
                {...oppilaitos.metadata}
              />
            </React.Fragment>
          ))}
        </Box>
      )}
    </>
  );
};

export const ToteutusPage = () => {
  const classes = useStyles();
  const { oid } = useParams<{ oid: string }>();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const currentLanguage = getLanguage();
  const { isDraft } = useUrlParams();

  // TODO: There is absolutely no error handling atm.
  const toteutus: Toteutus = useSelector(selectToteutus(oid), shallowEqual);
  const koulutusOid = toteutus?.koulutusOid;
  const koulutus = useSelector(selectKoulutus(koulutusOid), shallowEqual);
  const haut = useSelector(selectHakukohteet(oid), shallowEqual);

  const toteutusLoading = useSelector(selectToteutusLoading);
  const [koulutusNotFetched, setKoulutusNotFetched] = useState(!koulutus);
  const koulutusLoading =
    useSelector(selectKoulutusLoading) || (!koulutus && koulutusNotFetched);

  // NOTE: These ammattinimikkeet should be the freely written virkailija asiasana-ammattinimikkeet,
  // not the formal tutkintonimikkeet
  const asiasanat: Array<string> = (toteutus?.metadata?.ammattinimikkeet || [])
    .concat(toteutus?.metadata?.asiasanat || [])
    .filter((asiasana: any) => asiasana.kieli === currentLanguage)
    .map((asiasana: any) => asiasana.arvo);

  const { data: osaamisalaData = {} as any, isFetching } = useOsaamisalatPageData({
    ePerusteId: koulutus?.ePerusteId?.toString(),
    requestParams: {
      'koodi-urit': toteutus?.metadata?.osaamisalat
        ?.map((oa: any) => oa?.koodi?.koodiUri)
        ?.join(','),
    },
  });

  // NOTE: This must *not* handle alemmanKorkeakoulututkinnonOsaamisalat or ylemmanKorkeakoulututkinnonOsaamisalat
  const osaamisalatCombined = toteutus?.metadata?.osaamisalat?.map((toa: any) => {
    const extendedData =
      osaamisalaData?.osaamisalat?.find(
        (koa: any) => toa?.koodi?.koodiUri === koa?.osaamisalakoodiUri
      ) || {};
    const kuvaus = !_.isEmpty(extendedData?.kuvaus)
      ? localize(extendedData?.kuvaus)
      : `<p>${t('toteutus.osaamisalalle-ei-loytynyt-kuvausta')}</p>`;
    return { ...toa, extendedData, kuvaus };
  });

  const loading = koulutusLoading || toteutusLoading || isFetching;

  useEffect(() => {
    if (!toteutus) {
      dispatch(fetchToteutus(oid, isDraft));
    }
    // TODO: Get rid of koulutus call here when opintolaajuus AND tutkintonimikkeet comes from toteutus -backend
    if (!koulutus && koulutusOid && koulutusNotFetched) {
      dispatch(fetchKoulutusWithRelatedData(toteutus.koulutusOid, isDraft));
      setKoulutusNotFetched(false);
    }
  }, [isDraft, toteutus, dispatch, oid, koulutus, koulutusOid, koulutusNotFetched]);

  const opetus = toteutus?.metadata?.opetus;
  const hasAnyHaku = _.some(haut, (v: any) => v.hakukohteet.length > 0);
  const hakuUrl = useSelector(getHakuUrl);
  const { hakuParamsStr } = useSelector(getHakuParams);

  const combinedLisatiedot = useMemo(
    () => [...(koulutus?.lisatiedot || []), ...(opetus?.lisatiedot || [])],
    [koulutus?.lisatiedot, opetus?.lisatiedot]
  );

  return loading ? (
    <LoadingCircle />
  ) : (
    <ContentWrapper>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center">
        <Box width="100%" alignSelf="start">
          <Murupolku
            path={[
              { name: t('haku.otsikko'), link: hakuUrl.url },
              {
                name: localize(koulutus?.tutkintoNimi),
                link: `/koulutus/${toteutus?.koulutusOid}?${hakuParamsStr}`,
              },
              { name: localize(toteutus?.nimi) },
            ]}
          />
        </Box>
        <Typography style={{ marginTop: '20px' }} variant="h1">
          {localize(toteutus?.nimi)}
        </Typography>
        <Grid
          className={classes.root}
          alignItems="center"
          justify="center"
          container
          spacing={1}>
          {asiasanat.map((asiasana, i) => (
            <Grid item key={i}>
              <TextWithBackground>{asiasana}</TextWithBackground>
            </Grid>
          ))}
        </Grid>
        <Box mt={7}>
          <TeemakuvaImage
            imgUrl={toteutus?.teemakuva}
            altText={t('toteutus.toteutuksen-teemakuva')}
          />
        </Box>
        <Box mt={4}>
          <ToteutusInfoGrid
            laajuus={getLocalizedOpintojenLaajuus(koulutus)}
            opetus={opetus}
            hasHaku={hasAnyHaku}
          />
        </Box>
        {toteutus?.hakuAukiType && (
          <HakuKaynnissaCard
            title={
              toteutus.hakuAukiType === 'hakukohde'
                ? t('toteutus.haku-kaynnissa')
                : t('toteutus.ilmoittautuminen-kaynnissa')
            }
            text={
              toteutus.hakuAukiType === 'hakukohde'
                ? t('toteutus.katso-hakukohteet')
                : t('toteutus.katso-ilmoittautumisen-ohjeet')
            }
            link={
              <HashLink
                to="#haut"
                aria-label="anchor"
                smooth
                style={{ textDecoration: 'none' }}
              />
            }
            buttonText={
              toteutus.hakuAukiType === 'hakukohde'
                ? t('toteutus.nayta-hakukohteet')
                : t('toteutus.nayta-ohjeet')
            }
          />
        )}
        {toteutus?.metadata?.kuvaus && (
          <HtmlTextBox
            heading={t('koulutus.kuvaus')}
            html={localize(toteutus.metadata.kuvaus)}
            className={classes.root}
          />
        )}
        {!_.isEmpty(osaamisalatCombined) && (
          <AccordionWithTitle
            titleTranslationKey="koulutus.osaamisalat"
            data={osaamisalatCombined?.map((osaamisala: any) => ({
              title: localize(osaamisala?.koodi),
              content: (
                <>
                  {sanitizedHTMLParser(osaamisala?.kuvaus)}
                  {!_.isEmpty(osaamisala?.linkki) && !_.isEmpty(osaamisala?.otsikko) && (
                    <Link
                      target="_blank"
                      rel="noopener"
                      href={localize(osaamisala?.linkki)}>
                      {localize(osaamisala?.otsikko)}
                      <OpenInNewIcon fontSize="small" />
                    </Link>
                  )}
                </>
              ),
            }))}
          />
        )}
        {hasAnyHaku && <ToteutusHakukohteet haut={haut} />}
        {toteutus?.hasMuuHaku && <ToteutusHakuMuu oid={toteutus?.oid} />}
        {toteutus?.hasEiSahkoistaHaku && <ToteutusHakuEiSahkoista oid={toteutus?.oid} />}
        {combinedLisatiedot.length > 0 && (
          <AccordionWithTitle
            titleTranslationKey="koulutus.lisätietoa"
            data={combinedLisatiedot.map((lisatieto) => ({
              title: localize(lisatieto.otsikko),
              content: sanitizedHTMLParser(localize(lisatieto.teksti)),
            }))}
          />
        )}
        {toteutus?.metadata?.yhteyshenkilot.length > 0 && (
          <Box mt={12} display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h2">{t('toteutus.yhteyshenkilot')}</Typography>
            <Spacer />
            <Box mt={5}>
              <Grid container alignItems="center">
                {toteutus.metadata.yhteyshenkilot.map(
                  (yhteyshenkilo: any, i: number, a: any) => (
                    <React.Fragment key={i}>
                      <Grid item>
                        <Grid container direction="column">
                          <Grid item>
                            <Typography variant="h5">
                              {localize(yhteyshenkilo.nimi)}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="body1">
                              {localize(yhteyshenkilo.titteli)}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="body1">
                              {localize(yhteyshenkilo.sahkoposti)}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="body1">
                              {localize(yhteyshenkilo.puhelinnumero)}
                            </Typography>
                          </Grid>
                          {!_.isEmpty(yhteyshenkilo.wwwSivu) && (
                            <Grid item>
                              <Link
                                target="_blank"
                                rel="noopener"
                                href={localize(yhteyshenkilo.wwwSivu)}
                                variant="body1">
                                <Grid container direction="row" alignItems="center">
                                  {localize(yhteyshenkilo.wwwSivu)}
                                  <OpenInNewIcon
                                    fontSize="small"
                                    style={{ marginLeft: '5px' }}
                                  />
                                </Grid>
                              </Link>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                      {i + 1 !== a.length && (
                        <Grid item>
                          <Box
                            mx={9}
                            style={{ height: '104px' }}
                            borderRight={`1px solid ${colors.lightGrey}`}
                          />
                        </Grid>
                      )}
                    </React.Fragment>
                  )
                )}
              </Grid>
            </Box>
          </Box>
        )}
        {toteutus.oppilaitokset?.length > 0 && (
          <ToteutuksenYhteystiedot oids={toteutus.oppilaitokset} />
        )}
      </Box>
    </ContentWrapper>
  );
};
