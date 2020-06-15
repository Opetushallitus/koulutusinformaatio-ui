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

    channel.handleEvent('SearchResultEvent', function(data) {
      if (data.success && data?.result?.locations?.length > 0) {
        let _location = data.result.locations[0];
        data.result.locations.forEach((loc) => {
          if (
            loc.region.toLowerCase() === postitoimipaikka.toLowerCase() ||
            loc.village.toLowerCase() === postitoimipaikka.toLowerCase()
          ) {
            _location = loc;
          }
        });

        const x = _location.lon;
        const y = _location.lat;
        const name = _location.name;
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

    channel.onReady(function() {
      //channel is now ready and listening.
      channel.log('Map is now listening');
      const expectedOskariVersion = '1.55.2';
      channel.isSupported(expectedOskariVersion, function(blnSupported) {
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
          channel.getInfo(function(oskariInfo) {
            channel.log('Current Oskari-instance reports version as: ', oskariInfo);
          });
        }
      });
      channel.isSupported(function(blnSupported) {
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
