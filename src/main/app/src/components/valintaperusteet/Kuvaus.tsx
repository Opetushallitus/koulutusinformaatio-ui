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
import { Localizer as l, toId } from '#/src/tools/Utils';
import { LocalizedHTML } from './LocalizedHTML';

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
  if (isHeader(node.name)) {
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

const Teksti = ({ data }: any) => (
  <Grid item xs={12}>
    <LocalizedHTML data={data} transform={tagHeaders} />
  </Grid>
);

const Taulukko = ({
  data: { rows = [] as Array<{ isHeader: boolean; columns: Array<any> }> },
}) => {
  const { t } = useTranslation();
  const [headerRow, ...restRows] = rows;

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label={t('valintaperuste.taulukko')}>
        <TableHead>
          <StyledTableRow>
            {headerRow?.columns.map((col, index) => (
              <HeaderCell key={`cell-${index}`} align="left" colSpan={col.span}>
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

const Sisalto = ({ tyyppi, ...props }: any, index: number) => {
  const addKey = (element: any) => (
    <Box pb={2} key={`sisalto-${index}`}>
      {element}
    </Box>
  );

  switch (tyyppi) {
    case 'teksti':
      return addKey(Teksti(props));

    case 'taulukko':
      return addKey(Taulukko(props));

    default:
      return null;
  }
};

export const ValintatavatSisallysluettelo = (valintatavat: Array<any>) => (Lnk: any) =>
  !_fp.isEmpty(valintatavat)
    ? valintatavat.map(({ nimi }, index) => Lnk(l.localize(nimi), index + 1, false))
    : null;

const Valintatapa = (props: any, index: number) => (
  <div key={`valintatapa-${index}`}>
    <Box pb={1}>
      <Typography variant="h2" id={`${toId(l.localize(props?.nimi))}`}>
        {l.localize(props?.nimi)}
      </Typography>
    </Box>
    {props.sisalto.map(Sisalto)}
  </div>
);

// NOTE: This parses given kuvaus and returns a list of links to headers found in it
export const KuvausSisallysluettelo = (kuvaus: any) => (Lnk: any) => {
  const onlyHeaders = (node: any) => {
    if (isHeader(node.name)) {
      const text = node.children[0].data;
      return Lnk(text);
    } else {
      return null;
    }
  };

  return _fp.isEmpty(kuvaus) ? null : (
    // NOTE: Dunno why this needs a separate key
    <LocalizedHTML
      noWrapper
      key="kuvaus-sisallysluettelo"
      data={kuvaus}
      transform={onlyHeaders}
    />
  );
};

export const Kuvaus = ({ kuvaus, valintatavat }: any) => {
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
        {valintatavat?.length > 0 && (
          <Grid item xs={12}>
            {valintatavat.map(Valintatapa)}
          </Grid>
        )}
      </Grid>
    </>
  );
};
