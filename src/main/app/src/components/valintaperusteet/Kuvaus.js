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
import { Localizer as l } from '#/src/tools/Utils';
import { first, last, isEmpty } from 'lodash';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { colors } from '#/src/colors';
import Spacer from '#/src/components/common/Spacer';
import ReactHtmlParser from 'react-html-parser';
import hyphenated from '#/src/components/valintaperusteet/hyphenated';

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);
const HeaderCell = withStyles((theme) => ({
  head: {
    backgroundColor: colors.green,
    color: colors.white,
  },
}))(TableCell);
const SubHeaderCell = withStyles((theme) => ({
  head: {
    fontWeight: 'bold',
  },
}))(TableCell);
const Headers = ['h1', 'h2', 'h3', 'h4', 'h5'];
const isHeader = (tag) => Headers.includes(tag);
const tagHeaders = (node) => {
  if (isHeader(node.name)) {
    const text = node.children[0].data;
    const id = hyphenated(text);
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

const Teksti = ({ data }) => {
  const lang = l.getLanguage();
  const html = data[lang] || first(Object.values(data));
  return (
    <Grid item xs={12} sm={12} md={12}>
      {ReactHtmlParser(html, {
        transform: tagHeaders,
      })}
    </Grid>
  );
};
const Taulukko = ({ data: { rows } }) => {
  const { t } = useTranslation();
  const subTables = (rows || []).reduce((total, row) => {
    if (row.isHeader || isEmpty(total)) {
      total.push({ header: [], body: [] });
    }
    const { header, body } = last(total);
    (row.isHeader ? header : body).push(row);
    return total;
  }, []);
  return (
    <TableContainer component={Paper}>
      {subTables.map(({ header, body }, index) => {
        const spanCells = header.map((r) => ({
          ...r,
          columns: r.columns.reduce((total, head) => {
            if (isEmpty(total) || !isEmpty(l.localize(head?.text))) {
              total.push({ span: 1, ...head });
            } else {
              total[total.length - 1] = {
                span: ++total[total.length - 1].span,
                ...last(total),
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
              {(spanCells || []).map((row, idx) => (
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
              {(body || []).map((row, idx) => (
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

const Valintatapa = (props, index) => {
  return (
    <div key={`valintatapa-${index}`}>
      <Box pb={1}>
        <Typography variant="h2">{l.localize(props?.nimi)}</Typography>
      </Box>
      {props.sisalto.map(Sisalto)}
    </div>
  );
};

export const KuvausSisallysluettelo = (kuvaus) => (Lnk) => {
  const onlyHeaders = (node) => {
    if (isHeader(node.name)) {
      const text = node.children[0].data;
      return Lnk(text);
    } else {
      return null;
    }
  };
  const lang = l.getLanguage();
  const html = kuvaus[lang] || first(Object.values(kuvaus));
  return ReactHtmlParser(html, {
    transform: onlyHeaders,
  });
};

const Kuvaus = ({ kuvaus, valintatavat }) => {
  const { t } = useTranslation();
  const lang = l.getLanguage();
  const html = kuvaus[lang] || first(Object.values(kuvaus));

  return (
    <>
      <Grid container spacing={2} justify="flex-start" alignItems="flex-start">
        <Grid item xs={12} sm={12} md={12}>
          <Box py={2}>
            <Typography id={hyphenated(t('valintaperuste.kuvaus'))} variant="h1">
              {t('valintaperuste.kuvaus')}
            </Typography>
            <Spacer />
          </Box>
          {ReactHtmlParser(html, {
            transform: tagHeaders,
          })}
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          {valintatavat.map(Valintatapa)}
        </Grid>
      </Grid>
    </>
  );
};

export default Kuvaus;
