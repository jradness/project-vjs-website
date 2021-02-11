const theme = 'theme'
const dataTheme = 'data-theme';
const themeTab = '.theme-tab'
const switcherBtn = '.switcher-btn'
const portFolioCard = '.portfolio-card';
const search = '#search';
const modal = '.site-wrapper';
const dataFilter = '[data-filter]';
const dataOpen = '[data-open]';
const dataClose = '[data-close]';
const isVisible = "is-visible";
const dark = 'dark';
const light = 'light';
const active = 'active';
const open = 'open';

const root = document.documentElement;
/* Theme */
const toggleTheme = document.querySelector(themeTab);
const switcher = document.querySelectorAll(switcherBtn);
const currentTheme = localStorage.getItem(theme);

/* Portfolio */
const filterLink = document.querySelectorAll(dataFilter);
const portfolioItems = document.querySelectorAll(portFolioCard);
const searchBox = document.querySelector(search);

/* Modal */
const siteModal = document.querySelector(modal);
const openModal = document.querySelectorAll(dataOpen);
const closeModal = document.querySelectorAll(dataClose);

const sections = document.querySelectorAll('section');


const setTheme = (elm) => {
	if (elm === dark) {
		root.setAttribute(dataTheme, dark);
		localStorage.setItem(theme, dark);
	} else {
		root.setAttribute(dataTheme, light);
		localStorage.setItem(theme, light);
	}
}

const setActive = (elm, selector) => {
	if (document.querySelector(`${selector}.${active}`) !== null) {
		document.querySelector(`${selector}.${active}`).classList.remove(active);
	}
	elm.classList.add(active);
}

const setSectionDisplay = (display = 'block') => {
	sections.forEach((section) => {
		section.style.display = display;
	});
}

if (currentTheme) {
	root.setAttribute(dataTheme, currentTheme);
	switcher.forEach((btn) => {
		btn.classList.remove(active);
	});

	if (currentTheme === dark) {
		switcher[1].classList.add(active)
	} else {
		switcher[0].classList.add(active)
	}
}

toggleTheme.addEventListener('click', function() {
	const tab = this.parentElement.parentElement;
	if (!tab.className.includes(open)) {
		tab.classList.add(open);
	} else {
		tab.classList.remove(open);
	}
});

for (const elm of switcher) {
	elm.addEventListener('click', function() {
		const toggle = this.dataset.toggle;
		setActive(elm, switcherBtn);
		setTheme(toggle);
  });
}

filterLink.forEach((link)=> {
	link.addEventListener('click', function() {
		// e.preventDefault()
		const filter = this.dataset.filter;
		setActive(link, '.filter-link');
		portfolioItems.forEach((item) => {
			if (filter === 'all'){
				item.style.display = 'block'
			} else if (item.dataset.item === filter) {
				item.style.display = 'block'
			} else {
				item.style.display = 'none'
			}
		})
	})
});


searchBox.addEventListener('keyup', (e) => {
	// trim() removes white space
	const searchFilter = this.value.toLowerCase().trim();
	
	portfolioItems.forEach((item) => {
		if (item.getAttribute('data-item').includes(searchFilter)){
			item.style.display = 'block'
		} else {
			item.style.display = 'none'
		}
	})
})


// Full Site Modal "Open Buttons"
for (const elm of openModal) {
  elm.addEventListener('click', function() {
    const modalId = this.dataset.open;
		document.getElementById(modalId).classList.add(isVisible);
		
		if (modalId === 'about' || modalId === 'contact') {
			setSectionDisplay('none');
		}
  });
}
// Full Site Modal "Close Buttons"
for (const elm of closeModal) {
  elm.addEventListener('click', function() {
		this.parentElement.parentElement.parentElement.classList.remove(isVisible);
		setSectionDisplay('block');
  });
}


// Modal
document.addEventListener('click', (e) => {
	console.log(e.target, document.querySelector(".modal.is-visible"));
	
  if (e.target === document.querySelector(".modal.is-visible")) {
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
	`${base}img1.jpg`,
	`${base}img2.jpg`,
	`${base}img3.jpg`,
	`${base}img4.jpg`,
	`${base}img5.jpg`,
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
	
	// setAttr(slides[current].querySelector('img'), 'src', images[newIndex]);
	// setAttr(slides[prev].querySelector('img'), 'src', images[prev]);
	// setAttr(slides[next].querySelector('img'), 'src', images[next]);
	
  update();
}

update();


const marqueeElmsDisplayed = getComputedStyle(root).getPropertyValue('--marquee-elements-displayed');
const marqueeContent = document.querySelector('ul.marquee-content');

root.style.setProperty('--marquee-elements', marqueeContent.children.length);

for (let i = 0; i < marqueeElmsDisplayed; i += 1) {
  marqueeContent.appendChild(marqueeContent.children[i].cloneNode(true));
}