import React, { Component } from 'react';
import { OsoiteParser as op, Localizer as l } from '../../tools/Utils';
import OskariRPC from 'oskari-rpc';
import { observer, inject } from 'mobx-react';
import '../../assets/styles/components/_oskari-kartta.scss';

@inject('urlStore')
@observer
class OskariKartta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channel: undefined,
    };
  }

  componentDidMount() {
    this.initMap();
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    this.setLocation();
  }

  setLocation() {
    const data = op.getCoreAddress(this.props.osoite);
    console.log('Triggering map location search for ' + data);
    if (this.state.channel) {
      this.state.channel.postRequest('SearchRequest', data);
    } else {
      console.log(
        'Odottamaton virhe. Karttapalvelun channel puuttuu ' +
          this.props.urlStore.urls.url('kartta.base-url')
      );
    }
  }

  createChannel() {
    const IFRAME_DOMAIN = this.props.urlStore.urls.url('kartta.base-url');
    const iFrame = document.getElementById('publishedMap');
    const channel = OskariRPC.connect(iFrame, IFRAME_DOMAIN);
    this.setState({ channel: channel });
    return channel;
  }

  initMap() {
    const channel = this.createChannel();
    const _this = this;

    channel.handleEvent('SearchResultEvent', function(data) {
      if (
        data.success &&
        data.result &&
        data.result.locations &&
        data.result.locations.length > 0
      ) {
        let location = data.result.locations[0];
        data.result.locations.forEach((loc) => {
          if (
            loc.region.toLowerCase() ===
              _this.props.postitoimipaikka.toLowerCase() ||
            loc.village.toLowerCase() ===
              _this.props.postitoimipaikka.toLowerCase()
          ) {
            location = loc;
          }
        });

        const x = location.lon;
        const y = location.lat;
        const name = location.name;
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
        channel.postRequest('MapModulePlugin.AddMarkerRequest', [
          requestData,
          MARKER_ID,
        ]);
      }
    });

    channel.onReady(function() {
      //channel is now ready and listening.
      channel.log('Map is now listening');
      const expectedOskariVersion = '1.44.3';
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
            channel.log(
              'Current Oskari-instance reports version as: ',
              oskariInfo
            );
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
      _this.setLocation();
    });
  }

  render() {
    return (
      <div className="iframe-container">
        <iframe
          title="kartta"
          id="publishedMap"
          src={this.props.urlStore.urls.url(
            'kartta.publish-url',
            l.getLanguage()
          )}
        />
      </div>
    );
  }
}

export default OskariKartta;
