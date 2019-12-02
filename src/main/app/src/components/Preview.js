import React from 'react';
import Sisalto from './sivu/Sisalto';

const Preview = ({ id, keywords, parts, contentfulStore }) => {
  var re = new RegExp(keywords.join('|'), 'ig');

  return parts
    .filter((p) => p.match(re))
    .map((p, ind) => (
      <Sisalto
        key={id + '-' + ind}
        contentfulStore={contentfulStore}
        content={p}
        excludeMedia={true}
      />
    ));
};

export default Preview;
