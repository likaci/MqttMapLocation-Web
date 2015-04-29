/**
 * Created by liuwencai on 15/3/29.
 */

var map;
var client;
require(["esri/map", "dojo/domReady!"], function (Map) {
    map = new Map('mapDiv');
    var baseMapLayer = new esri.layers.ArcGISTiledMapServiceLayer("http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer");
    map.addLayer(baseMapLayer);

    client = new Paho.MQTT.Client("broker.mqttdashboard.com", 8000, "Likaci/MqttMap/" + parseInt(Math.random() * 10000));
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({
        timeout: 3,
        keepAliveInterval: 60,
        cleanSession: true,
        useSSL: false,
        onSuccess: onConnectSuccess,
        onFailure: onConnectFail,
        mqttVersion: 3
    })
});

function onMessageArrived(message) {
    console.log("Message " + message.destinationName + message.payloadString);
    try {
        var p = JSON.parse(message.payloadString);
        if (p.id && p.x && p.y) {
            var point = new esri.geometry.Point(p.x, p.y, map.SpatialReference);

            map.graphics.clear();

            map.centerAt(point);

            var symbol = new esri.symbol.PictureMarkerSymbol("pin-user.png", 19, 36);
            map.graphics.add(new esri.Graphic(point, symbol));

            var textSymbol = new esri.symbol.TextSymbol(p.id).setOffset(0, -30).setColor(new esri.Color("#763382"));
            map.graphics.add(new esri.Graphic(point, textSymbol));
        }
    } catch (e) {
        console.log(e);
    }
}

function onConnectSuccess() {
    client.subscribe("Likaci/MqttMap");
}

function onConnectFail() {
}

function onConnectionLost() {
}

