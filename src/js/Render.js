export default class Render {
	constructor(container) {
		this.container = container;

		this.sectionAddImg;
		this.inputSelectImg;

		this.sectionTempImg;

		this.addImgListeners = {
			dragover: [],
			drop: [],
			change: [],
		};
		this.tempImgListeners = {
			click: [],
		};

		this.renderPage();
	}

	renderPage() {
		const header = this.renderHeaderPage();
		this.container.append(header);

		const main = this.renderMainPage();
		this.container.append(main);

		this.registerEvent();
	}

	registerEvent() {
		document.addEventListener("dragover", (event) => {
			this.addImgListeners.dragover.forEach((item) => item(event));
			event.preventDefault();
		});
		this.sectionAddImg.addEventListener("drop", (event) => {
			this.addImgListeners.drop.forEach((item) => item(event));
			event.preventDefault();
		});
		this.inputSelectImg.addEventListener("change", (event) => {
			this.addImgListeners.change.forEach((item) => item(event));
		});

		this.sectionTempImg.addEventListener("click", (event) => {
			this.tempImgListeners.click.forEach((item) => item(event));
		});
	}

	addImgListener(field, callback) {
		this.addImgListeners[field].push(callback);
	}

	addTempImgListener(field, callback) {
		this.tempImgListeners[field].push(callback);
	}

	renderHeaderPage() {
		const header = document.createElement("header");
		header.classList.add("container", "header");
		header.innerHTML = `
			<h1 class="header-title">
				Your Little Image Manager
			</h1>
		`;

		return header;
	}

	renderMainPage() {
		const main = document.createElement("main");
		main.classList.add("container", "main");

		const sectionAddImg = this.renderSectionAddImg();
		this.sectionAddImg = sectionAddImg;
		main.append(sectionAddImg);

		const sectionTempImg = this.renderSectionTempImg();
		this.sectionTempImg = sectionTempImg;
		main.append(sectionTempImg);

		return main;
	}

	renderSectionAddImg() {
		const sectionAddImg = document.createElement("section");
		sectionAddImg.classList.add("section", "add-img");
		sectionAddImg.innerHTML = `
			<label for="add-img__select-button" class="add-img__label">
				<input class="add-img__button hidden-item" type="file" multiple="true" id="add-img__select-button">

				<div class="add-img__drag-area">
					<div class="add-img__drag-area-descr">
						<p class="add-img__drag-area__p">
							Drag and Drop file here
						</p>
						<p class="add-img__drag-area__p">
							or Click to select
						</p>
					</div>
				</div>
			</label>
		`;

		const inputSelectImg = sectionAddImg.querySelector(".add-img__button");
		this.inputSelectImg = inputSelectImg;

		const dropArea = sectionAddImg.querySelector(".add-img__drag-area");
		this.dropArea = dropArea;

		return sectionAddImg;
	}

	renderSectionTempImg() {
		const sectionTempImg = document.createElement("section");
		sectionTempImg.classList.add("section", "temp-img", "hidden-item");
		sectionTempImg.innerHTML = `
			<h2 class="section-title temp-img__title">
				New Images
			</h2>
			<ul class="list-img temp-list-img">
			</ul>		
		`;

		const listTempImgs = sectionTempImg.querySelector("ul.list-img");
		this.listTempImgs = listTempImgs;

		return sectionTempImg;
	}

	renderImg(img, section) {
		const newImg = document.createElement("li");
		newImg.classList.add(`img-item`, `${section}-img`);
		newImg.dataset.id = img.id;

		let blockButton;
		if (section === "temp") {
			blockButton = `
				<button class="img-button img-button__save" data-id="${img.id}">
					Save
				</button>
				<button class="img-button img-button__cancel" data-id="${img.id}">
					Remove
				</button>
			`;
		}

		if (section === "saved") {
			blockButton = `
				<button class="img-button img-button__remove">
					Remove
				</button>
			`;
		}

		newImg.innerHTML = `
			<div class="img-container">
				<img class="img-img" src="${img.src}" alt="${img.name}">
			</div>
			<div class="img-button__block">
				${blockButton}
			</div>
		`;

		return newImg;
	}

	addTempImg(img) {
		const imgItem = this.renderImg(img, "temp");
		this.showSectionTempImgs();
		this.listTempImgs.append(imgItem);

		const imgEl = imgItem.querySelector(".img-img");
		this.clearBlobFromMemory(imgEl);
	}

	clearBlobFromMemory(img) {
		img.addEventListener("load", () => {
			URL.revokeObjectURL(img.src);
		});
	}

	showSectionTempImgs() {
		this.sectionTempImg.classList.remove("hidden-item");
	}

	hideSectionTempImgs() {
		this.sectionTempImg.classList.add("hidden-item");
	}

	activeDropArea() {
		this.dropArea.classList.add("add-img__drag-area_hover");
	}

	disableDropArea() {
		this.dropArea.classList.remove("add-img__drag-area_hover");
	}

	removeImgNode(img, countImg) {
		img.remove();

		if (countImg === 0) {
			this.hideSectionTempImgs();
		}
	}
}
