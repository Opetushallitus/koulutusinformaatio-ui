import React, { Component } from 'react';
import { OsoiteParser as op } from '../../tools/Utils'
import OskariRPC from 'oskari-rpc';

class OskariKartta extends Component {

    constructor(props) {
        super(props);
        this.state = {
            osoitetieto: [op.getCoreAddress(props.osoite), props.postitoimipaikka],
            mapinfo: OskariKartta.selectMapBasedOnLocation(),
            channel: undefined
        };
    }

    componentDidMount() {
        if(this.state.osoitetieto[0] && this.state.osoitetieto[1] && this.state.mapinfo) {
            this.setMapLocation(this.state.osoitetieto);
        } else if (!this.state.mapinfo) {
            console.log("Oskari-karttapalvelua ei ilmeisesti ole konfiguroitu tähän ympäristöön.")
        }
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        this.setState({
            osoitetieto: [op.getCoreAddress(this.props.osoite), this.props.postitoimipaikka]
        }, () => {
            const data = this.state.osoitetieto[0];
            console.log("Triggering map location search for " + data);
            this.state.channel.postRequest('SearchRequest', data);
        });
    }

    shouldComponentUpdate() {
        return true;
    }

    static selectMapBasedOnLocation() {
        const location = window.location.href;
        if(location.indexOf('localhost') !== -1 ) {
            return ['https://hkp.maanmittauslaitos.fi', '277da693-ae10-4508-bc5a-d6ced2056fd0'];
        } else if (location.indexOf('hahtuvaopintopolku') !== -1 ) {
            return ['https://hkp.maanmittauslaitos.fi', '74aff82d-7c67-40ba-bd3f-893c8bdb4daa'];
        }
        return null;
    }


    setMapLocation(osoitetieto) {
        console.log("Set map location: " +osoitetieto +", mapinfo: "+ this.state.mapinfo);
        const IFRAME_DOMAIN = this.state.mapinfo[0];
        const iFrame = document.getElementById('publishedMap');
        const channel = OskariRPC.connect(
            iFrame,
            IFRAME_DOMAIN);

        this.setState({channel: channel})

        channel.handleEvent(
            'SearchResultEvent',
            function(data) {
                //console.log('DATA: ' + JSON.stringify(data));
                if(data.success) {
                    //console.log('data.result.locations.length: ' + data.result.locations.length);
                    if(data.result && data.result.locations && data.result.locations.length > 0) {
                        let location = data.result.locations[0];
                        data.result.locations.forEach(loc => {
                            if(loc.region.toLowerCase() === osoitetieto[1].toLowerCase() || loc.village.toLowerCase() === osoitetieto[1].toLowerCase()) {
                                location = loc;
                            }
                        });

                        const x = location.lon;
                        const y = location.lat;
                        const name = location.name;
                        const zoomLevel = 9;

                        channel.postRequest(
                            'MapMoveRequest', [x, y, zoomLevel]
                        );

                        const MARKER_ID = 'OPPILAITOS';
                        const requestData = {
                            x: x,
                            y: y,
                            color: 'ff0000',
                            msg : name,
                            shape: 2, // icon number (0-6)
                            size: 4
                        };
                        channel.postRequest('MapModulePlugin.AddMarkerRequest', [requestData, MARKER_ID]);
                    }
                }
            }
        );

        channel.onReady(function() {
            //channel is now ready and listening.
            channel.log('Map is now listening');
            const expectedOskariVersion = '1.44.3';
            channel.isSupported(expectedOskariVersion, function(blnSupported) {
                if(blnSupported) {
                    channel.log('Client is supported and Oskari version is ' + expectedOskariVersion);
                } else {
                    channel.log('Oskari-instance is not the one we expect (' + expectedOskariVersion + ') or client not supported');
                    // getInfo can be used to get the current Oskari version
                    channel.getInfo(function(oskariInfo) {
                        channel.log('Current Oskari-instance reports version as: ', oskariInfo);
                    });
                }
            });
            channel.isSupported(function(blnSupported) {
                if(!blnSupported) {
                    channel.log('Oskari reported client version (' + OskariRPC.VERSION + ') is not supported.' +
                        'The client might work, but some features are not compatible.');
                } else {
                    channel.log('Client is supported by Oskari.');
                }
            });

            const data = osoitetieto[0];
            console.log("Triggering map location search for " + data);
            channel.postRequest('SearchRequest', data);

        });
    }

    render() {
        var kartta = <div/>
        if(this.state.mapinfo && this.state.mapinfo.length > 1) {
            kartta = <div><iframe title="kartta" id='publishedMap' src={"https://hkp.maanmittauslaitos.fi/hkp/published/fi/"+this.state.mapinfo[1]}/></div>
        } else {
            console.log("Oskari-karttapalvelua ei saada käyttöön...");
            console.log(this.state.mapinfo);
        }
        return (<React.Fragment>{kartta}</React.Fragment>);
    }
}

export default OskariKartta;