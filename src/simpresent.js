class SubSection extends HTMLElement {
    constructor() {
        super();
    }
}

class Slide {
    constructor(element) {
        this.element = element;
        this.currentSubslide = -1;
        this.subslides = [];
    }

    subslide() {
        return this.subslides[this.currentSubslide];
    }

    updateSubslides() {
        if (this.subslides.length <= 0) {
            this.subslides = this.element.querySelectorAll("sub-section");
        }
    }
}

class Simpresent {
    constructor() {
        this.idx = 0;
        const sections = document.querySelectorAll("section");

        if (sections.length <= 0) {
            throw new Error("There are no slides in this presentation");
        }

        for (let i = 0; i < sections.length; ++i) {
            sections[i].id = "slide" + i;
        }
        this.slides = sections2Slides(sections);

        customElements.define("sub-section", SubSection);

        this.indexElement = document.getElementById("index");
        this.overlay = document.getElementById("overlay");
        this.overlay.className = "index0";
        if (this.indexElement !== null) {
            this.indexElement.textContent = "0";
        }

        this.slides[0].element.style.display = "block";
        this.notes = new Array(this.slides.length);
    }

    currentSlide() {
        return this.slides[this.idx];
    }

    currentNote() {
        return this.notes[this.idx];
    }

    switchSlides(newIdx) {
        this.currentSlide().element.style.display = "none";
        this.slides[newIdx].element.style.display = "block";
        this.idx = newIdx;
    }

    prevSlide() {
        const newIdx = Math.max(0, this.idx-1);
        this.switchSlides(newIdx);
        this.idx = newIdx;
    }

    nextSlide() {
        const newIdx = Math.min(this.slides.length-1, this.idx+1);
        this.switchSlides(newIdx);
        this.idx = newIdx;
    }

    prevSubslide() {
		if (this.currentSlide().subslide() === undefined) {
            return;
		}
		this.currentSlide().subslide().style.display = "none";
        this.currentSlide().currentSubslide = Math.max(-1, this.currentSlide().currentSubslide-1);
    }

    nextSubslide() {
        this.currentSlide().currentSubslide =
            Math.min(this.currentSlide().subslides.length-1,
                     this.currentSlide().currentSubslide+1);
					 
		if (this.currentSlide().subslide() === undefined) {
            return;
        }
		
        this.currentSlide().subslide().style.display = "block";
    }

    update() {
		this.logNote();
		this.currentSlide().updateSubslides();
        this.overlay.className = `index${this.idx}`;
        if (this.indexElement !== null) {
            this.indexElement.textContent = `${this.idx}`;
        }
    }

    logNote() {
        if (this.currentNote() === undefined) {
            const noteElement = this.currentSlide().element.querySelector(".note");
            if (noteElement === null) {
                return;
            }            
            this.notes[this.idx] = noteElement.textContent;
        }

        if (this.currentNote() !== undefined) {
            console.log(this.currentNote());
        }
    }
}

function sections2Slides(sections) {
    let slides = [];
    for (let i = 0; i < sections.length; ++i) {
        slides.push(new Slide(sections[i]));
    }
    return slides;
}

window.onload = () => {
    const simpresent = new Simpresent();
	
    document.addEventListener("keydown", (e) => {
        switch (e.key) {
        case "ArrowLeft":
        case "h":
            simpresent.prevSubslide();
            break;
        case "ArrowRight":
        case "l":
            simpresent.nextSubslide();
            break;
        case "PageUp":
		case "ArrowUp":
        case "k":
            e.preventDefault();
            simpresent.prevSlide();
            break;
        case "PageDown":
		case "ArrowDown":
        case "j":
            e.preventDefault();
            simpresent.nextSlide();
            break;
        case "Home":
        case "u":
        case "g":
            e.preventDefault();
            simpresent.switchSlides(0);
            break;
        case "End":
        case "d":
        case "G":
            e.preventDefault();
            simpresent.switchSlides(simpresent.slides.length-1);
            break;
        case " ":
            e.preventDefault();
            break;
        }

        simpresent.update()
    });
}

// TODO: Find another way to show the notes. One option would be to create a api that accepts the notes and shows them