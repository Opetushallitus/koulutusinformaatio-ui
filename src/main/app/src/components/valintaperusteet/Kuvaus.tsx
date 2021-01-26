import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  withStyles,
} from '@material-ui/core';
import _fp from 'lodash/fp';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { colors } from '#/src/colors';
import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { Localizer as l, toId } from '#/src/tools/Utils';
import {
  Sisalto,
  SisaltoTaulukko,
  SisaltoTeksti,
  Valintatapa,
} from './ValintaperusteTypes';
import { Translateable } from '#/src/types/common';

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const HeaderCell = withStyles(() => ({
  head: {
    backgroundColor: colors.brandGreen,
    color: colors.white,
    fontWeight: 'bold',
  },
}))(TableCell);

const SubHeaderCell = withStyles(() => ({
  body: {
    fontWeight: 'bold',
  },
}))(TableCell);

const Headers = ['h1', 'h2', 'h3', 'h4', 'h5'];

const isHeader = (tag: string) => Headers.includes(tag);

// TODO: What is node here?
const tagHeaders = (node: any) => {
  if (isHeader(node.name) && node.children[0]?.data) {
    const text = node.children[0].data;
    const id = toId(text);
    const isH1 = 'h1' === node.name;
    return (
      <Box pt={isH1 ? 0.5 : 0} key={id}>
        <Typography id={id} variant={node.name}>
          {text}
        </Typography>
      </Box>
    );
  }
};

const Teksti = ({ data }: SisaltoTeksti) => (
  <Grid item xs={12}>
    <LocalizedHTML data={data} transform={tagHeaders} />
  </Grid>
);

const Taulukko = ({ data: { rows } }: SisaltoTaulukko) => {
  const { t } = useTranslation();
  const [headerRow, ...restRows] = rows;

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label={t('valintaperuste.taulukko')}>
        <TableHead>
          <StyledTableRow>
            {headerRow?.columns.map((col, index) => (
              <HeaderCell key={`cell-${index}`} align="left">
                {l.localize(col?.text)}
              </HeaderCell>
            ))}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {restRows.map(({ isHeader, columns }, index) => {
            const Cell = isHeader ? SubHeaderCell : TableCell;
            return (
              <StyledTableRow key={`row-${index}`}>
                {columns.map((col, idx) => (
                  <Cell key={`cell-${idx}`} align="left">
                    {l.localize(col?.text)}
                  </Cell>
                ))}
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const SisaltoComponent = ({ tyyppi, ...props }: Sisalto[0], index: number) => {
  const addKey = (element: any) => (
    <Box pb={2} key={`sisalto-${index}`}>
      {element}
    </Box>
  );

  switch (tyyppi) {
    case 'teksti':
      return addKey(Teksti(props as SisaltoTeksti));

    case 'taulukko':
      return addKey(Taulukko(props as SisaltoTaulukko));

    default:
      return null;
  }
};

export const ValintatavatSisallysluettelo = (valintatavat: Array<Valintatapa>) => (
  Lnk: any
) =>
  !_fp.isEmpty(valintatavat)
    ? valintatavat.map(({ nimi, sisalto }, index) =>
        // Link to title and links to sisalto subtitles given in HTML-string
        [
          Lnk(l.localize(nimi), index + 1, false),
          ...sisalto.map((s, i) =>
            s.tyyppi === 'teksti'
              ? KuvausSisallysluettelo(
                  s.data,
                  `${toId(l.localize(nimi))}-teksti-${i}`
                )(Lnk)
              : null
          ),
        ]
      )
    : null;

const ValintatapaComponent = ({ nimi, sisalto }: Valintatapa, index: number) => (
  <div key={`valintatapa-${index}`}>
    <Box pb={1}>
      <Typography variant="h2" id={`${toId(l.localize(nimi))}`}>
        {l.localize(nimi)}
      </Typography>
    </Box>
    {sisalto.map(SisaltoComponent)}
  </div>
);

// NOTE: This parses any given kuvaus and returns a list of links to headers found in it
export const KuvausSisallysluettelo = (kuvaus: Translateable, key: string) => (
  Lnk: any
) => {
  const onlyHeaders = (node: any) => {
    if (isHeader(node.name) && node.children[0]?.data) {
      const text = node.children[0].data;
      return Lnk(text);
    } else {
      return null;
    }
  };

  return _fp.isEmpty(kuvaus) ? null : (
    // NOTE: Dunno why this needs a separate key
    <LocalizedHTML noWrapper key={key} data={kuvaus} transform={onlyHeaders} />
  );
};

type Props = {
  kuvaus: Translateable;
  sisalto: Sisalto;
  valintatavat: Array<Valintatapa>;
};

export const Kuvaus = ({ kuvaus, sisalto = [], valintatavat }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Grid container spacing={2} justify="flex-start" alignItems="flex-start">
        {!_fp.isEmpty(kuvaus) && (
          <Grid item xs={12}>
            <Typography id={toId(t('valintaperuste.kuvaus'))} variant="h2">
              {t('valintaperuste.kuvaus')}
            </Typography>
            <LocalizedHTML data={kuvaus} transform={tagHeaders} />
          </Grid>
        )}
        {sisalto?.length > 0 && (
          <Grid item xs={12}>
            {sisalto.map(SisaltoComponent)}
          </Grid>
        )}
        {valintatavat?.length > 0 && (
          <Grid item xs={12}>
            {valintatavat.map(ValintatapaComponent)}
          </Grid>
        )}
      </Grid>
    </>
  );
};
