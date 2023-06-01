// set configurations for ScrollReveal
// you can modify these to your liking & checkout their documentation to learn more about each feature
const config = {
    delay: 500,
    duration: 500,
    interval: 17,
    opacity: 40,
    origin: "right",
    distance: "150%",
    easing: "ease-out",
    reset: false,
    afterReveal: (domEl) => {
        setTimeout(() => {
            domEl.style.transitionDelay = "500ms"; 
        }, 0);
    }
};

document.addEventListener('DOMContentLoaded', function () {

  const jsonContent = document.getElementById('json-content');

  //grab sentences that we created in crime_category.py from json file
  fetch('data/stat_sentences.json')
    .then(response => response.json())
    .then(data => {

      //iterate through each sentence and split it into its respective parts
      data.forEach(sentence => {
        const parts = sentence.split(' ');
        const count = parts[2];
        const categoryParts = parts.slice(3, parts.length - 2);
        const category = categoryParts.join(' ');

        const sentenceElement = document.createElement('p');
        sentenceElement.classList.add('json-sentence');
        const countElement = document.createElement('span');
        const categoryElement = document.createElement('span');

        //get the count (number) from each sentence and the crime category
        countElement.textContent = count;
        categoryElement.textContent = ' ' + category;

        // create CSS classes so we can style the number, crime category, and rest of sentence seperately 
        countElement.classList.add('emphasis');
        categoryElement.classList.add('emphasis');
        sentenceElement.classList.add('rest-of-sentence');

        //reconstruct the sentence back to one piece to be displayed as a sentence instead of individual parts 
        sentenceElement.appendChild(document.createTextNode('There were '));
        sentenceElement.appendChild(countElement);
        sentenceElement.appendChild(categoryElement);
        sentenceElement.appendChild(document.createTextNode(' in ' + parts[parts.length - 1]));

        //add the complete sentence to our log & insert breaks between each sentence so it's not displayed in a giant chunk
        jsonContent.appendChild(sentenceElement);
        jsonContent.appendChild(document.createElement('br'));
        jsonContent.appendChild(document.createElement('br'));
        jsonContent.appendChild(document.createElement('br'));
      });
    })

    .catch(error => {
      console.log('Error:', error);

  });
});

// create variables for the ScrollReveal effects
const scroll = ScrollReveal(config);
const left = document.querySelectorAll(".text-holder.left");
const graph = document.getElementById("my_dataviz");
const filter = document.querySelectorAll(".input-wrapper");

// use ScrolReveal to show each element in succession as you scroll
scroll.reveal(left, {delay: 1000});
scroll.reveal(graph, {delay: 1500});
scroll.reveal(filter, {delay: 1750});