import React from 'react';
import _ from 'lodash';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  withStyles,
  makeStyles,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { formatDateRange, Localizer as l } from '#/src/tools/Utils';
import { isHakuAuki } from '#/src/tools/hakuaikaUtils';
import { colors } from '#/src/colors';
import LocalizedLink from '#/src/components/common/LocalizedLink';

const useStyles = makeStyles({
  card: {
    padding: '30px',
  },
  table: {
    lineHeight: '25px',
    padding: '16px 0',
    '& th': {
      textAlign: 'left',
      paddingRight: '16px',
      verticalAlign: 'top',
      fontWeight: 'normal',
    },
    '& td': {
      fontWeight: 600,
    },
  },
  cardContent: {
    padding: 0,
  },
  cardActions: {
    padding: 0,
  },
});

const StyledBadge = withStyles(() => ({
  badge: {
    right: -75,
    border: `2px solid ${colors.beigeGreen}`,
    backgroundColor: colors.beigeGreen,
    color: colors.black,
    padding: '0 4px',
    borderRadius: '0px',
    whiteSpace: 'nowrap',
  },
}))(Badge);

const parseHakuajat = (hakuajat) =>
  hakuajat.map((h) => [
    new Date(Date.parse(h.alkaa)),
    h.paattyy ? new Date(Date.parse(h.paattyy)) : null,
  ]);

const firstOnGoingDate = (dates, now) => {
  return _.find(dates, ([a, l]) => a <= now && (!l || now <= l));
};

const HakukohdeActionButton = ({ children, ...props }) => {
  return (
    <Button
      variant="contained"
      aria-label={children}
      color="primary"
      target="_blank"
      {...props}>
      {children}
    </Button>
  );
};

const SimpleTable = (props) => {
  const { items = [] } = props;
  const classes = useStyles();
  return (
    <table className={classes.table}>
      <tbody>
        {items.map(
          ({ title, value, hidden }) =>
            !hidden && (
              <tr key={title}>
                <th>
                  {title}
                  {':'}
                </th>
                <td>{value}</td>
              </tr>
            )
        )}
      </tbody>
    </table>
  );
};

const selectPohjakoulutusvaatimus = (hakukohde) => hakukohde?.pohjakoulutusvaatimus?.[0];

export const HakukohdeKortti = ({ haku, hakukohde, paluuLinkki }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const hakuajat = parseHakuajat(haku.hakuajat);
  const now = new Date();
  const hakuaika = firstOnGoingDate(hakuajat, now) || _.first(hakuajat);
  const aloituspaikat = hakukohde.aloituspaikat;
  const ensikertalaisille = hakukohde.ensikertalaisenAloituspaikat;

  const pohjakoulutusvaatimus = selectPohjakoulutusvaatimus(hakukohde);

  const isOpen = isHakuAuki(_.concat(haku.hakuajat, hakukohde.hakuajat));

  return (
    <Card className={classes.card} elevation={2}>
      <CardContent className={classes.cardContent}>
        <Typography variant="h4">
          {l.localize(hakukohde?.nimi)}
          {isOpen && (
            <StyledBadge
              badgeContent={t('valintaperuste.haku-kaynnissa')}
              color="secondary"
            />
          )}
        </Typography>
        <SimpleTable
          items={[
            {
              title: t('valintaperuste.haku'),
              value: l.localize(haku?.nimi),
            },
            {
              title: t('valintaperuste.hakuaika'),
              value: hakuaika ? formatDateRange(hakuaika[0], hakuaika[1]) : '-',
            },
            {
              title: t('valintaperuste.opiskelupaikkoja'),
              value: `${aloituspaikat} ${
                ensikertalaisille
                  ? t('lomake.ensikertalaisille', { ensikertalaisille })
                  : ''
              }`,
              hidden: !aloituspaikat,
            },
            {
              title: t('valintaperuste.pohjakoulutus'),
              value: l.localize(pohjakoulutusvaatimus) || '-',
            },
          ]}
        />
      </CardContent>
      <CardActions className={classes.cardActions}>
        <HakukohdeActionButton
          href={l.localize(hakukohde.hakulomakeLinkki)}
          disabled={!isOpen}>
          {t('lomake.tayta-lomake')}
        </HakukohdeActionButton>
        <LocalizedLink
          component={RouterLink}
          to={paluuLinkki}
          style={{ textDecoration: 'none' }}>
          <HakukohdeActionButton variant="outlined">
            {t('lomake.palaa-esittelyyn')}
          </HakukohdeActionButton>
        </LocalizedLink>
      </CardActions>
    </Card>
  );
};
