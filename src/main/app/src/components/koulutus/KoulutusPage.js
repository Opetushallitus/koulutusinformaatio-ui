import React, { useEffect, useMemo } from 'react';

import { Box, Link as MuiLink, makeStyles, Typography } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import clsx from 'clsx';
import _ from 'lodash';
import { urls } from 'oph-urls-js';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Accordion } from '#/src/components/common/Accordion';
import ContentWrapper from '#/src/components/common/ContentWrapper';
import HtmlTextBox from '#/src/components/common/HtmlTextBox';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import Murupolku from '#/src/components/common/Murupolku';
import Spacer from '#/src/components/common/Spacer';
import TeemakuvaImage from '#/src/components/common/TeemakuvaImage';
import { getHakuUrl } from '#/src/store/reducers/hakutulosSliceSelector';
import {
  fetchKoulutusWithRelatedData,
  selectKoulutus,
  selectLoading,
  selectSuositellutKoulutukset,
  selectTulevatJarjestajat,
} from '#/src/store/reducers/koulutusSlice';
import { getLanguage, localize } from '#/src/tools/localization';
import { getLocalizedOpintojenLaajuus, sanitizedHTMLParser } from '#/src/tools/utils';

import { useUrlParams } from '../hakutulos/UseUrlParams';
import { KoulutusInfoGrid } from './KoulutusInfoGrid';
import SuositusKoulutusList from './SuositusKoulutusList';
import { ToteutusList } from './ToteutusList';
import { TulevaJarjestajaList } from './TulevaJarjestajaList';

