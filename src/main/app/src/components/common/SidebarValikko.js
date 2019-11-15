import React, { Component } from 'react';
import { withRouter} from 'react-router-dom';
import { colors } from '../../colors';
import {withStyles} from "@material-ui/core";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

const valikkoStyles = theme => ({
    root: {
        color: colors.green,
        marginLeft: "20px",
    },
    valikko: {
        paddingTop: "0",
        paddingBottom: "0",
        borderTopStyle: "solid",
        borderWidth: "1px",
        borderColor: colors.lightGrey,
        color: colors.grey,
        "&:last-child": {
            borderBottomStyle: "solid",
            marginBottom: "40px"
        }
    },
    otsikko: {
        paddingTop: "0",
        paddingBottom: "0",
        color: colors.green
    },
    parentOtsikko: {
        paddingTop: "0",
        paddingBottom: "0"
    },
    parentOtsikkoIconBase: {
        backgroundColor: colors.green,
        padding: "13px",
        marginRight: "10px"

    },
    parentOtsikkoIcon: {
        color: colors.white
    },
    otsikkoText: {
        textTransform: "uppercase",
        fontSize: "12px",
    },
    valintaText: {
        marginTop: "9px",
        marginBottom: "9px",
    },
    valintaIconBase: {
        borderLeftWidth: "1px",
        borderLeftStyle: "solid",
        borderColor: colors.lightGrey,
        padding: "12px"

    },
    valintaIcon: {
        color: colors.green
    }
});

class SidebarValikko extends Component {

    render() {
        const { classes, parent, select, deselect, match } = this.props;

        const ListItemLink = (props) => {
            return <ListItem button component="a" {...props} />;
        };
        const forwardToPage = (url) => {
            this.props.history.push(url);
        };
        const SivuItem = (props) => {
            const {name,id} = props;
            const link = `${match.url}sivu/${id}`;
            return <ListItemLink role="none"
                                 onClick={() => forwardToPage(link)}
                                 className={classes.valikko}>
                <ListItemText role="menuitem"
                              className={classes.valintaText}
                              tabIndex="0"
                              aria-label={name}>{name}</ListItemText>
            </ListItemLink>;
        };
        const ValikkoItem = (props) => {
            const {name,id} = props;
            return <ListItemLink role="none" className={classes.valikko} onClick={() => select(id)}>
                <ListItemText className={classes.valintaText} role="menuitem" tabIndex="0" aria-label={name} >{name}</ListItemText>
                <ListItemIcon className={classes.valintaIconBase}>
                    <ChevronRightIcon className={classes.valintaIcon} />
                </ListItemIcon>
            </ListItemLink>;
        };
        const OtsikkoItem = (props) => {
            const {name} = props;
            return <ListItemLink role="none" className={classes.otsikko}>
                <ListItemText role="menuitem"
                              className={classes.otsikkoText}
                              variant="menu"
                              typography="menu"
                              tabIndex="0"
                              aria-label={name}>{name}</ListItemText>

            </ListItemLink>;
        };

        return (
            <List className={classes.root} aria-label="contacts">
                {parent ?
                    <ListItemLink className={classes.parentOtsikko}
                                  role="none"
                                  onClick={deselect}>
                        <ListItemIcon className={classes.parentOtsikkoIconBase}>
                            <ChevronLeftIcon className={classes.parentOtsikkoIcon}/>
                        </ListItemIcon>
                        <ListItemText role="menuitem"
                                      tabIndex="0"
                                      aria-label={parent.name}>{parent.name}</ListItemText>
                    </ListItemLink> : null}
                <OtsikkoItem key={this.props.name} name={this.props.name} id={this.props.id}/>
                {
                    this.props.links.map((i) => {
                        if(i.type === 'sivu') {
                            return <SivuItem key={i.name} name={i.name} id={i.id}/>
                        } else {
                            return <ValikkoItem key={i.name} name={i.name} id={i.id}/>
                        }
                    })
                }
            </List>
        )
    }
}

export default withRouter(withStyles(valikkoStyles, { withTheme: true })(SidebarValikko));