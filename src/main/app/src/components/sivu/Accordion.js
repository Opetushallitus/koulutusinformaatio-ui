import React from 'react';
import {makeStyles, withStyles} from "@material-ui/core";
import {colors} from "../../colors";
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


const ExpansionPanel = withStyles({
    root: {
        border: "none",
        backgroundColor: "transparent",
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiExpansionPanel);

const useStyles = makeStyles({
    footer: {
        backgroundColor: colors.white,
        lineHeight: "21px"
    }
});


const Accordion = ({...props, summary, text}) => {
    const classes = useStyles();
    return <ExpansionPanel elevation={0}>
        <ExpansionPanelSummary
            elevation={0}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
        >
            <Typography>{summary}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails
            elevation={0}>
            <Typography>
                {text}
            </Typography>
        </ExpansionPanelDetails>
    </ExpansionPanel>
};

export default Accordion;
