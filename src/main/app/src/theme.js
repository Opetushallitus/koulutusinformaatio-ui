import { createMuiTheme } from '@material-ui/core/styles';
import { colors } from './colors';

// Material UI theme customization
// Learn more: https://material-ui.com/customization/themes/
export const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.primaryGreen,
    },
    secondary: {
      main: colors.primaryGreen,
    },
    text: {
      primary: colors.primaryTextBlack,
      secondary: colors.primaryTextBlack,
    },
  },
  typography: {
    button: {
      textTransform: 'none',
    },
    fontFamily: ['Open Sans', 'Arial', 'Roboto'],
    h1: {
      fontSize: '2.5rem',
      letterSpacing: '-1.5px',
      fontWeight: 'bold',
      color: colors.black,
      lineHeight: '3rem',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
      color: colors.black,
      lineHeight: '2rem',
    },
    h3: {
      fontWeight: 600,
      color: colors.black,
    },
    h4: {
      color: colors.black,
      fontSize: '1.25rem',
      fontWeight: 'bold',
      lineHeight: '1.7rem',
    },
    subtitle1: {
      fontWeight: 600,
      fontSize: '16px',
      color: colors.black,
    },
  },
  // props: {
  //   MuiGrid: {
  //     spacing: 16
  //   },
  //   MuiPaper: {
  //     elevation: 1,
  //     square: true
  //   },
  //   MuiAppBar: {
  //     elevation: 1
  //   }
  // },
  overrides: {
    MuiAppBar: {
      root: {
        height: 70,
        marginBottom: 30,
        justifyContent: 'center',
        boxShadow:
          '0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 1px 0px rgba(0,0,0,0.1), 0px 2px 1px -1px rgba(0,0,0,0.1)',
      },
    },
    MuiButton: {
      containedPrimary: {
        color: 'white !important',
      },
    },
    MuiFormLabel: {
      root: {
        fontWeight: 'bold',
      },
    },
    MuiOutlinedInput: {
      input: {
        padding: 12,
      },
      multiline: {
        padding: 12,
      },
      adornedEnd: {
        paddingRight: 0,
      },
    },
    MuiTooltip: {
      tooltip: {
        fontSize: 12,
      },
    },
    MuiExpansionPanel: {
      root: {
        backgroundColor: '#FFFFFF',
        marginBottom: '16px',
        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.2)',
        borderRadius: '0 !important',
        '&:before': {
          backgroundColor: '#FFFFFF',
        },
      },

      //   expandIcon: {
      //     color: 'white'
      //   }
      // },
      // MuiExpansionPanelActions: {
      //   root: {
      //     justifyContent: 'center'
      //   }
    },
    MuiExpansionPanelSummary: {
      root: {
        minHeight: '32px !important',
        // border: '1px solid',
      },
      content: {
        margin: '0 !important',
      },
    },
    MuiExpansionPanelDetails: {
      root: {
        // border: '1px solid',
        padding: '0 24px 16px 24px',
      },
    },
    MuiList: {
      padding: {
        paddingTop: 0,
        paddingBottom: 0,
      },
    },
    MuiListItem: {
      dense: {
        paddingTop: 0,
        paddingBottom: 0,
      },
      gutters: {
        paddingRight: '4px',
        paddingLeft: 0,
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: 32,
      },
    },
    MuiButtonBase: {
      root: {
        // paddingTop: '0 !important',
        // paddingBottom: '0 !important'
      },
    },

    MuiListItemText: {
      primary: {
        width: '100%',
      },
    },
    MuiLink: {
      root: {
        cursor: 'pointer',
      },
    },
    MuiCheckbox: {
      colorSecondary: {
        // color: primaryGreen
      },
    },
  },
});
