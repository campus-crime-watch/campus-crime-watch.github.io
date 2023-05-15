function initializeMap() {

    mapboxgl.accessToken = 'pk.eyJ1IjoidHJhY3l6eiIsImEiOiJjbGg1czdiczAyOWJlM2ZwanRxMnVucWc0In0.ZYsCAE_BAM76V1JuJJIGNA'; 
    const map = new mapboxgl.Map({
      container: 'mapbox',
      style: 'mapbox://styles/tracyzz/clh9x0t5q000l01rf5jwtexp4', 
      center: [-122.174, 37.424],
      zoom: 12.62
    });
    

    const dataSource = 'https://campus-crime-watch.github.io/data/stanford_crime.geojson'
    const filterGroup = document.getElementById('filter-group')

    map.on('load', () => {
      map.addSource('su-crimes', {
        type: 'geojson',
        // Use a URL for the value for the `data` property.
        data: dataSource
      });

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
    });

/* an event listener that runs when a user clicks on the map element. */
    map.on('click', (event) => {
  // If the user clicked on one of your markers, get its information.
    const features = map.queryRenderedFeatures(event.point, {
    layers: ['su-crimes-layer'] // replace with your layer name
    });
    if (!features.length) {
        return;
  }
    const feature = features[0];

/* a popup */
  const popup = new mapboxgl.Popup({ offset: [0, -15],className: 'custom-popup' })
  .setLngLat(feature.geometry.coordinates)
  .setHTML(
    `<p> 
      <b>Crime Type</b>: ${feature.properties.nature}<br> 
      <b>Date</b>: ${feature.properties.date}<br>
      <b>Status</b>: ${feature.properties.disposition}</p>`
  )
  .addTo(map);});

  /* cursor change when hover */
  map.on('mouseenter', 'su-crimes-layer', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  
  map.on('mouseleave', 'su-crimes-layer', () => {
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