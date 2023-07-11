function switchSlides(slides, idx, newIdx) {
    slides[idx].style.display = "none";
    slides[newIdx].style.display = "block";
    return newIdx;
}

function nextSlide(slides, idx) {
    const newIdx = Math.min(slides.length-1, idx+1);
    switchSlides(slides, idx, newIdx);
    return newIdx;
}

function prevSlide(slides, idx) {
    const newIdx = Math.max(0, idx-1);
    switchSlides(slides, idx, newIdx);
    return newIdx;
}

function getNote(notes, slide, idx) {
    if (notes[idx] === undefined) {
        const noteElement = slide.querySelector(".note");
        if (noteElement === null) {
            return;
        }
        const note = noteElement.textContent;
        notes[idx] = note;
        return note;
    }

    return notes[idx];
}

function logNote(notes, slide, idx) {
    const note = getNote(notes, slide, idx);
    if (note !== undefined) {
        console.log(note);
    }
}

window.onload = () => {
    const slides = document.querySelectorAll("section");

    if (slides.length <= 0) {
        throw new Error("There are no slides in this presentation");
    }

    const indexElement = document.getElementById("index");
    const overlay = document.getElementById("overlay");

    overlay.className = "index0";
    slides[0].style.display = "block";
    notes = new Array(slides.length);
    logNote(notes, slides[0], 0);
    if (indexElement !== null) {
        indexElement.textContent = "0";
    }

    let idx = 0;
    document.addEventListener("keydown", (e) => {
        switch (e.key) {
        case "ArrowLeft":
        case "PageUp":
        case "k":
            e.preventDefault();
            idx = prevSlide(slides, idx);
            break;
        case "ArrowRight":
        case "PageDown":
        case "j":
            e.preventDefault();
            idx = nextSlide(slides, idx);
            break;
        case "Home":
        case "u":
        case "g":
            e.preventDefault();
            idx = switchSlides(slides, idx, 0);
            break;
        case "End":
        case "d":
        case "G":
            e.preventDefault();
            idx = switchSlides(slides, idx, slides.length-1);
            break;
        case " ":
            e.preventDefault();
            idx = switchSlides(slides, idx, idx);
            break;
        }

        overlay.className = `index${idx}`;
        logNote(notes, slides[idx], idx);
        if (indexElement !== null) {
            indexElement.textContent = `${idx}`;
        }
    });
}

// TODO: Find another way to show the notes. One option would be to create a api that accepts the notes and shows them
