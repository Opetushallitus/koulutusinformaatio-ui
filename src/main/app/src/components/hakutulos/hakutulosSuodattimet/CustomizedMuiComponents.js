import { withStyles } from '@material-ui/core/styles';
import {
  Checkbox,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ListItemText,
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
    marginBottom: '16px',
    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.2)',
    borderRadius: '0 !important',
    '&:before': {
      backgroundColor: colors.white,
    },
    expandIcon: {
      color: 'white',
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
