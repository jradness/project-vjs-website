const toggleTheme = document.querySelector('.theme-tab');
const switcher = document.querySelectorAll('.switcher-btn');
const currentTheme = localStorage.getItem('theme');

const filterLink = document.querySelectorAll('[data-filter]');
const portfolioItems = document.querySelectorAll('.portfolio-card');
const searchBox = document.querySelector('#search');

const siteModal = document.querySelector('.site-wrapper');

const openElms = document.querySelectorAll('[data-open]');
const closeElms = document.querySelectorAll('[data-close]');
const isVisible = "is-visible";

const setTheme = (elm) => {
	if (elm === 'dark') {
		document.documentElement.setAttribute('data-theme', 'dark');
		localStorage.setItem('theme', 'dark');
	} else {
		document.documentElement.setAttribute('data-theme', 'light');
		localStorage.setItem('theme', 'light');
	}
}

const setActive = (elm, selector) => {
	if (document.querySelector(`${selector}.active`) !== null) {
		document.querySelector(`${selector}.active`).classList.remove('active');
	}
	elm.classList.add('active');
}

if (currentTheme) {
	document.documentElement.setAttribute('data-theme', currentTheme);
	switcher.forEach((btn) => {
		btn.classList.remove('active');
	});

	if (currentTheme === 'dark') {
		switcher[1].classList.add('active')
	} else {
		switcher[0].classList.add('active')
	}
}

toggleTheme.addEventListener('click', function() {
	const tab = this.parentElement.parentElement;
	if (!tab.className.includes('open')) {
		tab.classList.add('open');
	} else {
		tab.classList.remove('open');
	}
});

for (const elm of switcher) {
	elm.addEventListener('click', function() {
		const toggle = this.dataset.toggle;
		setActive(elm, '.switcher-btn');
		setTheme(toggle);
  });
}

filterLink.forEach((link)=> {
	link.addEventListener('click', (e) => {
		e.preventDefault()
		const filter = e.target.dataset.filter;
		setActive(link, '.filter-link');
		portfolioItems.forEach((item) => {
			if (filter === 'all'){
				item.style.display = 'block'
			} else if (item.getAttribute('id') === filter) {
				item.style.display = 'block'
			} else {
				item.style.display = 'none'
			}
		})
	})
});


searchBox.addEventListener('keyup', (e) => {
	// trim() removes white space
	const searchFilter = e.target.value.toLowerCase().trim();
	
	portfolioItems.forEach((item) => {
		if (item.getAttribute('id').includes(searchFilter)){
			item.style.display = 'block'
		} else {
			item.style.display = 'none'
		}
	})
})


// Full Site Modal "Open Buttons"
for (const elm of openElms) {
  elm.addEventListener('click', function() {
    const modalId = this.dataset.open;
    document.getElementById(modalId).classList.add(isVisible);
  });
}
// Full Site Modal "Close Buttons"
for (const elm of closeElms) {
  elm.addEventListener('click', function() {
    this.parentElement.parentElement.classList.remove(isVisible);
  });
}


// Modal
document.addEventListener('click', (e) => {
	console.log('doc event');
	
  if (e.target == document.querySelector(".modal.is-visible")) {
    document.querySelector(".modal.is-visible").classList.remove(isVisible);
  }
});

document.addEventListener('keyup', (e) => {
  // if we press the ESC
  if (e.key == "Escape" && document.querySelector(".modal.is-visible")) {
    document.querySelector(".modal.is-visible").classList.remove(isVisible);
  }
});



// Carousel
const base = './assets/images/';
const slides = document.querySelectorAll(".review-item");
const button = document.querySelectorAll(".slide-ctrl");
const images = [
	`${base}1.jpeg`,
	`${base}2.jpeg`,
	`${base}3.jpeg`,
	`${base}4.jpg`,
	'http://via.placeholder.com/500x500'
];

let current = Math.floor(Math.random() * slides.length);
let prev = current > 0 ? current - 1 : slides.length - 1;
let next = current < slides.length - 1 ? current + 1 : 0;
let newIndex = 0;

const update = () => {
	slides.forEach((item) => {
		item.classList.remove("active");
    item.classList.remove("prev");
    item.classList.remove("next");
  });
  slides[current].classList.add("active");
  slides[prev].classList.add("prev");
	slides[next].classList.add("next");
}

const setAttr = (el, attr, value) => el.setAttribute(attr, value);
const gotoPrev = () => current > 0 ? gotoNum(current - 1) : gotoNum(slides.length - 1);
const gotoNext = () => current < slides.length - 1 ? gotoNum(current + 1) : gotoNum(0);

for (let i = 0; i < button.length; i++) {
	button[i].addEventListener("click", () => i == 0 ? gotoPrev() : gotoNext());
}

const gotoNum = (number) => {
	current = number;
	newIndex = (newIndex < images.length - 1) ? newIndex + 1 : 0;
	prev = current > 0 ? current - 1 : slides.length - 1;
	next = current < slides.length - 1 ? current + 1 : 0;

	setAttr(slides[current], 'src', images[newIndex]);
	setAttr(slides[prev], 'src', images[prev]);
	setAttr(slides[next], 'src', images[next]);
	
  update();
}

update();