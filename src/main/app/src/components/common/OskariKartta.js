import React, { useEffect } from 'react';
import OskariRPC from 'oskari-rpc';
import { urls } from 'oph-urls-js';
import { OsoiteParser as op, Localizer as l } from '#/src/tools/Utils';

const MARKER_ID = 'OPPILAITOS';
const ZOOM_LEVEL = 9;

function createChannel() {
  const IFRAME_DOMAIN = urls.url('kartta.base-url');
  const iFrame = document.getElementById('publishedMap');
  const channel = OskariRPC.connect(iFrame, IFRAME_DOMAIN);
  return channel;
}

const OskariKartta = ({ osoite, postitoimipaikka }) => {
  useEffect(() => {
    const channel = createChannel();
    let noHouseNumberSearchDone = false;

    channel.handleEvent('SearchResultEvent', (data) => {
      if (!data?.success) return;
      if (data?.result?.locations?.length > 0) {
        const { lon, lat, name } =
          data?.result?.locations?.find((loc) =>
            [loc?.region?.toLowerCase(), loc?.village?.toLowerCase()].includes(
              postitoimipaikka.toLowerCase()
            )
          ) ?? data.result.locations[0];

        channel.postRequest('MapMoveRequest', [lon, lat, ZOOM_LEVEL]);

        const requestData = {
          x: lon,
          y: lat,
          color: 'ff0000',
          msg: name,
          shape: 2, // icon number (0-6)
          size: 4,
        };
        channel.postRequest('MapModulePlugin.AddMarkerRequest', [requestData, MARKER_ID]);
      } else {
        if (!noHouseNumberSearchDone) {
          const { addressNoNumbers } = op.getSearchAddress(postitoimipaikka, osoite);
          channel.postRequest('SearchRequest', [addressNoNumbers]);
          noHouseNumberSearchDone = true;
        }
      }
    });

    channel.onReady((info) => {
      channel.log('Map is now listening');
      const expectedOskariVersion = '2.1.0';
      if (!info.clientSupported) {
        channel.log(
          `Oskari reported client version (${OskariRPC.VERSION}) is not supported. 
          The client might work, but some features are not compatible.`
        );
      } else {
        if (info.version === expectedOskariVersion) {
          channel.log(
            'Client is supported and Oskari version is ' + expectedOskariVersion
          );
        } else {
          channel.log(
            `Oskari-instance is not the one we expect (${expectedOskariVersion})`
          );
          channel.log('Current Oskari-instance reports version as: ', info);
        }
      }

      if (channel) {
        const { address } = op.getSearchAddress(postitoimipaikka, osoite);
        channel.postRequest('SearchRequest', [address]);
      } else {
        console.error(
          'Odottamaton virhe. Karttapalvelun channel puuttuu',
          urls.url('kartta.base-url')
        );
      }
    });

    return () => {
      channel?.destroy();
    };
  }, [postitoimipaikka, osoite]);

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
