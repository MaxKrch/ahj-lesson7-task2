export default class Render {
	constructor(container) {
		this.container = container;
		this.inputSelectImg;
		
		this.loadSvdImgs;
		this.saveTmpImgs;		
		
		this.page = {
			// sectionHeader,
			// sectionNewImg,
			// sectionTempImg,
			// sectionSavedImg,
		}
		
		this.loadSvdImgsListeners = {
			click: [],
		}

		this.saveTmpImgListeners = {
			click: [],
		}
		
		this.newImgSectionListeners = {
			dragover: [],
			drop: [],
			change: [],
		}

		this.tempImgSectionListeners = {
			click: [],
			dblclick: [],
			focusout: [],
		}

		this.savedImgSectionListeners = {
			click: [],
			dblclick: [],
			focusout: [],
		}

		this.init();
	}

	init() {
		this.renderPage();
		this.registerEvent();
	}

	renderPage() {
		const header = this.renderHeaderPage();
		this.container.append(header);

		const main = this.renderMainPage();
		this.container.append(main);
	}

	registerEvent() {
		document.addEventListener("dragover", (event) => {
			this.newImgSectionListeners.dragover.forEach((item) => item(event));
			event.preventDefault();
		});
		this.page.sectionNewImg.addEventListener("drop", (event) => {
			this.newImgSectionListeners.drop.forEach((item) => item(event));
			event.preventDefault();
		});
		this.inputSelectImg.addEventListener("change", (event) => {
			this.newImgSectionListeners.change.forEach((item) => item(event));
		});

		this.loadSvdImgs.addEventListener('click', (event) => {
			this.loadSvdImgsListeners.click.forEach(item => item(event))
		});
		this.saveTmpImgs.addEventListener('click', (event) => {
			this.saveTmpImgListeners.click.forEach(item => item(event))
		});

		this.page.sectionTempImg.addEventListener("click", (event) => {
			this.tempImgSectionListeners.click.forEach((item) => item(event));
		});
		this.page.sectionTempImg.addEventListener("dblclick", (event) => {
			this.tempImgSectionListeners.dblclick.forEach((item) => item(event));
		});
		this.page.sectionTempImg.addEventListener("focusout", (event) => {
			this.tempImgSectionListeners.focusout.forEach((item) => item(event));
		});

		this.page.sectionSavedImg.addEventListener("click", (event) => {
			this.savedImgSectionListeners.click.forEach((item) => item(event));
		});
		this.page.sectionSavedImg.addEventListener("dblclick", (event) => {
			this.savedImgSectionListeners.dblclick.forEach((item) => item(event));
		});
		this.page.sectionSavedImg.addEventListener("focusout", (event) => {
			this.savedImgSectionListeners.focusout.forEach((item) => item(event));
		});
	}

	addLoadSvdImgListeners(field, callback) {
		this.loadSvdImgsListeners[field].push(callback);
	}

	addSaveTmpImgListeners(field, callback) {
		this.saveTmpImgListeners[field].push(callback)
	}

	addNewImgSectionListeners(field, callback) {
		this.newImgSectionListeners[field].push(callback);
	}

	addTempImgSectionListeners(field, callback) {
		this.tempImgSectionListeners[field].push(callback);
	}

	addSavedImgSectionListeners(field, callback) {
		this.savedImgSectionListeners[field].push(callback);
	}

	renderHeaderPage() {
		const header = document.createElement("header");
		const loadBtn = this.renderDivBtn('loadSvdImgs', 'Загрузить изображения?');

		header.classList.add("container", "header");
		header.append(loadBtn);

		this.page.sectionHeader = header;
		this.loadSvdImgs = loadBtn;
	
		return header;
	}

	renderDivBtn(name, text) {
		const button = document.createElement('div');
		button.classList.add(`button`, `button-div`, `button-${name}`);
		button.textContent = text;

		return button;
	}

	renderMainPage() {
		const main = document.createElement("main");
		main.classList.add("container", "main");

		const sectionNewImg = this.renderSectionNewImg();
		this.page.sectionNewImg = sectionNewImg;
		main.append(sectionNewImg);
			
		const saveBtn = this.renderDivBtn('saveTmpImgs','Сохранить изображения?');
		this.saveTmpImgs = saveBtn;
		main.append(saveBtn);
	
	
		const sectionTempImg = this.renderSectionImg('temp');
		this.page.sectionTempImg = sectionTempImg;
		main.append(sectionTempImg);
		
	
		const sectionSavedImg = this.renderSectionImg('saved');
		this.page.sectionSavedImg = sectionSavedImg;
		main.append(sectionSavedImg);

		this.saveBodyElements(main)

		return main;
	}

	renderSectionNewImg() {
		const sectionNewImg = document.createElement("section");
		sectionNewImg.classList.add("section", "new-img");
		sectionNewImg.innerHTML = `
			<label for="new-img__select-button" class="new-img__label">
				<input class="new-img__button hidden-item" type="file" multiple="true" id="new-img__select-button">

				<div class="new-img__drag-area">
					<div class="new-img__drag-area-descr">
						<p class="new-img__drag-area__p">
							Drag and Drop file here
						</p>
						<p class="new-img__drag-area__p">
							or Click to select
						</p>
					</div>
				</div>
			</label>
		`;

		return sectionNewImg;
	}

	renderSectionImg(section) {
		const nameSection = section[0].toUpperCase() + section.slice(1, (section.length))
		
		const sectionImg = document.createElement("section");
		sectionImg.classList.add(`section`, `${section}-img`, `hidden-item`);
		sectionImg.innerHTML = `
			<h2 class="section-title ${section}-img__title">
				${nameSection} Images
			</h2>
			<ul class="list-img ${section}-list-img">
			</ul>		
		`;

		return sectionImg;
	}
 	
 saveBodyElements(body) {
		this.inputSelectImg = body.querySelector(".new-img__button");
		this.dropArea = body.querySelector(".new-img__drag-area");
	}

	createImg(img, section) {
		const newImg = document.createElement("li");
		newImg.classList.add(`img-item`, `${section}-img`);
		newImg.dataset.id = img.id;

		let blockButton;
		if (section === "temp") {
			blockButton = `
				<button class="img-button img-button__del img-button__cancel" data-id="${img.id}">
					Remove
				</button>
				<button class="img-button img-button__save" data-id="${img.id}">
					Save
				</button>
			`;
		}

		if (section === "saved") {
			blockButton = `
				<button class="img-button img-button__del img-button__remove" data-id="${img.id}">
					Remove
				</button>
			`;
		}

		const imgWrapClasses = `img-img__wrap img-${section}__wrap`;

		newImg.innerHTML = `
			<div class="img-container">
				<div class="${imgWrapClasses}">
					<img class="img-img" src="${img.src}" alt="${img.name}" data-id="${img.id}">
				</div>	
					<div class="img-button__block">
					${blockButton}
				</div>
			</div>
			<div class="img-name" data-id="${img.id}"">
				${img.name}
			</div>
		`;

		return newImg;
	}

	addImgToPage(img, section) {
		const imgItem = this.createImg(img, section);
		this.showSectionImgs(section);

		const nameSection = this.createNameSection(section);
		const activeSection = this.page[nameSection];

		const listImgs = activeSection.querySelector(`ul.${section}-list-img`)
		listImgs.append(imgItem);

		const imgEl = imgItem.querySelector(".img-img");
	}

	addSavedImgToPage(img) {

	}

	showSectionImgs(section) {
		const nameSection = this.createNameSection(section);
		this.page[nameSection].classList.remove("hidden-item");
	}

	hideSectionImgs(section) {
		const nameSection = this.createNameSection(section);
		this.page[nameSection].classList.add("hidden-item");
	}

	createNameSection(section) {
		const tagWithCaps = section[0].toUpperCase() + section.slice(1, section.length);
		const name = `section${tagWithCaps}Img`;

		return name;
	}
	
	activeDropArea() {
		this.dropArea.classList.add("new-img__drag-area_hover");
	}

	disableDropArea() {
		this.dropArea.classList.remove("new-img__drag-area_hover");
	}

	removeImgNode(img, section, countImg) {
		img.remove();

		if (countImg === 0) {
			this.hideSectionImgs(section);
		}
	}
}
