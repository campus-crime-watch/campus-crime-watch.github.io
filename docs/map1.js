function initializeMap1() {

  mapboxgl.accessToken = 'pk.eyJ1IjoidHJhY3l6eiIsImEiOiJjbGg1czdiczAyOWJlM2ZwanRxMnVucWc0In0.ZYsCAE_BAM76V1JuJJIGNA'; 
  window.map1 = new mapboxgl.Map({
    container: 'mapbox1',
    style: 'mapbox://styles/tracyzz/clh9x0t5q000l01rf5jwtexp4', 
    center: [-122.182, 37.424],
    zoom: 13,
    cooperativeGestures: true
  });
   
  const dataSource = 'https://campus-crime-watch.github.io/data/stanford_crime.geojson'
  const filterGroup = document.getElementById('filter-group');


  map1.on('load', () => {
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
      
        

        map1.addSource('su-crimes', {
          type: 'geojson',
          // Use a URL for the value for the `data` property.
          data: data,
          cluster: true,
          clusterMaxZoom: 15,
          clusterRadius: 60
        });


        map1.addLayer({
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
            'circle-opacity':0.9,
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

          map1.addLayer({
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

          map1.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'su-crimes',
            filter: ['!', ['has', 'point_count']],
            paint: {
            'circle-color': '#fee2e2',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-opacity': 0.9,
            'circle-stroke-color': '#fff'
            }
        });
        
        // this function will be called whenever a checkbox is toggled
          const updateLayerFilter = () => {
            const checkedSymbols = [...document.getElementsByTagName('input')]
                .filter((el) => el.checked)
                .map((el) => el.id);
            
            // use an 'in' expression to filter the layer
            if (checkedSymbols.length > 0) {
              map1.setFilter('unclustered-point', ['in', ['to-string',['get','year']], ['literal', checkedSymbols]]);
              map1.setFilter('cluster-count', ['in', ['to-string', ['get', 'year']], ['literal', checkedSymbols]]);
            } else {
              map1.setFilter('unclustered-point', ['!=', ['get','year'], '']);
              map1.setFilter('cluster-count', ['!=', ['get', 'year'], '']);

            }
          }
          
          // get an array of all unique `year` properties
          const symbols = [];
 
          for (const feature of data.features) {
              const symbol = String(feature.properties.year);
              if (!symbols.includes(symbol)) symbols.push(symbol);
          }

          // for each `year` value, create a checkbox and label
          for (const symbol of symbols) {
              const input = document.createElement('input');
              input.type = 'checkbox';
              input.id = symbol;
              input.checked = true;
              filterGroup.appendChild(input);
             
              const label = document.createElement('label');
              label.setAttribute('for', symbol);
              label.textContent = symbol;
              filterGroup.appendChild(label);

              // When any checkbox changes, update the filter.
              input.addEventListener('change', updateLayerFilter);
          }
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
  map1.on('click', 'clusters', (e) => {
    const features = map1.queryRenderedFeatures(e.point, {
    layers: ['clusters']
    });
    const clusterId = features[0].properties.cluster_id;
    map1.getSource('su-crimes').getClusterExpansionZoom(
        clusterId,
        (err, zoom) => {
            if (err) return;
      
            map1.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom
            });
        }
    );
  });


// an event listener that runs when a user clicks on the map element. */
  map1.on('click', 'unclustered-point', (event) => {
  // If the user clicked on one of your markers, get its information.
    const features = map1.queryRenderedFeatures(event.point, {
        layers: ['unclustered-point'] // replace with your layer name
    });
        if (!features.length) {
            return;
    }
    const feature = features[0];
    
  // a popup 
    new mapboxgl.Popup({ offset: [0, -15],className: 'custom-popup' })
    .setLngLat(feature.geometry.coordinates)
    .setHTML(
      `<p> 
        <b>Crime Type</b>: ${feature.properties.category.replace(/["\[\]]/g, '')}<br> 
        <b>Description</b>: ${feature.properties.nature.charAt(0).toUpperCase() + feature.properties.nature.slice(1)}<br> 
        <b>On Campus?</b>: ${feature.properties['on_campus?']}<br>
        <b>Date</b>: ${feature.properties.date}<br>
        <b>Status</b>: ${feature.properties.disposition}</p>`
    )
    .addTo(map1);});

  /* cursor change when hover */
  map1.on('mouseenter', ['clusters','unclustered-point'], () => {
    map1.getCanvas().style.cursor = 'pointer';
  });
  
  map1.on('mouseleave', ['clusters','unclustered-point'], () => {
    map1.getCanvas().style.cursor = '';
  });



}



  /* filter fuction AAAAAND LATER */
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



initializeMap1();