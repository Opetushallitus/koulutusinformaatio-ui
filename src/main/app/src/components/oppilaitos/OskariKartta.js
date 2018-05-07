import React, { Component } from 'react';
import OskariRPC from '../../tools/rpc-client/rpc-client';
import { OsoiteParser as op } from '../../tools/Utils'

class OskariKartta extends Component {

    constructor(props) {
        super(props);
        this.state = {
            result: undefined,
            osoitetieto: [op.getCoreAddress(props.osoite), props.postitoimipaikka]
        };
        console.log("Created component OskariKartta");
    }

    componentDidMount() {
        console.log("did mount");
        this.setMapLocation(this.state.osoitetieto);
    }

    shouldComponentUpdate() {
        //return false;
    }

    setMapLocation(osoitetieto) {
        console.log("Set map location: " +osoitetieto);
        var IFRAME_DOMAIN = "https://hkp.maanmittauslaitos.fi";
        var iFrame = document.getElementById('publishedMap');
        var channel = OskariRPC.connect(
            iFrame,
            IFRAME_DOMAIN);

        channel.handleEvent(
            'SearchResultEvent',
            function(data) {
                console.log('DATA: ' + JSON.stringify(data));
                if(data.success) {
                    console.log('data.result.locations.length: ' + data.result.locations.length);
                    if(data.result && data.result.locations && data.result.locations.length > 0) {
                        var location = data.result.locations[0];
                        data.result.locations.map(loc => {
                            console.log("LOC: %O", loc);
                            if(loc.region.toLowerCase() === osoitetieto[1].toLowerCase() || loc.village.toLowerCase() === osoitetieto[1].toLowerCase()) {
                                location = loc;
                            }
                        });

                        var x = location.lon;
                        var y = location.lat;
                        var name = location.name;
                        var zoomLevel = 9;

                        channel.postRequest(
                            'MapMoveRequest', [x, y, zoomLevel]
                        );

                        var MARKER_ID = 'OPPILAITOS';
                        var data = {
                            x: x,
                            y: y,
                            color: 'ff0000',
                            msg : name,
                            shape: 2, // icon number (0-6)
                            size: 4
                        };
                        channel.postRequest('MapModulePlugin.AddMarkerRequest', [data, MARKER_ID]);
                    }
                }
            }
        );

        channel.onReady(function() {
            //channel is now ready and listening.
            channel.log('Map is now listening');
            var expectedOskariVersion = '1.44.3';
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

            //var data = ['Kaisaniemenkatu 2, Helsinki'];
            var data = osoitetieto[0];
            console.log("Triggering search!" + data);
            channel.postRequest('SearchRequest', data);
            //console.log("searchResult: " + searchResult);

        });
    }

    render() {
        console.log("Render Kartta");
        return (
            <React.Fragment>
                <div>
                <iframe id='publishedMap'
                    src="https://hkp.maanmittauslaitos.fi/hkp/published/fi/277da693-ae10-4508-bc5a-d6ced2056fd0"></iframe>
                </div>
            </React.Fragment>
        );
    }
}

export default OskariKartta;