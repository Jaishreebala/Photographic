const auth = "563492ad6f917000010000015f753f474a70474588b224a61377b02c";
const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('.search-input');
const submitButton = document.querySelector('.submit-btn');
const moreButton = document.querySelector("#more");

let photosNo = 15;
let searchValue;
let pageNo = 1;
async function curatedPhotos() {
    const fetchData = await fetchDataFromAPI(`https://api.pexels.com/v1/curated?per_page=${photosNo}&page=1`);
    const dataFromPexels = await fetchData.json();
    generateImages(dataFromPexels);
}
curatedPhotos();

submitButton.addEventListener("click", searchResults);

function searchResults(e) {
    e.preventDefault();
    gallery.innerHTML = "";
    searchValue = searchInput.value;
    searchInput.value = "";
    generateFilteredGallery();
}
async function generateFilteredGallery() {
    const fetchData = await fetchDataFromAPI(`https://api.pexels.com/v1/search?query=${searchValue}&per_page=${photosNo}&page=1`)
    const filteredResults = await fetchData.json();
    generateImages(filteredResults);

}


function generateImages(data) {
    data.photos.forEach(photo => {
        let galleryImgContainer = document.createElement("div");
        let galleryTitleArea = document.createElement("div");
        let photographer = document.createElement("a");
        let downloadBtn = document.createElement("a");
        let galleryImg = document.createElement("div");

        // assign values
        photographer.innerText = photo.photographer;
        downloadBtn.innerText = "Download";
        galleryImg.style.backgroundImage = `url(${photo.src.original})`
        photographer.href = photo.photographer_url;
        photographer.target = "_blank";
        downloadBtn.href = photo.src.original;
        downloadBtn.target = "_blank";

        // assign classes
        galleryImgContainer.classList.add("gallery-img-container");
        galleryTitleArea.classList.add("gallery-title-area");
        photographer.classList.add('photographer');
        downloadBtn.classList.add('download-btn');
        galleryImg.classList.add('gallery-img');

        // append elements to child or parent
        galleryTitleArea.appendChild(photographer);
        galleryTitleArea.appendChild(downloadBtn);
        galleryImgContainer.appendChild(galleryTitleArea);
        galleryImgContainer.appendChild(galleryImg);
        gallery.appendChild(galleryImgContainer)

    })
}

async function fetchDataFromAPI(url) {
    const data = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: auth
        }
    })
    return data;
}


moreButton.addEventListener("click", generateMoreImages);

async function generateMoreImages() {
    let fetchData;
    pageNo++;
    if (searchValue) {
        fetchData = await fetchDataFromAPI(`https://api.pexels.com/v1/search?query=${searchValue}&per_page=${photosNo}&page=${pageNo}`);
    }
    else {
        fetchData = await fetchDataFromAPI(`https://api.pexels.com/v1/curated?per_page=${photosNo}&page=${pageNo}`);
    }
    const data = await fetchData.json();
    generateImages(data);
}