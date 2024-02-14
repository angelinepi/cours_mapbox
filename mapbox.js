//------------------------------------AccesToken------------------------------------
mapboxgl.accessToken = 'pk.eyJ1IjoiYW5nZWxpbmVwaW5pbG8iLCJhIjoiY2xydGhwc3R2MDZlZjJpcGJ5eWlvaTlpYiJ9.VCoDtuIgy-EA-Csfg_2QAA';

//------------------------------------Configuration de la carte------------------------------------
var map = new mapboxgl.Map({
    container: 'map',
    style: 'https://basemaps.cartocdn.com/gl/voyager-nolabels-gl-style/style.json', //fond de carte : https://docs.mapbox.com/api/maps/styles/, https://deck.gl/docs/api-reference/carto/basemap
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
map.addControl(nav, 'top-right');

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

//------------------------------------Interactivité------------------------------------

//-----HOVER stations vélos star
var popup = new mapboxgl.Popup({
    className: "Mypopup",
    closeButton: false,
    closeOnClick: false });

map.on('mousemove', function(e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['VLS'] }); //layers : c'est l'id dans addLayer()
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

    if (!features.length) {
        popup.remove();
        return; }

    var feature = features[0];
        popup.setLngLat(feature.geometry.coordinates)
        .setHTML('<h6>'+feature.properties.name+'</h6><hr>'+ feature.properties.capacity +' vélos disponibles')
        .addTo(map);

});

//-----Interactivité CLICK Parcs relais

map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['Parcrelais'] });

    if (!features.length) {
        return;
    }

    var feature = features[0];
    var popup = new mapboxgl.Popup({
            className: "Mypopup2",
            offset: [0, -15] })
        .setLngLat(feature.geometry.coordinates)
        .setHTML('<h6>'+feature.properties.name+'</h6><hr>'+ + feature.properties.capacity + ' places disponibles' )  
	    .addTo(map);
});

map.on('mousemove', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['Parcrelais'] });
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
});

//-----Interactivité CLICK sur cadastre (remplissage)

map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['CadastreFill'] });
    if (!features.length) {
        return;
    }

    var feature = features[0];
    var popup3 = new mapboxgl.Popup({ className: "Mypopup2", offset: [0, -15] })
    .setLngLat(e.lngLat)
    .setHTML(feature.properties.id + '<br>' + 'Numéro:' + feature.properties.numero + '<br>' + feature.properties.contenance + '  m2') 
    .addTo(map);
});

map.on('mousemove', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['CadastreFill'] });
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
});

//-----Gestion de l'affichage via MENU
switchlayer = function (lname) {
    if (document.getElementById(lname + "CB").checked) {
        map.setLayoutProperty(lname, 'visibility', 'visible');
    } else {
        map.setLayoutProperty(lname, 'visibility', 'none');
   }
};

// Configuration onglets géographiques 

document.getElementById('Rennes').addEventListener('click', function () 
{ map.flyTo({zoom: 12,
           center: [-1.672, 48.1043],
	          pitch: 0,
            bearing:0 });
});

document.getElementById('Gare').addEventListener('click', function () 
{ map.flyTo({zoom: 16,
           center: [-1.672, 48.1043],
	          pitch: 20,
            bearing: -197.6 });
});


document.getElementById('Rennes1').addEventListener('click', function () 
{ map.flyTo({zoom: 16,
           center: [-1.6396, 48.1186],
	          pitch: 20,
            bearing: -197.6 });
});

document.getElementById('Rennes2').addEventListener('click', function () 
{ map.flyTo({zoom: 16,
           center: [-1.7023, 48.1194],
	          pitch: 30,
            bearing: -197.6 });
});

//------------------------------------FIN INTERACTIVITE----------------------------------//



//------------------------------------AJOUTER DES DONNEES------------------------------------
    //map.on = se déclanche quand la carte est chargée
    //pour ajouter une couche : mettre un map.addSource() puis map.addLayer()

