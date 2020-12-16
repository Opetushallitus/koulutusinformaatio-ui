import {
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
} from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { Grid, withStyles } from '@material-ui/core';
import { Localizer as l, toId } from '#/src/tools/Utils';
import { colors } from '#/src/colors';
import { LocalizedHTML } from './LocalizedHTML';

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const HeaderCell = withStyles(() => ({
  head: {
    backgroundColor: colors.green,
    color: colors.white,
  },
}))(TableCell);

const SubHeaderCell = withStyles(() => ({
  head: {
    fontWeight: 'bold',
  },
}))(TableCell);

const Headers = ['h1', 'h2', 'h3', 'h4', 'h5'];

const isHeader = (tag) => Headers.includes(tag);

const tagHeaders = (node) => {
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

const Teksti = ({ data }) => (
  <Grid item xs={12} sm={12} md={12}>
    <LocalizedHTML data={data} transform={tagHeaders} />
  </Grid>
);

const Taulukko = ({ data: { rows } }) => {
  const { t } = useTranslation();

  const subTables = rows?.reduce((total, row) => {
    if (row.isHeader || _.isEmpty(total)) {
      total.push({ header: [], body: [] });
    }
    const { header, body } = _.last(total);
    (row.isHeader ? header : body).push(row);
    return total;
  }, []);

  return (
    <TableContainer component={Paper}>
      {subTables.map(({ header, body }, index) => {
        const spanCells = header.map((r) => ({
          ...r,
          columns: r.columns.reduce((total, head) => {
            if (_.isEmpty(total) || !_.isEmpty(l.localize(head?.text))) {
              total.push({ span: 1, ...head });
            } else {
              total[total.length - 1] = {
                span: ++total[total.length - 1].span,
                ..._.last(total),
              };
            }
            return total;
          }, []),
        }));
        const Cell = (props) =>
          index === 0 ? <HeaderCell {...props} /> : <SubHeaderCell {...props} />;

        return (
          <Table
            key={`table-${index}`}
            size="small"
            aria-label={t('valintaperuste.taulukko')}>
            <TableHead>
              {spanCells?.map((row, idx) => (
                <TableRow key={`row-${idx}`}>
                  {row.columns.map((col, idx) => (
                    <Cell key={`cell-${idx}`} align="left" colSpan={col.span}>
                      {l.localize(col?.text)}
                    </Cell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {body?.map((row, idx) => (
                <StyledTableRow key={`row-${idx}`}>
                  {row.columns.map((col, idx) => (
                    <TableCell key={`cell-${idx}`} align="left">
                      {l.localize(col?.text)}
                    </TableCell>
                  ))}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        );
      })}
    </TableContainer>
  );
};

const Sisalto = ({ tyyppi, ...props }, index) => {
  const addKey = (element) => (
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

const Valintatapa = (props, index) => (
  <div key={`valintatapa-${index}`}>
    <Box pb={1}>
      <Typography variant="h2">{l.localize(props?.nimi)}</Typography>
    </Box>
    {props.sisalto.map(Sisalto)}
  </div>
);

export const KuvausSisallysluettelo = (kuvaus) => (Lnk) => {
  const onlyHeaders = (node) => {
    if (isHeader(node.name)) {
      const text = node.children[0].data;
      return Lnk(text);
    } else {
      return null;
    }
  };
  return <LocalizedHTML data={kuvaus} transform={onlyHeaders} />;
};

export const Kuvaus = ({ kuvaus, valintatavat }) => {
  const { t } = useTranslation();

  return (
    <>
      <Grid container spacing={2} justify="flex-start" alignItems="flex-start">
        <Grid item xs={12} sm={12} md={12}>
          <Box py={2}>
            <Typography id={toId(t('valintaperuste.kuvaus'))} variant="h2">
              {t('valintaperuste.kuvaus')}
            </Typography>
          </Box>
          <LocalizedHTML data={kuvaus} transform={tagHeaders} />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          {valintatavat.map(Valintatapa)}
        </Grid>
      </Grid>
    </>
  );
};
