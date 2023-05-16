function initializeMap() {

    mapboxgl.accessToken = 'pk.eyJ1IjoidHJhY3l6eiIsImEiOiJjbGg1czdiczAyOWJlM2ZwanRxMnVucWc0In0.ZYsCAE_BAM76V1JuJJIGNA'; 
    const map = new mapboxgl.Map({
      container: 'mapbox',
      style: 'mapbox://styles/tracyzz/clh9x0t5q000l01rf5jwtexp4', 
      center: [-122.182, 37.424],
      zoom: 13
    });
    
    const dataSource = 'https://campus-crime-watch.github.io/data/stanford_crime.geojson'

    map.on('load', () => {
        // Fetch GeoJSON from remote URL
      fetch(dataSource)
        .then(response => response.json())
        .then(data => {
          let jitterAmount = 0.0001;  // adjust this to increase/decrease the jitter
    
          // Apply jitter
          data.features = data.features.map(function(feature) {
            let coords = feature.geometry.coordinates;
        
            // Generate random jitter
            let lonJitter = (Math.random() - 0.5) * jitterAmount;
            let latJitter = (Math.random() - 0.5) * jitterAmount;
        
            // Apply jitter to the point's coordinates
            feature.geometry.coordinates = [coords[0] + lonJitter, coords[1] + latJitter];
        
            return feature;
          });


        map.addSource('su-crimes', {
          type: 'geojson',
          // Use a URL for the value for the `data` property.
          data: data,
          cluster: true,
          clusterMaxZoom: 15,
          clusterRadius: 60
        });

        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'su-crimes',
          filter: ['has', 'point_count'],
          paint: {
          // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 10 px circles when point count is less than 50
          //   * Yellow, 20 px circles when point count is between 50 and 200
          //   * Pink, 30px circles when point count is greater than or equal to 200
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#9AB4D5',
              50,
              '#EEF1BD',
              200,
              '#CA9791'
            ],
            'circle-opacity':0.8,
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              10,
              50,
              20,
              200,
              30
            ]
            }
          });

          map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'su-crimes',
            filter: ['has', 'point_count'],
            layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ["Open Sans Regular","Arial Unicode MS Regular"],
            'text-size': 12
            }
          });

          map.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'su-crimes',
            filter: ['!', ['has', 'point_count']],
            paint: {
            'circle-color': '#fee2e2',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-opacity': 0.7,
            'circle-stroke-color': '#fff'
            }
        });
      });
      /* OLD MAPLAYER W/O CLUSTERING

      map.addLayer({
        'id': 'su-crimes-layer',
        'type': 'circle',
        'source': 'su-crimes',
        'paint': {
        'circle-radius': 4,
        'circle-stroke-width': 1,
        'circle-color': '#fee2e2',
        'circle-opacity':0.7,
        'circle-stroke-color': 'white'
        }
      });
      */
    });

  // inspect a cluster on click
    map.on('click', 'clusters', (e) => {
      const features = map.queryRenderedFeatures(e.point, {
      layers: ['clusters']
      });
      const clusterId = features[0].properties.cluster_id;
      map.getSource('su-crimes').getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
              if (err) return;
       
              map.easeTo({
                  center: features[0].geometry.coordinates,
                  zoom: zoom
              });
          }
      );
    });


// an event listener that runs when a user clicks on the map element. */
  map.on('click', 'unclustered-point', (event) => {
  // If the user clicked on one of your markers, get its information.
    const features = map.queryRenderedFeatures(event.point, {
        layers: ['unclustered-point'] // replace with your layer name
    });
        if (!features.length) {
            return;
    }
    const feature = features[0];
    
    // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    //     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    //   }
  // a popup 
    new mapboxgl.Popup({ offset: [0, -15],className: 'custom-popup' })
    .setLngLat(feature.geometry.coordinates)
    .setHTML(
      `<p> 
        <b>Crime Type</b>: ${feature.properties.nature}<br> 
        <b>Date</b>: ${feature.properties.date}<br>
        <b>Status</b>: ${feature.properties.disposition}</p>`
    )
    .addTo(map);});

  /* cursor change when hover */
  map.on('mouseenter', ['clusters','unclustered-point'], () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  
  map.on('mouseleave', ['clusters','unclustered-point'], () => {
    map.getCanvas().style.cursor = '';
  });
  
}

  /* filter fuction */
  filters: [
  {
    type: 'dropdown',
    title: 'Crime Category: ',
    columnHeader: 'Category',
    listItems: [
      'Theft',
      'Assault',
      'etc',
    ],
  },
  {
    type: 'checkbox',
    title: 'On Campus? ',
    columnHeader: 'on_campus?', // Case sensitive - must match spreadsheet entry
    listItems: ['Yes', 'No'], // Case sensitive - must match spreadsheet entry; This will take up to six inputs but is best used with a maximum of three;
  },
]

function createFilterObject(filterSettings) {
  filterSettings.forEach((filter) => {
    if (filter.type === 'checkbox') {
      const keyValues = {};
      Object.assign(keyValues, {
        header: filter.columnHeader,
        value: filter.listItems,
      });
      checkboxFilters.push(keyValues);
    }
    if (filter.type === 'dropdown') {
      const keyValues = {};
      Object.assign(keyValues, {
        header: filter.columnHeader,
        value: filter.listItems,
      });
      selectFilters.push(keyValues);
    }
  });
}



initializeMap();