map.on('load', function () {

//-----Source BD BDTOPO - bien uniquement quand la carte est zoomée
    map.addSource('BDTOPO', {
        type: 'vector',
        url: 'https://wxs.ign.fr/topographie/geoportail/tms/1.0.0/BDTOPO/metadata.json'});
     
    //batiments
    map.addLayer({
    'id': 'Bati',
    'type': 'fill',
    'source': 'BDTOPO',
    'source-layer': 'batiment',
    'layout': {'visibility': 'none'},
    'paint': {'fill-color': 'red',
                'fill-opacity': 0.5}
    });

     //routes
     map.addLayer({
        'id': 'Routes2',
        'type': 'line',
        'source': 'BDTOPO',
        'source-layer': 'route_numerotee_ou_nommee',
        'filter':['==', 'type_de_route','Nationale'],
        'layout': {'visibility': 'none'},
        'paint': {'line-color': 'orange',
                    'line-opacity': 0.90}
        });
    
    //hydrographie
    map.addLayer({
        "id": "Hydro2",
        "type": "fill", 
        "source": "BDTOPO",
        "layout": {'visibility': 'none'},
        "source-layer": "surface_hydrographique",
        "paint": {"fill-color": "#37a8d1"}}); //bien indiquer 'fill-color' pas 'line-color'
    

//-----AJOUT DU CADASTRE ETALAB
    map.addSource('Cadastre', {
        type: 'vector',
        url: 'https://openmaptiles.geo.data.gouv.fr/data/cadastre.json'});

    map.addLayer({
    'id': 'Cadastre',
    'type': 'line',
    'source': 'Cadastre',
    'source-layer': 'parcelles',
    'layout': {'visibility': 'none'},
    'paint': {'line-color': '#af5ceb'},
    'minzoom':16, 
    'maxzoom':18}); 		

    map.setPaintProperty('communeslimites', 'line-width', ["interpolate",["exponential",1],["zoom"],16,0.3,18,1]); //symbologie adaptative

    map.addLayer({
        'id': 'CadastreFill',
        'type': 'fill',
        'source': 'Cadastre',
        'source-layer': 'parcelles',
        'layout': {'visibility': 'visible'},
        'paint': {'fill-opacity': 0}});

//-----Données mapbox
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
        "filter": ["all", ["in","class","trunk","primary"]],
        "paint": {"line-width": 1.3,
                "line-color": ['match',['get', 'class'],
                'primary', 'yellow',
                'trunk', 'red',
                '#ccc']} //toujours mettre l’équivalent d’un else, sinon ça ne marche pas
                   });

    //building          
    map.addLayer({
        "id": "Batiment",
        "type": "fill",
        "source": "mapbox-streets-v8",
        "layout": {'visibility': 'none'},
        "source-layer": "building",
        "paint": {"fill-color": "#c2c6c8", 
                  "fill-opacity":0.8 ,
                  "fill-outline-color": "black"}, //contour des polygones
        "minzoom": 16}); 

//-----Mes datas hébergées dans mapbox / Organismes Rennes
    map.addSource('OrgaSource', {
        type: 'vector',
        url: 'mapbox://angelinepinilo.7r5q73yc'});
    
    map.addLayer({
        'id': 'Organisme',
        'type': 'circle',
        'source': 'OrgaSource',
        'source-layer': 'base-orga-var-46hzdy', //en haut à gauche dans Tilesets (mapbox)
        'layout': {'visibility': 'none'},
        'paint': {'circle-radius': {'base': 1.5,'stops': [[13, 2], [22, 30]]}, //gestion de l'échelle d'affichage, symbologie adaptative
                  'circle-color': '#f025d5',
                  'circle-stroke-color':'white',
                  'circle-stroke-width': {'base': 1,'stops': [[12, 0.2], [22, 2]]}}, 
        });

//-----Données ajoutées depuis une source externe
    //map.addSource('sd-velo', {
        //type: 'geojson',
        //data: 'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/sd_velo_iti_2018/exports/geojson'});
    
    //schéma velo
    map.addLayer({
        "id": "velo",
        "type": "line", 
        "source": {type: 'geojson',
                   data: 'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/sd_velo_iti_2018/exports/geojson'}, //remplacer 'url' par 'data'},
        "layout": {'visibility': 'none'},
        "paint": {"line-color": "#48d647", 
                  "line-width": 0.8}
    }); 

    //conso electricite
    map.addLayer({
        "id": "elec",
        "type": "fill", 
        "source": {type: 'geojson',
                   data: 'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/consommation-electrique-annuelle-a-la-maille-commune/exports/geojson?&refine=annee%3A%222022%22&refine=code_grand_secteur%3A%22RESIDENTIEL%22'}, //remplacer 'url' par 'data'},
        "layout": {'visibility': 'none'},
        "paint": {"fill-opacity": 0.9, 
                  "fill-color": {"property": "conso_moyenne_mwh", 'stops': [[1, '#1a9850'], [2, '#91cf60'], [3, '#d9ef8b'], [4, '#ffffbf'], [5, '#fee08b'], [6, '#fc8d59'], [7, '#d73027']]}}
    });

