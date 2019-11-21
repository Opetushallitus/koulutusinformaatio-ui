import React from 'react';
import Heading from "./Heading";
import Paragraph from "./Paragraph";
import {Accordion, Summary} from "./Accordion";
import Markdown from "markdown-to-jsx";
import Link from "@material-ui/core/Link";
import Youtube from "./Youtube";
import OpenInNewIcon from "@material-ui/core/SvgIcon/SvgIcon";
import {colors} from "../../colors";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
    notFound: {
        textAlign: "center"
    },
    header1: {
        fontSize: "40px",
        lineHeight: "48px",
        marginTop: "15px",
        marginBottom: "30px",
        fontWeight: "700",
        color: colors.black
    },
    icon: {
        fontSize: "16px"
    },
    image: {
        display: 'block',
        marginBottom: "15px",
    },
    component: {
        paddingTop: "32px",
        "&:last-child": {
            paddingBottom: "32px"
        },
        fontSize: "16px",
        lineHeight: "27px",
        color: colors.grey
    }
});

const Sisalto = ({content, contentfulStore}) => {
    const classes = useStyles();
    const {forwardTo} = contentfulStore;
    const {sivu} = contentfulStore.data;

    const ImageComponent = ({...props, src, alt}) => {
        const url = src.replace("//images.ctfassets.net/", "")
        return <img className={classes.image} src={contentfulStore.assetUrl(url)} alt={alt}/>
    };
    const SivuLink = props => {
        const id = props.children[0];
        return <Link href={forwardTo(id)}>{sivu[id].name}</Link>
    };
    const LinkOrYoutube = ({...props, children, className}) => {
        if(className === "embedly-card") {
            return <Youtube {...props}/>
        } else {
            return <Link target="_blank"
                         rel="noopener"
                         {...props}>
                {children}
                <OpenInNewIcon className={classes.icon}/>
            </Link>
        }
    };
    return <Markdown
        options={{
            overrides: {
                img: {
                    component: ImageComponent
                },
                h1: {
                    component: Heading,
                    props: {
                        level: 1
                    },
                },
                h2: {
                    component: Heading,
                    props: {
                        level: 2
                    },
                },
                h3: {
                    component: Heading,
                    props: {
                        level: 3
                    },
                },
                h4: {
                    component: Heading,
                    props: {
                        level: 4
                    },
                },
                p: {
                    component: Paragraph
                },
                a: {
                    component: LinkOrYoutube
                },
                details: {
                    component: Accordion
                },
                summary: {
                    component: Summary
                },
                sivu: {
                    component: SivuLink
                }
            }
        }}>
        {content}
    </Markdown>
};

export default Sisalto;
