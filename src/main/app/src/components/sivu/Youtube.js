import React from 'react';
import parse from "url-parse";

const Youtube = (props) => {
    const url = parse(props.url, true);
    return <iframe title={props.url}
                   width="560" height="315"
                   style={{display: "block", margin: "10px 0px"}}
                   src={`https://www.youtube.com/embed/${url.query.v}`}
                   frameBorder="0"
                   allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                   allowFullScreen={true}/>;
};

export default Youtube;
