import React from 'react';
import Box from '@material-ui/core/Box';
import { observer } from 'mobx-react-lite';
import InfoGrid from '../common/InfoGrid';
import { Typography, Grid } from '@material-ui/core';
import { useStores } from '../../hooks';
import InfoCardGrid from '../common/InfoCardGrid';
import Tree from '../common/Tree';
import Sisalto from './Sisalto';
import { withRouter } from 'react-router-dom';

const uutisHelper = (data, noPics, greenTitle) => {
  const testiTeksti = `Ammatillisia tutkintoja ovat ammatilliset perustutkinnot, ammattitutkinnot ja erikoisammattitutkinnot.  Tässä osiossa kerrotaan yleisesti opinnoista ja tutkinnon suorittamisesta.`;
  if (!data) return;
  return Object.values(data)
    .slice(0, 3)
    .map((e) => ({
      title: e.name,
      text: testiTeksti,
      titleColor: greenTitle ? 'primary' : undefined,
      image: noPics
        ? undefined
        : {
            url:
              'http://images.ctfassets.net/4h0h2z8iv5uv/3p31bFzEUEkxtE2fAT7NQY/f2ebe5602b3890d45afd22a4b0fadc17/Screenshot_2019-10-01_at_10.09.36.png',
            title: 'TODO',
          },
    }));
};

const Module = ({ module }) => {
  const { contentfulStore } = useStores();
  if (module.type === 'infoGrid') {
    const { data, id } = contentfulStore.data.infoGrid[module.id];
    const gridData = data ? JSON.parse(data) : [];
    return <InfoGrid heading="Perustiedot" id={id} gridData={gridData} />;
  } else if (module.type === 'uutiset') {
    const { name, id, showImage, greenText } = contentfulStore.data.uutiset[
      module.id
    ];

    return (
      <InfoCardGrid
        id={id}
        title={name}
        cards={uutisHelper(
          contentfulStore.data.uutinen,
          showImage === 'false',
          greenText === 'true'
        )}
      />
    );
  } else if (module.type === 'puu') {
    const { name, id, left, right } = contentfulStore.data.puu[module.id];
    const { lehti } = contentfulStore.data;

    return (
      <Tree
        id={id}
        title={name}
        cardsLeft={left.map(({ id }) => lehti[id])}
        cardsRight={right.map(({ id }) => lehti[id])}
      />
    );
  } else if (module.type === 'content') {
    const { content } = contentfulStore.data.content[module.id];
    return (
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Sisalto
          content={content}
          alwaysFullWidth={true}
          contentfulStore={contentfulStore}
        />
      </Grid>
    );
  } else {
    return null;
  }
};

const SivuKooste = ({ id }) => {
  const { contentfulStore } = useStores();
  const pageId = id;
  const pads = {
    padding: '25px 90px',
  };
  const kooste = contentfulStore.data.sivuKooste[pageId] || {};

  return (
    <React.Fragment>
      <main id="main-content" className="center-content" style={pads}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h1">{kooste.name}</Typography>

          {(kooste.modules || []).map((module, index) => (
            <Module module={module} key={`module-${index}`} />
          ))}
        </Box>
      </main>
    </React.Fragment>
  );
};

export default withRouter(observer(SivuKooste));
