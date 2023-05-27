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
    // Sort the data in descending order based on percentage (parsed as numbers 1st)
    data.sort((a, b) => {
      const percentageA = parseFloat(a.split(':')[1].trim().split('%')[0]);
      const percentageB = parseFloat(b.split(':')[1].trim().split('%')[0]);
      return percentageB - percentageA;
    });

    const jsonContent = document.getElementById('json-content');

    data.slice(0, 6).forEach(sentence => {
      const parts = sentence.split(':');
      const year = parts[0].trim();
      const details = parts[1].trim();
      const [percentage, restOfSentence] = details.split('%');

      const sentenceElement = document.createElement('p');
      sentenceElement.classList.add('json-sentence');
      const yearElement = document.createElement('span'); 
      const percentageElement = document.createElement('span'); 
      const restOfSentenceElement = document.createElement('span'); 

      yearElement.textContent = year + ': ';
      percentageElement.textContent = percentage.trim() + '% ';
      restOfSentenceElement.textContent = restOfSentence.trim();

      percentageElement.classList.add('emphasis');

      sentenceElement.appendChild(yearElement);
      sentenceElement.appendChild(percentageElement);
      sentenceElement.appendChild(restOfSentenceElement);

      jsonContent.appendChild(sentenceElement);
      jsonContent.appendChild(document.createElement('br'));
    });
  });

const scroll = ScrollReveal(config);
const left = document.querySelectorAll(".text-holder.left");
const right = document.querySelectorAll(".text-holder.right");
const bar = document.getElementById("my_dataviz");

scroll.reveal(left);
scroll.reveal(right);
scroll.reveal(bar, {delay: 3000});