//-----Données externes ajoutées via des API
    //Cadastre
    dataCadastre = 'https://apicarto.ign.fr/api/cadastre/commune?code_insee=35238';
   
    // getJSON permet d’aller chercher des données JSON sur une API 
    jQuery.when( jQuery.getJSON(dataCadastre)).done(function(json) {
    for (i = 0; i < json.features.length; i++) {
        json.features[i].geometry = json.features[i].geometry;
    }; 
        
    map.addLayer(
    {'id': 'Contourcommune',
    'type':'line',
    'source': {'type': 'geojson','data': json},
    'paint' : {'line-color': 'black',
                'line-width':2.5},
    'layout': {'visibility': 'visible'},
    });

    });

    //Un point dans un champ (RPG) --> récupère le contenu
    dataRPG = 'https://apicarto.ign.fr/api/rpg/v2?annee=2021&geom=%7B%22type%22%3A%20%22Point%22%2C%22coordinates%22%3A%5B%20-1.685%2C48.172%5D%7D';
   
    jQuery.when( jQuery.getJSON(dataRPG)).done(function(json) {
    for (i = 0; i < json.features.length; i++) {
      json.features[i].geometry = json.features[i].geometry;
    }; 
       
    map.addLayer(
    { 'id': 'RPG',
      'type':'fill',
      'source': {'type': 'geojson','data': json},
      'paint' : {'fill-color': 'red'},
      'layout': {'visibility': 'none'}
    });

    });

    //Zones naturelles
    dataPLU = 'https://apicarto.ign.fr/api/gpu/zone-urba?partition=DU_243500139';

    jQuery.when(jQuery.getJSON(dataPLU)).done(function(json) {
    // Filtrer les entités pour ne garder que celles avec typezone = 'U'
    var filteredFeatures = json.features.filter(function(feature) 
    {return feature.properties.typezone === 'N';}); //filtre avant de charger les données (plutôt que dans le map.addLayer())

    // Créer un objet GeoJSON avec les entités filtrées
    var filteredGeoJSON = { type: 'FeatureCollection', features: filteredFeatures};

    map.addLayer({
        'id': 'PLU',
        'type': 'fill',
        'source': {'type': 'geojson',
                'data': filteredGeoJSON},
        'layout': {'visibility': 'none'},
        'paint': {'fill-color': 'green',
                'fill-opacity': 0.8},
    });

    });

    //API STAR via API
    
    //Parcs relais - places restantes
    $.getJSON('https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/tco-parcsrelais-star-etat-tr/records?limit=60', 
    
    function(data) {var geojsonParcsRelais = {
                type: 'FeatureCollection', //créer l’emplacement du FeatureCollection
                features: data.results.map(function(element) {
                    return {type: 'Feature',
                            geometry: {type: 'Point',
                            coordinates: [element.coordonnees.lon, element.coordonnees.lat]}, //emplacement des coordonnées
                            properties: { name: element.nom, //ajout de propriétés, et on les renomme ‘name’ et ‘capacity’
                                          capacity: element.jrdinfosoliste}}; //nombre de places restantes
                })
            };
    
    map.addLayer({ 'id': 'Parcrelais',
                  'type':'circle',
                   'source': {'type': 'geojson',
                                    'data': geojsonParcsRelais},
                    'layout': {'visibility': 'none'},
                 'paint': {'circle-color': 'orange',
                            'circle-radius' :13}
    });
    });

    //VLS STAR - places restantes
    $.getJSON('https://data.explore.star.fr/api/explore/v2.1/catalog/datasets/vls-stations-etat-tr/records?limit=60', 
    
    function(data) {var geojsonVLS = {
                type: 'FeatureCollection', //créer l’emplacement du FeatureCollection
                features: data.results.map(function(element) {
                    return {type: 'Feature',
                            geometry: {type: 'Point',
                            coordinates: [element.coordonnees.lon, element.coordonnees.lat]}, //emplacement des coordonnées
                            properties: { name: element.nom, //ajout de propriétés, et on les renomme ‘name’ et ‘capacity’
                                          capacity: element.nombreemplacementsdisponibles}}; //nombre d'emplacements disponibles
                })
            };
    
    map.addLayer({ 'id': 'VLS',
                  'type':'circle',
                   'source': {'type': 'geojson',
                                    'data': geojsonVLS},
                'layout': {'visibility': 'none'},
                'paint': {'circle-color': 'purple',
                           'circle-opacity':0.7,
                           'circle-stroke-color': 'white',
                           'circle-stroke-width': 0.5,
                           'circle-radius': {property: 'capacity',
                                            type: 'exponential',
                                            stops: [[0, 2],[60, 50]]}                
                        }
    });

    });
    
    //Bus en temps réel - uniquement les bus en ligne (etat=En ligne)
    map.addLayer({
        "id": "Bus",
        "type": "circle", 
        "source": {type: 'geojson',
                   data: 'https://data.explore.star.fr/api/explore/v2.1/catalog/datasets/tco-bus-vehicules-position-tr/exports/geojson?refine=etat%3AEn%20ligne '}, //on peut coller des paramètres d'URL d'un appel API derrière un appel de fichier JSON
        "layout": {'visibility': 'none'},
        "paint": {"circle-color": "blue", 
                  "circle-width": 0.5,
                  "circle-stroke-color": 'white'}
    });

    //API OSM - les Bars

    const ville = "Rennes"; //si on change la valeur, le reste se met à jour
  
    $.getJSON(`https://overpass-api.de/api/interpreter?data=[out:json];area[name="${ville}"]->.searchArea;(node["amenity"="bar"](area.searchArea););out center;`, 
            
    function(data) {var geojsonData = {
        type: 'FeatureCollection',
        features: data.elements.map(function(element) {
        return {type: 'Feature',
            geometry: { type: 'Point',coordinates: [element.lon, element.lat] },
            properties: {}};
        })
    };
    
    map.addSource('customData', {
        type: 'geojson',
        data: geojsonData
    });
    
    map.addLayer({
        'id': 'pubs',
        'type': 'circle',
        'source': 'customData',
        'paint': {'circle-color': 'green',
                    'circle-radius': 3},
        'layout': {'visibility': 'none'}
    });
                    
    });

});
//------------------------------------FIN DU MAP.ON()------------------------------------