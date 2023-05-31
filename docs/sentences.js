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

fetch('data/stat_sentences.json')
  .then(response => response.json())
  .then(data => {
    const jsonContent = document.getElementById('json-content');

    data.forEach(sentence => {
      const parts = sentence.split(' ');
      const count = parts[2];
      const category = parts.slice(3, parts.length - 2).join(' ');

      const sentenceElement = document.createElement('p');
      sentenceElement.classList.add('json-sentence');
      const countElement = document.createElement('span');
      const categoryElement = document.createElement('span');

      countElement.textContent = count;
      categoryElement.textContent = category;

      countElement.classList.add('emphasis');
      categoryElement.classList.add('emphasis');

      sentenceElement.appendChild(document.createTextNode('There were '));
      sentenceElement.appendChild(countElement);
      sentenceElement.appendChild(document.createTextNode(' reported '));
      sentenceElement.appendChild(categoryElement);
      sentenceElement.appendChild(document.createTextNode(' in ' + parts[parts.length - 1] + '.'));

      jsonContent.appendChild(sentenceElement);
      jsonContent.appendChild(document.createElement('br'));
    });
  })
  .catch(error => {
    console.log('Error:', error);
  });
   
const scroll = ScrollReveal(config);
const left = document.querySelectorAll(".text-holder.left");
const sentence = document.querySelectorAll(".json-sentence");
const filter = document.querySelectorAll(".input-wrapper");
const graph = document.getElementById("my_dataviz");

scroll.reveal(left, {delay: 1000});
scroll.reveal(sentence, {delay: 1000});
scroll.reveal(graph, {delay: 1500});
scroll.reveal(filter, {delay: 2000});