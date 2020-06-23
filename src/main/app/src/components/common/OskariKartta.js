import React, { useEffect, useCallback } from 'react';
import { OsoiteParser as op, Localizer as l } from '#/src/tools/Utils';
import { urls } from 'oph-urls-js';
import OskariRPC from 'oskari-rpc';

const OskariKartta = ({ osoite, postitoimipaikka }) => {
  function createChannel() {
    const IFRAME_DOMAIN = urls.url('kartta.base-url');
    const iFrame = document.getElementById('publishedMap');
    const channel = OskariRPC.connect(iFrame, IFRAME_DOMAIN);
    return channel;
  }

  const initMap = useCallback(() => {
    const channel = createChannel();

    channel.handleEvent('SearchResultEvent', (data) => {
      if (data.success && data?.result?.locations?.length > 0) {
        const { lon, lat, name } =
          data?.locations?.find(
            (loc) => postitoimipaikka.toLowerCase() in [loc.region, loc.village]
          ) ?? data.result.locations[0];

        const x = lon;
        const y = lat;
        const zoomLevel = 9;

        channel.postRequest('MapMoveRequest', [x, y, zoomLevel]);

        const MARKER_ID = 'OPPILAITOS';
        const requestData = {
          x: x,
          y: y,
          color: 'ff0000',
          msg: name,
          shape: 2, // icon number (0-6)
          size: 4,
        };
        channel.postRequest('MapModulePlugin.AddMarkerRequest', [requestData, MARKER_ID]);
      }
    });

    channel.onReady(() => {
      //channel is now ready and listening.
      channel.log('Map is now listening');
      const expectedOskariVersion = '1.55.2';
      channel.isSupported(expectedOskariVersion, (blnSupported) => {
        if (blnSupported) {
          channel.log(
            'Client is supported and Oskari version is ' + expectedOskariVersion
          );
        } else {
          channel.log(
            'Oskari-instance is not the one we expect (' +
              expectedOskariVersion +
              ') or client not supported'
          );
          // getInfo can be used to get the current Oskari version
          channel.getInfo((oskariInfo) => {
            channel.log('Current Oskari-instance reports version as: ', oskariInfo);
          });
        }
      });
      channel.isSupported((blnSupported) => {
        if (!blnSupported) {
          channel.log(
            'Oskari reported client version (' +
              OskariRPC.VERSION +
              ') is not supported.' +
              'The client might work, but some features are not compatible.'
          );
        } else {
          channel.log('Client is supported by Oskari.');
        }
      });
      // setLocation(channel);
      const data = op.getCoreAddress(osoite);
      console.log('Triggering map location search for ' + data);
      if (channel) {
        channel.postRequest('SearchRequest', data);
      } else {
        console.log(
          'Odottamaton virhe. Karttapalvelun channel puuttuu ' +
            urls.url('kartta.base-url')
        );
      }
    });
  }, [postitoimipaikka, osoite]);

  useEffect(() => {
    initMap();
  }, [osoite, postitoimipaikka, initMap]);

  return (
    <iframe
      title="kartta"
      id="publishedMap"
      style={{ border: 'none', width: '100%', height: '100%' }}
      src={urls.url('kartta.publish-url', l.getLanguage())}
    />
  );
};

export default OskariKartta;
