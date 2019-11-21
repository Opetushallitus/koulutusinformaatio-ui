import {colors} from "./colors";

export const drawerWidth = 330;

export const sideMenuStyles = theme => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: 0,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    smDrawer: {
        width: "100%",
        flexShrink: 0,
    },
    smDrawerPaper: {
        width: "100%",
    },
    smContent: {
        flexGrow: 1,
        padding: 0,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: "-100%",
    },
    smContentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    inputBackground: {
        backgroundColor: colors.sideInputBackground,
        paddingLeft: "20px",
        paddingTop: "91px",
        paddingBottom: "20px",
    },
    murupolku: {
        paddingLeft: "20px",

    },
    inputRoot: {
        height: "35px",
        display: 'flex',
        alignItems: 'center',
        borderRadius: 0,
        width: 290,
    },
    input: {
        borderRadius: 0,
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        minWidth: "40px",
        maxWidth: "40px",
        borderRadius: 0,
    },
    divider: {
        height: 28,
        margin: 4,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    }
});