const useStyles = makeStyles((theme) => ({
  root: { marginTop: '100px' },
  lisatietoa: { width: '50%' },
  alatText: {
    ...theme.typography.body1,
    fontSize: '1.25rem',
    margin: 'auto',
    textAlign: 'center',
  },
  tutkintoHeader: {
    textAlign: 'center',
  },
  accordion: {
    width: '50%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}));

const AccordionWithTitle = ({ titleTranslation, data }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <Box
      className={clsx([classes.accordion, classes.root])}
      display="flex"
      flexDirection="column"
      alignItems="center">
      <Typography variant="h2">{t(titleTranslation)}</Typography>
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

const findEperuste = (koulutus) => (id) =>
  _.head(koulutus.eperusteet.filter((e) => e.id === id));

const findTutkinnonOsa = (eperuste) => (id) =>
  _.head(eperuste.tutkinnonOsat.filter((t) => t.id === id));

const getKuvausHtmlSection = (t) => (captionKey, localizableText) =>
  localizableText ? '<h3>' + t(captionKey) + '</h3>' + localize(localizableText) : '';

export const KoulutusPage = () => {
  const { isDraft } = useUrlParams();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { oid } = useParams();
  const { t } = useTranslation();
  const getHtmlSection = useMemo(() => getKuvausHtmlSection(t), [t]);

  // TODO: There is absolutely no error handling atm.
  const koulutus = useSelector(selectKoulutus(oid), shallowEqual);
  const suositellutKoulutukset = useSelector(
    (state) => selectSuositellutKoulutukset(state),
    shallowEqual
  );
  const tulevatJarjestajat = useSelector((state) => selectTulevatJarjestajat(state, oid));
  const loading = useSelector((state) => selectLoading(state));

  const hakuUrl = useSelector(getHakuUrl);

  useEffect(() => {
    if (!koulutus) {
      dispatch(fetchKoulutusWithRelatedData(oid, isDraft));
    }
  }, [dispatch, koulutus, oid, isDraft]);

  // NOTE: This uses HtmlTextBox which needs pure html
  const createKoulutusHtml = () =>
    koulutus?.suorittaneenOsaaminen || koulutus?.tyotehtavatJoissaVoiToimia
      ? getHtmlSection(
          'koulutus.suorittaneenOsaaminen',
          koulutus?.suorittaneenOsaaminen
        ) +
        getHtmlSection(
          'koulutus.tyotehtavatJoissaVoiToimia',
          koulutus?.tyotehtavatJoissaVoiToimia
        )
      : localize(koulutus?.kuvaus);

  const createTutkinnonOsa = (tutkinnonOsa) =>
    sanitizedHTMLParser(
      getHtmlSection(
        'koulutus.ammattitaitovaatimukset',
        tutkinnonOsa.ammattitaitovaatimukset
      ) +
        getHtmlSection(
          'koulutus.ammattitaidonOsoitamistavat',
          tutkinnonOsa.ammattitaidonOsoittamistavat
        )
    );

  const koulutusAlat = koulutus?.koulutusAla?.map((ala) => localize(ala))?.join(' + ');

  const soraKuvaus = koulutus?.sorakuvaus;

  return loading ? (
    <LoadingCircle />
  ) : (
    <ContentWrapper>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box width="100%" alignSelf="start">
          <Murupolku
            path={[
              { name: t('haku.otsikko'), link: hakuUrl.url },
              { name: localize(koulutus?.tutkintoNimi) },
            ]}
          />
        </Box>
        <Box mt={4}>
          {koulutusAlat && (
            <Typography className={classes.alatText} variant="h3" component="h1">
              {koulutusAlat}
            </Typography>
          )}
        </Box>
        <Box mt={1}>
          <Typography className={classes.tutkintoHeader} variant="h1" component="h1">
            {localize(koulutus?.tutkintoNimi)}
          </Typography>
        </Box>
        <Box mt={7.5}>
          <TeemakuvaImage
            imgUrl={koulutus?.teemakuva}
            altText={t('koulutus.koulutuksen-teemakuva')}
          />
        </Box>
        <KoulutusInfoGrid
          className={classes.root}
          nimikkeet={koulutus?.tutkintoNimikkeet}
          koulutustyyppi={koulutus?.koulutusTyyppi}
          laajuus={getLocalizedOpintojenLaajuus(koulutus)}
        />
        {(!_.isEmpty(koulutus?.kuvaus) ||
          koulutus?.suorittaneenOsaaminen ||
          koulutus?.tyotehtavatJoissaVoiToimia) && (
          <HtmlTextBox
            heading={t('koulutus.kuvaus')}
            html={createKoulutusHtml()}
            className={classes.root}
          />
        )}
        {koulutus?.tutkinnonOsat ? (
          <AccordionWithTitle
            titleTranslation="koulutus.kuvaus"
            data={koulutus?.tutkinnonOsat.map((tutkinnonOsa) => {
              const {
                tutkinnonosaId,
                tutkinnonosaViite,
                ePerusteId,
                opintojenLaajuus,
                opintojenLaajuusNumero,
                opintojenLaajuusyksikko,
                tutkinnonOsat: nimi,
              } = tutkinnonOsa;
              const eperuste = findEperuste(koulutus)(ePerusteId);
              const title = [
                `${localize(nimi)},`,
                localize(opintojenLaajuus) || opintojenLaajuusNumero,
                localize(opintojenLaajuusyksikko),
              ].join(' ');
              const foundTutkinnonOsa = findTutkinnonOsa(eperuste)(tutkinnonosaId);

              return {
                title,
                content: (
                  <>
                    {createTutkinnonOsa(foundTutkinnonOsa)}
                    <MuiLink
                      target="_blank"
                      rel="noopener"
                      href={urls.url(
                        'eperusteet-service.eperuste.kuvaus',
                        getLanguage(),
                        ePerusteId,
                        tutkinnonosaViite
                      )}>
                      {t('koulutus.eperuste-linkki')}
                      <OpenInNewIcon />
                    </MuiLink>
                  </>
                ),
              };
            })}
          />
        ) : null}
        <Box width="95%" id="tarjonta">
          <ToteutusList oid={oid} />
        </Box>
        {suositellutKoulutukset?.total > 0 && (
          <Box id="suositukset">
            <SuositusKoulutusList koulutukset={suositellutKoulutukset} oid={oid} />
          </Box>
        )}
        {tulevatJarjestajat?.length > 0 && (
          <Box width="95%" id="tulevatJarjestajat">
            <TulevaJarjestajaList jarjestajat={tulevatJarjestajat} />
          </Box>
        )}
        {soraKuvaus && (
          <HtmlTextBox
            heading={t('koulutus.hakijan-terveydentila-ja-toimintakyky')}
            html={localize(soraKuvaus?.metadata?.kuvaus)}
            className={classes.root}
          />
        )}
      </Box>
    </ContentWrapper>
  );
};
