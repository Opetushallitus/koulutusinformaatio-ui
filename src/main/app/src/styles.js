import { createStyles } from '@material-ui/core/styles';
import { sideMenuStyles } from './sideMenuStyles';
import { colors } from './colors';

export const styles = (theme) =>
  createStyles({
    ...sideMenuStyles(theme),
    root: {
      display: 'flex',
    },
    // ******************************************************************
    // General
    // ******************************************************************

    // ******************************************************************
    // Hakutulos
    // ******************************************************************
    hakutulosToggleBarMargins: {
      margin: theme.spacing(3, 0, 1, 0),
    },
    hakutulosSisalto: {
      maxWidth: 1600,
      margin: 'auto',
    },
    hakuTulosSortBtn: {
      fontWeight: 600,
    },
    hakuTulosFiltersClearLabel: {
      fontWeight: 600,
      fontSize: 14,
      textDecoration: 'underline',
      whiteSpace: 'nowrap',
    },
    hakuTulosFiltersClearSizeSmall: {
      padding: '1px 5px',
    },
    hakuTulosChipLabel: {
      fontSize: 12,
      fontWeight: 600,
    },
    hakuTulosChipRoot: {
      borderRadius: 5,
      backgroundColor: '#F7F7F7',
      border: 'none',
    },
    hakuTulosTabIconMargin: {
      marginBottom: '0 !important',
      marginRight: theme.spacing(2),
    },
    hakuTulosSisaltoPaperi: {
      width: '100%',
      padding: theme.spacing(1, 11),
      boxShadow: 'none',
    },
    hakuTulosNavText: {
      margin: theme.spacing(5, 0, 7, 0),
    },
    customWrapper: {
      flexDirection: 'row',
      textTransform: 'capitalize',
      textAlign: 'left',
    },
    customLabelIcon: {
      minHeight: '50px',
      paddingLeft: 0,
      paddingRight: theme.spacing(4),
    },
    customIconRoot: {
      marginBottom: 0,
    },
    hakutulosFiltersGrid: {
      padding: theme.spacing(2, 4, 2, 0),
    },
    hakutulosContent: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
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
    hakutulosKortti: {
      width: '100%',
      padding: theme.spacing(3),
      marginBottom: theme.spacing(1.5),
      boxShadow: '0 0 8px 0 rgba(0,0,0,0.2)',
    },
    koulutusKorttiImgBtn: {
      width: 200,
      height: 200,
    },
    koulutusKorttiLeftMargin: {
      marginLeft: '0.5em',
    },
    koulutusKorttiImg: {
      margin: 'auto',
      display: 'block',
      maxWidth: '100%',
      maxHeight: '100%',
    },

    // ******************************************************************
    // AppBar
    // ******************************************************************
    // appBarContent: {
    //   margin: 'auto',
    //   maxWidth: contentWidth,
    //   display: 'flex',
    //   justifyContent: 'space-between'
    // },
    // logo: {
    //   height: 60
    // },
    // expand: {
    //   transform: 'rotate(0deg)',
    //   transition: theme.transitions.create('transform', {
    //     duration: theme.transitions.duration.shortest
    //   })
    // },
    // expandOpen: {
    //   transform: 'rotate(180deg)'
    // },

    // // App bar menu Button
    // menuExpandButton: {
    //   minWidth: 170,
    //   maxWidth: 250,
    //   textOverflow: 'ellipsis',
    //   textTransform: 'capitalize'
    // },

    // Content
    // contentHeader: {
    //   marginTop: theme.spacing.unit,
    //   marginBottom: theme.spacing.unit * 2
    // },
    // contentContainer: {
    //   flexGrow: 1,
    //   width: '100%',
    //   maxWidth: contentWidth,
    //   margin: 'auto',
    //   marginTop: theme.spacing.unit * 4,
    //   marginBottom: theme.spacing.unit * 4,
    //   display: 'flex',
    //   flexDirection: 'column'
    // },
    // content: {
    //   flexGrow: 1,
    //   padding: theme.spacing.unit * 3
    // },
    // divider: {
    //   marginTop: theme.spacing.unit * 2,
    //   marginBottom: theme.spacing.unit * 2
    // },
    // verticalCenter: {
    //   display: 'flex',
    //   justifyContent: 'center',
    //   flexDirection: 'column'
    // },
    // horizontalRight: {
    //   display: 'flex',
    //   flexDirection: 'column',
    //   alignItems: 'flex-end'
    // },
    // panelHeading: {
    //   display: 'flex',
    //   justifyContent: 'center',
    //   flexDirection: 'column',
    //   flexBasis: '95%',
    //   flexShrink: 0
    // },
    // panelText: {
    //   display: 'flex',
    //   justifyContent: 'center',
    //   flexDirection: 'column',
    //   flexBasis: '95%',
    //   flexShrink: 0,
    //   fontSize: 12
    // },
    // iconLeft: {
    //   marginRight: theme.spacing.unit
    // },
    // iconRight: {
    //   marginLeft: theme.spacing.unit
    // },
    // formControl: {
    //   margin: theme.spacing.unit,
    //   minWidth: 160
    // },
    // selectEmpty: {
    //   marginTop: theme.spacing.unit * 2
    // },

    // ******************************************************************
    // Views
    // ******************************************************************

    // Main

    // leftBottomContainer: {
    //   padding: theme.spacing.unit * 3
    // },
    // rightBottomContainer: {
    //   padding: theme.spacing.unit * 3
    // },

    // mainButton: {
    //   textAlign: 'left',
    //   marginTop: theme.spacing.unit,
    //   marginBottom: theme.spacing.unit,
    //   justifyContent: 'space-between',
    //   minHeight: 70,
    //   fontWeight: 'bold',
    //   '& span': {
    //     paddingTop: 1
    //   }
    // },
    // infoButton: {
    //   marginBottom: theme.spacing.unit * 2,
    //   fontSize: 11,
    //   textAlign: 'right'
    // },
    // kiinteistolista: {
    //   flexGrow: 1,
    //   padding: theme.spacing.unit * 3,
    //   marginBottom: theme.spacing.unit * 2
    // },

    // // Liitoskohtalausunto
    // mapSection: {
    //   height: 600
    // },
    // formButton: {
    //   margin: theme.spacing.unit
    // },
    // formControlLabelGrid: {
    //   height: 48,
    //   display: 'flex',
    //   justifyContent: 'center',
    //   flexDirection: 'column'
    // },
    // newMessageButton: {
    //   position: 'absolute',
    //   right: theme.spacing.unit,
    //   top: theme.spacing.unit * 2
    // },
    // readOnlyInputField: {
    //   background: '#FCFCFC',
    //   '& input': {
    //     cursor: 'default',
    //     color: 'rgba(0, 0, 0, 0.87)'
    //   }
    // },
    // readWriteInputField: {
    //   background: '#FFFFFC'
    // },
    // // Kohteet

    // customeListItem: {
    //   paddingLeft: 0
    // }
  });
