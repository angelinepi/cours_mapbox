// AccesToken
mapboxgl.accessToken = 'pk.eyJ1IjoiYW5nZWxpbmVwaW5pbG8iLCJhIjoiY2xydGhwc3R2MDZlZjJpcGJ5eWlvaTlpYiJ9.VCoDtuIgy-EA-Csfg_2QAA';

// Configuration de la carte
var map = new mapboxgl.Map({
    container: 'map',
    style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', //fond de carte : https://docs.mapbox.com/api/maps/styles/
    //style : 'mapbox://styles/angelinepinilo/clskdxko700d701qudbco6vzh', //mon fond de carte
    center: [-1.68, 48.12], // lat/long
    zoom: 12.5, // modiciation du zoom
    //pitch: 50, // Inclinaison
    //bearing: -10, // Rotation
    customAttribution : '<a href="https://esigat.wordpress.com/" target="_blank">Master SIGAT</a>',
    minZoom: 12, //fixer une limite de dézoom
    maxZoom: 18 //fixer une limite de zoom
});

// Boutons de navigation
var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');

// Ajout Echelle cartographique
map.addControl(new mapboxgl.ScaleControl({
    maxWidth: 120,
    unit: 'metric'}));

// Bouton de géolocalisation
map.addControl(new mapboxgl.GeolocateControl
    ({positionOptions: {enableHighAccuracy: true},
    trackUserLocation: true,
    showUserHeading: true}));

// Ajout Marqueur
const marker1 = new mapboxgl.Marker()
.setLngLat([-1.669099, 48.114799])

// Contenu de la popup du marqueur
var popup = new mapboxgl.Popup({ className: "Mypopup", offset: 25 })
    .setHTML("<h3>Ma première carte Mapbox</h3><p>Trop cool ! <br /> <img src='https://upload.wikimedia.org/wikipedia/commons/3/36/Parc_du_thabor_DSC_4491.JPG' height='100' width='200' /></p>");

// Associer Contenu et Marqueur
marker1.setPopup(popup);

//AJOUTER DES DONNEES
    //map.on = se déclanche quand la carte est chargée
    //pour ajouter une couche : mettre un map.addSource() puis map.addLayer()

map.on('load', function () {

//Données mapbox
    map.addSource('mapbox-streets-v8', {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-streets-v8'});  

    //water
    map.addLayer({
        "id": "Hydro",
        "type": "fill", 
        "source": "mapbox-streets-v8",
        "layout": {'visibility': 'visible'},
        "source-layer": "water",
        "paint": {"fill-color": "#37a8d1"}}); //bien indiquer 'fill-color' pas 'line-color'

    //road      
    map.addLayer({
        "id": "Routes",
        "type": "line", //circle, ou fill
        "source": "mapbox-streets-v8",
        "layout": {'visibility': 'visible'}, //sinon 'none' - par défaut activer ou non la couche
        "source-layer": "road",
        "filter":['==', 'class','trunk'],
        "paint": {"line-color": "#FF7F50", 
                  "line-width": 1}});

    //building          
    map.addLayer({
        "id": "Batiment",
        "type": "fill",
        "source": "mapbox-streets-v8",
        "layout": {'visibility': 'visible'},
        "source-layer": "building",
        "paint": {"fill-color": "#c2c6c8 ", 
                  "fill-opacity":0.8 ,
                  "fill-outline-color": "black"}, //contour des polygones
        "minzoom": 16}); 

//Mes datas hébergées dans mapbox / Organismes Rennes
    map.addSource('OrgaSource', {
        type: 'vector',
        url: 'mapbox://angelinepinilo.7r5q73yc'});
    
    map.addLayer({
        'id': 'Organisme',
        'type': 'circle',
        'source': 'OrgaSource',
        'source-layer': 'base-orga-var-46hzdy', //en haut à gauche dans Tilesets (mapbox)
        'layout': {'visibility': 'visible'},
        'paint': {'circle-radius': {'base': 1.5,'stops': [[13, 2], [22, 30]]}, //gestion de l'échelle d'affichage, symbologie adaptative
                  'circle-color': '#f025d5',
                  'circle-stroke-color':'white',
                  'circle-stroke-width': {'base': 1,'stops': [[12, 0.2], [22, 2]]}}, 
        });

//Données ajoutées depuis une source externe
    //map.addSource('sd-velo', {
        //type: 'geojson',
        //data: 'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/sd_velo_iti_2018/exports/geojson'});
    
    map.addLayer({
        "id": "velo",
        "type": "line", 
        "source": {type: 'geojson',
                   data: 'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/sd_velo_iti_2018/exports/geojson'}, //remplacer 'url' par 'data'},
        "layout": {'visibility': 'visible'},
        "paint": {"line-color": "#48d647", 
                  "line-width": 0.8}
    });
});
//FIN DU MAP.ON()