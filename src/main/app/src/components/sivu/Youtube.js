import React from 'react';
import parse from "url-parse";

const Youtube = ({...props, href}) => {
    const url = parse(href, true);
    return <iframe title={props.url}
                   width="560" height="315"
                   style={{display: "block", margin: "10px 0px"}}
                   src={`https://www.youtube.com/embed${
                       (url.query.v && '/'+url.query.v) || url.pathname}`}
                   frameBorder="0"
                   allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                   allowFullScreen={true}/>;
};

export default Youtube;
