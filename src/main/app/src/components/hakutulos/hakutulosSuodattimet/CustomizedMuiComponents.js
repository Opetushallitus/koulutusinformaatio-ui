import { withStyles } from '@material-ui/core/styles';
import {
  Checkbox,
  Chip,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ListItemText,
  Slider,
} from '@material-ui/core';
import { colors } from '../../../colors';

export const SuodatinCheckbox = withStyles({
  root: {
    padding: '0 9px 0 9px',
  },
})(Checkbox);

export const SuodatinExpansionPanel = withStyles({
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
    '@media (max-width:960px)': {
      margin: '0 !important',
    },
  },
})(ExpansionPanel);

export const SuodatinExpansionPanelSummary = withStyles({
  root: {
    minHeight: '32px !important',
  },
  content: {
    margin: '0 !important',
  },
})(ExpansionPanelSummary);

export const SuodatinExpansionPanelDetails = withStyles({
  root: {
    padding: '0 24px 16px 24px',
  },
})(ExpansionPanelDetails);

export const SuodatinListItemText = withStyles({
  primary: {
    fontSize: 14,
    color: colors.grey,
  },
})(ListItemText);

export const SuodatinMobileChip = withStyles({
  root: {
    borderRadius: 2,
    color: colors.white,
    backgroundColor: colors.green,
    height: 28,
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  label: {
    fontWeight: 600,
  },
})(Chip);

export const SuodatinMobileSlider = withStyles({
  root: {
    width: '100%',
  },
})(Slider);
