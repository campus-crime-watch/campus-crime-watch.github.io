function initializeMap2() {

    mapboxgl.accessToken = 'pk.eyJ1IjoidHJhY3l6eiIsImEiOiJjbGg1czdiczAyOWJlM2ZwanRxMnVucWc0In0.ZYsCAE_BAM76V1JuJJIGNA'; 
    window.map2 = new mapboxgl.Map({
      container: 'mapbox2',
      style: 'mapbox://styles/tracyzz/clh9x0t5q000l01rf5jwtexp4', 
      center: [-122.182, 37.424],
      zoom: 13,
      cooperativeGestures: true
    });
     
    const dataSource = 'https://campus-crime-watch.github.io/data/stanford_crime.geojson'
  
    const filterGroup = document.getElementById('filter-group');
  
    map2.on('load', () => {
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
        
          
  
          map2.addSource('su-crimes', {
            type: 'geojson',
            // Use a URL for the value for the `data` property.
            data: data
          });
  
            map2.addLayer({
              id: 'unclustered-point',
              type: 'circle',
              source: 'su-crimes',
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
                map2.setFilter('unclustered-point', ['in', ['to-string',['get','year']], ['literal', checkedSymbols]]);
              } else {
                map2.setFilter('unclustered-point', ['in', ['to-string', ['get', 'year']], ['literal', []]]);
            }
            }
            
            // get an array of all unique `year` properties
            const symbols = [];
   
            for (const feature of data.features) {
                const symbol = String(feature.properties.year);
                if (!symbols.includes(symbol)) symbols.push(symbol);
            }
            
            while (filterGroup.firstChild) {
                filterGroup.firstChild.remove();
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
  
  
  
  // an event listener that runs when a user clicks on the map element. */
    map2.on('click', 'unclustered-point', (event) => {
    // If the user clicked on one of your markers, get its information.
      const features = map2.queryRenderedFeatures(event.point, {
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
      .addTo(map2);});
  
    /* cursor change when hover */
    map2.on('mouseenter', ['clusters','unclustered-point'], () => {
      map2.getCanvas().style.cursor = 'pointer';
    });
    
    map2.on('mouseleave', ['clusters','unclustered-point'], () => {
      map2.getCanvas().style.cursor = '';
    });
  
  
  
  }
  
  
  
    /* filter fuction AAAAAND LATER 
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
  */
  
  
  initializeMap2();