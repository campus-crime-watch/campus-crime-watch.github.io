function initializeMap() {

    mapboxgl.accessToken = 'pk.eyJ1IjoidHJhY3l6eiIsImEiOiJjbGg1czdiczAyOWJlM2ZwanRxMnVucWc0In0.ZYsCAE_BAM76V1JuJJIGNA'; 
    const map = new mapboxgl.Map({
      container: 'mapbox',
      style: 'mapbox://styles/tracyzz/clh9x0t5q000l01rf5jwtexp4', 
      center: [-122.182, 37.424],
      zoom: 13.7,
      cooperativeGestures: true
    });
     
    const dataSource = 'https://campus-crime-watch.github.io/data/stanford_crime.geojson'
    
    /* map functions - time filter */
    // a start date 
    let pastDate = new Date("April 18, 2023 00:00:00");
    pastDate.setDate(pastDate.getDate() - 30); 
    let startDate = null;
    let endDate = null;
    let isCustomSelected = false;
    
    // CUSTOM initialize date picker
    let datePicker = flatpickr("#dateRangePicker", {
      mode: "range",
      minDate: "2019-01",
      maxDate: "2023-04-30"
    });

    // CUSTOM Hide the date picker and "Apply" button after selection
    document.querySelector('#applyCustomDate').addEventListener('click', function() {
      const selectedDates = datePicker.selectedDates;
        if (selectedDates.length === 2) {
          const startDate = selectedDates[0];
          const endDate = selectedDates[1];
      
          updateMapWithCustomDateRange(startDate, endDate);
          $('.drop-options').hide();
          document.querySelector('#dateRangePicker').style.display = 'none';
          document.querySelector('#applyCustomDate').style.display = 'none';
        }
      // Format the start and end dates to a more readable format
      let formattedStartDate = startDate.toLocaleDateString("en-US");
      let formattedEndDate = endDate.toLocaleDateString("en-US");
    
      // Update button text
      $('#display-button').text(formattedStartDate + ' - ' + formattedEndDate);
      
      !isCustomSelected == false;
    });

    $('.dropdown').hover(
      function() {
        // on mouseenter
        $(this).find('.drop-options').slideDown(150);
      }, 
      function() {
        // on mouseleave
          if (!isCustomSelected) {
            $(this).find('.drop-options').hide();
          }
      }
    );
    
    $('.drop-option').on('click', function () {
      const value = $(this).attr('data-value');
      const text = $(this).text();
      updateMap(value, text);
    });
    
    /* category filter */
    let selectedCategory = null; // global variable that keeps track of category selection
    

    /* fetching data from url; preparing data by jittering & filtering */
    function fetchDataAndRenderMap() {
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

            if (startDate !== null && endDate !== null) {
              data.features  = data.features.filter(feature => {
                  var featureDate = new Date(feature.properties.date);
                  return featureDate >= startDate && featureDate <= endDate; //&& (selectedCategory == null || feature.properties.category == selectedCategory)
              });
            } else if (pastDate !== null) {
              data.features = data.features.filter(feature => {
                var featureDate = new Date(feature.properties.date);
                return featureDate >= pastDate ; //&& (selectedCategory == null || feature.properties.category == selectedCategory)
              });
            }

            // TODO: Further filtering for categories, overwriting data.features as you go

          /* Adding the filtered data points to map */
            map.addSource('su-crimes', {
              type: 'geojson',
              data: data // Your data URL 
            });
    
            map.addLayer({
              id: 'unclustered-point',
              type: 'circle',
              source: 'su-crimes',
              paint: {
              'circle-radius': 5,
              'circle-stroke-width': 1,
              'circle-opacity': 0.7,
              'circle-stroke-color': '#fff',
              'circle-color': [
                'case',
                ['in', 'Theft', ['get', 'category']],
                '#fbb03b',
                ['in', 'Burglary', ['get', 'category']],
                '#8DB600',
                ['in', 'Sexual assault', ['get', 'category']],
                '#e55e5e',
                ['in', 'Drug abuse violations', ['get', 'category']],
                '#4B0082',
                ['in', 'Assault', ['get', 'category']],
                '#223b53',
                ['in', 'Destruction of property', ['get', 'category']],
                '#3bb2d0',
                /* other */ '#fee2e2'
              ]
              }
            });
          });
        }

    /* Updating the map each time a filter is selected */ 
    function updateMap(value, text) {
      pastDate = new Date();

      if (map.getSource('su-crimes')) {
        map.removeLayer('unclustered-point');
        map.removeSource('su-crimes');
      }

      if (value !== "custom") {
        startDate = null;
        endDate = null;
        isCustomSelected = false;
    }

      if (value === "all") {
        pastDate = null;
      } else if (value === "custom") {
          isCustomSelected = true;
          // Show the date picker and "Apply" button
          document.querySelector('#dateRangePicker').style.display = 'block';
          document.querySelector('#applyCustomDate').style.display = 'block';
          datePicker.open();
          return;
      } else if (value === "365") {
        pastDate = new Date(new Date().getFullYear(), 0, 1); 
      } else {
        pastDate = new Date("April 18, 2023 00:00:00");
        pastDate.setDate(pastDate.getDate() - parseInt(value));
      }
    
      // Update selected option text
      $('#selected-option').text(text);
    
      // Update button text
      $('#display-button').text(text);
    
      // Hide options
      if (!isCustomSelected) {
        $('.drop-options').hide();
      }
      
      fetchDataAndRenderMap();
    }  

    // CUSTOM
    function updateMapWithCustomDateRange(start, end) {
      // set global variables
      startDate = start;
      endDate = end;
      
      if (map.getSource('su-crimes')) {
          map.removeLayer('unclustered-point');
          map.removeSource('su-crimes');
      }

      fetchDataAndRenderMap();
    }

    
  /* LEGEND */

    map.on('load', () => {
      fetchDataAndRenderMap();
      const layers =[
        'Theft',
        'Burglary',
        'Sexual assault',
        'Drug abuse violations',
        'Assault',
        'Destruction of property',
        'Others',
      ];

      const colors = [
        '#fbb03b', //theft
        '#8DB600', //Burglary
        '#e55e5e', //Sexual assault
        '#4B0082', //Drug abuse violations
        '#223b53', //Assault
        '#3bb2d0', //Destruction of property
        '#fee2e2', //others
      ];

      const legend = document.getElementById('legend');

      layers.forEach((layer,i) => {
        const color = colors[i];
        const item = document.createElement('div');
        const key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;
      
        const value = document.createElement('span');
        value.innerHTML = `${layer}`;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
        
        // Add an event listener to the item
        // item.addEventListener('click', () => {
        //   selectedCategory = layer;
        //   fetchDataAndRenderMap();
        // });
      });
    });   


  /* POP-UP */

    // an event listener that runs when a user clicks on the map element. */
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: 'custom-popup'
    })

    map.on('mouseenter', 'unclustered-point', (event) => {
        map.getCanvas().style.cursor = 'pointer';
        const features = map.queryRenderedFeatures(event.point, {
            layers: ['unclustered-point']
        });
            if (!features.length) {
                return;
        }
        const feature = features[0];
        
        popup.setLngLat(feature.geometry.coordinates)
        .setHTML(
          `<p> 
            <b>Crime Type</b>: ${feature.properties.category
              // .filter(category => category !== "Non-Clery Act")
              .replace(/["\[\]]/g, '')
            }<br> 
            <b>Description</b>: ${feature.properties.nature.charAt(0).toUpperCase() + feature.properties.nature.slice(1)}<br> 
            <b>On Campus?</b>: ${feature.properties['on_campus?']}<br>
            <b>Date Reported</b>: ${feature.properties.date}<br>
            <b>Case Status</b>: ${feature.properties.disposition}</p>`
        ).addTo(map);
  });
  
    map.on('mouseleave', 'unclustered-point', () => {
      map.getCanvas().style.cursor = '';
      popup.remove();
      });

  };

  

  initializeMap();