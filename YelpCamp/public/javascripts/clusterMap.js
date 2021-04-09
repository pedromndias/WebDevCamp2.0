// In this file we will code the map for the index page

// Set the map token by using mapToken from index.ejs:
mapboxgl.accessToken = mapToken;
// Create our map:
const map = new mapboxgl.Map({
    container: 'cluster-map', // Find the map called "cluster-map", it's in our index.ejs
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-103.59179687498357, 40.66995747013945],
    zoom: 3
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// "on load" map event:
map.on('load', function () {
    /* Add a new source from the GeoJSON data and set the 'cluster' option to true. GL-JS will
    add the point_count property to our source data. */
    map.addSource('campgrounds', { // This "campgrounds" is a label that should be used when adding layers.
        type: 'geojson',
        // Point to GeoJSON data, which will be our variable "campgrounds" from index.ejs:
        data: campgrounds,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });
    // Let's add a layer to represent circles of clustered campgrounds:
    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'campgrounds',
        filter: ['has', 'point_count'],
        paint: {
            // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles (depending on the number of cmpgrounds):
            //   * Blue, 20px circles when point count is less than 10
            //   * Yellow, 30px circles when point count is between 10 and 30
            //   * Pink, 40px circles when point count is greater than or equal to 30
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#00BCD4',
                10,
                '#2196F3',
                30,
                '#3F51B5'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                15, // pixel width
                10, // step
                20, // pixel width
                30, // step
                25 // pixel width
            ]
        }
    });
    // Add a new layer to see how many campgrounds are grouped together in a cluster:
    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'campgrounds',
        filter: ['has', 'point_count'],
        layout: {
            // Let's reference the cumulative point count for a single cluster:
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });

    // Add another layer for when we have an unclustered-point:
    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'campgrounds',
        // Display a smaller dot when there's no point_count:
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });

    // Logic for when we click on a cluster:
    map.on('click', 'clusters', function (e) {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        // Zoom that area where cluster was clicked:
        const clusterId = features[0].properties.cluster_id;
        map.getSource('campgrounds').getClusterExpansionZoom(
            clusterId,
            function (err, zoom) {
                if (err) return;

                map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                });
            }
        );
    });

    // Logic for when we click on an unclustered-point:
    /* When a click event occurs on a feature in the unclustered-point layer, open a popup at
    the location of the feature, with description HTML from its properties: */
    map.on('click', 'unclustered-point', function (e) {
        /* Mapbox will automatically look for key called properties when we click a campground in the map.
        We can destructure it to get popUpMarker: */
        const { popUpMarker} = e.features[0].properties;
        const coordinates = e.features[0].geometry.coordinates.slice();
            

        /* Ensure that if the map is zoomed out such that multiple copies of the feature are 
        visible, the popup appears over the copy being pointed to: */
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Create a popup:
        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(
                // This is what will be shown as text on the popup:
                popUpMarker // variable created above when destrucuring "properties"
            )
            .addTo(map);
    });

    // Event for when the mouse enters over a cluster, style the curser as "pointer":
    map.on('mouseenter', 'clusters', function () {
        map.getCanvas().style.cursor = 'pointer';
    });
    // Event for when the mouse leaves a cluster, style the curser as regular:
    map.on('mouseleave', 'clusters', function () {
        map.getCanvas().style.cursor = '';
    });
});