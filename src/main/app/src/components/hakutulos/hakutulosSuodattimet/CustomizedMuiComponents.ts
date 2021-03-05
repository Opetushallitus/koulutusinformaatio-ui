import {
  Checkbox,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItemText,
  Slider,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { colors } from '#/src/colors';

export const SuodatinCheckbox = withStyles({
  root: {
    padding: '0 9px 0 9px',
  },
})(Checkbox);

export const SuodatinAccordion = withStyles({
  root: {
    backgroundColor: colors.white,
    borderRadius: '0 !important',
    '&:before': {
      backgroundColor: colors.white,
    },
    expandIcon: {
      color: 'white',
    },
    '@media (min-width:960px)': {
      marginBottom: '16px',
      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.2)',
    },
  },
  expanded: {
    '@media (max-width:959px)': {
      margin: '0 !important',
    },
  },
})(Accordion);

export const SuodatinAccordionSummary = withStyles({
  root: {
    minHeight: '32px !important',
    '@media (max-width:959px)': {
      padding: '0 !important',
    },
  },
  content: {
    margin: '0 !important',
  },
})(AccordionSummary);

export const SuodatinAccordionDetails = withStyles({
  root: {
    '@media (min-width:960px)': {
      padding: '0 24px 16px 24px',
    },
    '@media (max-width:959px)': {
      padding: '0 !important',
    },
  },
})(AccordionDetails);

export const SuodatinListItemText = withStyles({
  primary: {
    fontSize: 14,
    color: colors.darkGrey,
  },
})(ListItemText);

export const SuodatinMobileChip = withStyles({
  root: {
    borderRadius: 2,
    color: colors.white,
    backgroundColor: colors.brandGreen,
    height: 28,
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  label: {
    fontWeight: 600,
  },
})(Chip);

export const SuodatinMobileSlider = withStyles({
  markLabelActive: {
    color: colors.brandGreen,
    fontWeight: 700,
  },
})(Slider);
