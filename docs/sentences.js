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

  fetch('data/stat_sentences.json')
    .then(response => response.json())
    .then(data => {
      data.forEach(sentence => {
        const parts = sentence.split(' ');
        const count = parts[2];
        const categoryParts = parts.slice(3, parts.length - 3);
        const category = categoryParts.join(' ');

        const sentenceElement = document.createElement('p');
        sentenceElement.classList.add('json-sentence');

        const countElement = document.createElement('span');
        countElement.textContent = count;
        countElement.classList.add('emphasis');

        const categoryElement = document.createElement('span');
        categoryElement.textContent = category;
        categoryElement.classList.add('emphasis');

        const restOfSentenceElement = document.createElement('span');
        restOfSentenceElement.classList.add('rest-of-sentence');
        restOfSentenceElement.textContent = ' ' + parts[parts.length - 3] + ' ' + parts[parts.length - 2] + ' ' + parts[parts.length - 1];

        sentenceElement.appendChild(document.createTextNode('There were '));
        sentenceElement.appendChild(countElement);
        sentenceElement.appendChild(document.createTextNode(' '));
        sentenceElement.appendChild(categoryElement);
        sentenceElement.appendChild(document.createTextNode(restOfSentenceElement.textContent));

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