import React, { useEffect } from 'react';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import qs from 'query-string';
import { urls } from 'oph-urls-js';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Link as MuiLink, Typography, Box, makeStyles } from '@material-ui/core';
import { Localizer as l, sanitizedHTMLParser } from '#/src/tools/Utils';
import HtmlTextBox from '#/src/components/common/HtmlTextBox';
import ContentWrapper from '#/src/components/common/ContentWrapper';
import Murupolku from '#/src/components/common/Murupolku';
import {
  fetchKoulutusWithRelatedData,
  selectKoulutus,
  selectSuositellutKoulutukset,
  selectLoading,
  selectJarjestajat,
  selectTulevatJarjestajat,
} from '#/src/store/reducers/koulutusSlice';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import TeemakuvaImage from '#/src/components/common/TeemakuvaImage';
import Spacer from '#/src/components/common/Spacer';
import Accordion from '#/src/components/common/Accordion';
import { getHakuUrl } from '#/src/store/reducers/hakutulosSliceSelector';
import SuositusKoulutusList from './SuositusKoulutusList';
import ToteutusList from './ToteutusList';
import TulevaJarjestajaList from './TulevaJarjestajaList';
import KoulutusInfoGrid from './KoulutusInfoGrid';

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
      <Accordion items={data} />
    </Box>
  );
};

const findEperuste = (koulutus) => (id) =>
  _.first(koulutus.eperusteet.filter((e) => e.id === id));

const findTutkinnonOsa = (eperuste) => (id) =>
  _.first(eperuste.tutkinnonOsat.filter((t) => t.id === id));

const Koulutus = (props) => {
  const history = useHistory();
  const { draft } = qs.parse(history.location.search);
  const dispatch = useDispatch();
  const classes = useStyles();
  const { oid } = useParams();
  const { t } = useTranslation();

  // TODO: There is absolutely no error handling atm.
  const koulutus = useSelector(selectKoulutus(oid), shallowEqual);
  const suositellutKoulutukset = useSelector(
    (state) => selectSuositellutKoulutukset(state),
    shallowEqual
  );
  const toteutukset = useSelector(selectJarjestajat(oid));
  const tulevatJarjestajat = useSelector((state) => selectTulevatJarjestajat(state, oid));
  const loading = useSelector((state) => selectLoading(state));

  const hakuUrl = useSelector(getHakuUrl);

  useEffect(() => {
    if (!koulutus) {
      dispatch(fetchKoulutusWithRelatedData(oid, draft));
    }
  }, [dispatch, koulutus, oid, draft]);

  const getKuvausHtmlSection = (captionKey, localizableText) => {
    return localizableText
      ? '<h3>' + t(captionKey) + '</h3>' + l.localize(localizableText)
      : '';
  };

  const createKoulutusHtml = () => {
    if (koulutus?.suorittaneenOsaaminen || koulutus?.tyotehtavatJoissaVoiToimia) {
      return (
        getKuvausHtmlSection(
          'koulutus.suorittaneenOsaaminen',
          koulutus?.suorittaneenOsaaminen
        ) +
        getKuvausHtmlSection(
          'koulutus.tyotehtavatJoissaVoiToimia',
          koulutus?.tyotehtavatJoissaVoiToimia
        )
      );
    } else {
      return l.localize(koulutus?.kuvaus);
    }
  };

  const createTutkinnonOsaHtml = (tutkinnonOsa) => {
    return (
      getKuvausHtmlSection(
        'koulutus.ammattitaitovaatimukset',
        tutkinnonOsa.ammattitaitovaatimukset
      ) +
      getKuvausHtmlSection(
        'koulutus.ammattitaidonOsoitamistavat',
        tutkinnonOsa.ammattitaidonOsoittamistavat
      )
    );
  };

  const koulutusAlat = koulutus?.koulutusAla?.map((ala) => l.localize(ala))?.join(' + ');

  return loading ? (
    <LoadingCircle />
  ) : (
    <ContentWrapper>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box width="100%" alignSelf="start">
          <Murupolku
            path={[
              { name: t('haku.otsikko'), link: hakuUrl.url },
              { name: l.localize(koulutus?.tutkintoNimi) },
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
            {l.localize(koulutus?.tutkintoNimi)}
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
          laajuus={[koulutus?.opintojenLaajuus, koulutus?.opintojenLaajuusYksikkö]}
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
                `${l.localize(nimi)},`,
                l.localize(opintojenLaajuus) || opintojenLaajuusNumero,
                l.localize(opintojenLaajuusyksikko),
              ].join(' ');
              const foundTutkinnonOsa = findTutkinnonOsa(eperuste)(tutkinnonosaId);

              return {
                title,
                content: (
                  <>
                    {sanitizedHTMLParser(createTutkinnonOsaHtml(foundTutkinnonOsa))}
                    <MuiLink
                      target="_blank"
                      rel="noopener"
                      href={urls.url(
                        'eperusteet-service.eperuste.kuvaus',
                        l.getLanguage(),
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
          <ToteutusList toteutukset={toteutukset} />
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
      </Box>
    </ContentWrapper>
  );
};

export default observer(Koulutus);
