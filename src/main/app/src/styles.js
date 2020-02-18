import { createStyles } from '@material-ui/core/styles';
import { sideMenuStyles } from './sideMenuStyles';

export const styles = (theme) =>
  createStyles({
    ...sideMenuStyles(theme),
    root: {
      display: 'flex',
    },

    hakuTulosTabIconMargin: {
      marginBottom: '0 !important',
      marginRight: theme.spacing(2),
    },
    hakutulosToggleTabRoot: {
      [theme.breakpoints.between('sm', 'md')]: {
        fontSize: '0.9rem',
      },
      [theme.breakpoints.up('lg')]: {
        fontSize: '1rem',
      },
    },
    customWrapper: {
      flexDirection: 'row',
      textTransform: 'capitalize',
      textAlign: 'left',
    },
    customLabelIcon: {
      minHeight: '50px',
      paddingLeft: 0,
      paddingRight: theme.spacing(3),
    },
    customIconRoot: {
      marginBottom: 0,
    },
    listItemCheckbox: {
      padding: '0 9px 0 9px',
    },
    hakuTulosListItemText: {
      fontSize: 14,
      color: '#4C4C4C',
    },
    buttonSmallText: {
      fontSize: 14,
    },
    eduTypeInnerListPadding: {
      paddingLeft: theme.spacing(2.2),
    },
    paginationRootCurrent: {
      fontWeight: 'bold',
    },
    koulutusKorttiAvatar: {
      borderRadius: 0,
      [theme.breakpoints.up('md')]: {
        width: '80%',
        height: '80%',
      },
      [theme.breakpoints.down('md')]: {
        width: '100%',
        height: '100%',
      },
    },
    oppilaitosKorttiGridSpacingXs1: {
      padding: 0,
    },
    suodattimetExpansionPanelRoot: {
      minWidth: 275,
    },
  });
