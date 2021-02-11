
var fragment = document.createDocumentFragment();
const data = [
  { id: 'web', dataItem: 'web', dataOpen: 'web-1', src: './assets/images/portfolio-1.jpg', cat: 'Web Dev', title: 'Super'},
  { id: 'app', dataItem: 'app', dataOpen: 'app-1', src: './assets/images/portfolio-2.jpg', cat: 'App Dev', title: 'Great'},
  { id: 'ui', dataItem: 'ui', dataOpen: 'ui-1', src: './assets/images/portfolio-3.jpg', cat: 'UI Design', title: 'Rad'},
];

data.forEach((t) => {
  const div = document.createElement('div');
  div.innerHTML = `
    <div id="${t.id}" class="portfolio-card" data-item="${t.dataItem}" data-open="${t.dataOpen}">
      <div class="card-body">
        <img src="${t.src}" alt="portfolio item">
        <div class="card-popup-box">
          <div>${t.cat}</div>
          <h3>${t.title}</h3>
        </div>
      </div>
    </div>
  `;
  fragment.appendChild(div);
});

document.getElementById('portfolio').appendChild(fragment); 



