import "/node_modules/scrollreveal/dist/scrollreveal.js";

const config = {
    delay: 500,
    duration: 500,
    interval: 17,
    opacity: 40,
    origin: "right",
    distance: "150%",
    easing: "ease-out",
    reset: true,
    afterReveal: (domEl) => {
        setTimeout(() => {
            domEl.style.transitionDelay = "500ms"; 
        }, 0);
    }
};

fetch('stat_sentences.json')
    .then(response => response.json())
    .then(data => {
        const jsonContent = document.getElementById('json-content');

        data.forEach(sentence => {
            const parts = sentence.split(':');
            const year = parts[0].trim();
            const details = parts[1].trim();
            const [percentage, restOfSentence] = details.split('%');

            const sentenceElement = document.createElement('p');
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
        });
    });

const scroll = ScrollReveal(config);
const left = document.querySelectorAll(".text-holder.left");
const right = document.querySelectorAll(".text-holder.right");
const emphasis = document.getElementsByClassName("emphasis");
const bar = document.getElementById("histogram");

scroll.reveal(left);
scroll.reveal(emphasis, {delay: 1000});
scroll.reveal(restOfSentenceElement, {delay: 2000});
scroll.reveal(right);
scroll.reveal(bar, {delay: 3000});
scroll.reveal(line, {delay: 4000});