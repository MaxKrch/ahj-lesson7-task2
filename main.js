/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/Render.js
class Render {
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
    };
    this.loadSvdImgsListeners = {
      click: []
    };
    this.saveTmpImgListeners = {
      click: []
    };
    this.newImgSectionListeners = {
      dragover: [],
      drop: [],
      change: []
    };
    this.tempImgSectionListeners = {
      click: [],
      dblclick: [],
      focusout: []
    };
    this.savedImgSectionListeners = {
      click: [],
      dblclick: [],
      focusout: []
    };
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
    document.addEventListener("dragover", event => {
      this.newImgSectionListeners.dragover.forEach(item => item(event));
      event.preventDefault();
    });
    this.page.sectionNewImg.addEventListener("drop", event => {
      this.newImgSectionListeners.drop.forEach(item => item(event));
      event.preventDefault();
    });
    this.inputSelectImg.addEventListener("change", event => {
      this.newImgSectionListeners.change.forEach(item => item(event));
    });
    this.loadSvdImgs.addEventListener('click', event => {
      this.loadSvdImgsListeners.click.forEach(item => item(event));
    });
    this.saveTmpImgs.addEventListener('click', event => {
      this.saveTmpImgListeners.click.forEach(item => item(event));
    });
    this.page.sectionTempImg.addEventListener("click", event => {
      this.tempImgSectionListeners.click.forEach(item => item(event));
    });
    this.page.sectionTempImg.addEventListener("dblclick", event => {
      this.tempImgSectionListeners.dblclick.forEach(item => item(event));
    });
    this.page.sectionTempImg.addEventListener("focusout", event => {
      this.tempImgSectionListeners.focusout.forEach(item => item(event));
    });
    this.page.sectionSavedImg.addEventListener("click", event => {
      this.savedImgSectionListeners.click.forEach(item => item(event));
    });
    this.page.sectionSavedImg.addEventListener("dblclick", event => {
      this.savedImgSectionListeners.dblclick.forEach(item => item(event));
    });
    this.page.sectionSavedImg.addEventListener("focusout", event => {
      this.savedImgSectionListeners.focusout.forEach(item => item(event));
    });
  }
  addLoadSvdImgListeners(field, callback) {
    this.loadSvdImgsListeners[field].push(callback);
  }
  addSaveTmpImgListeners(field, callback) {
    this.saveTmpImgListeners[field].push(callback);
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
    const saveBtn = this.renderDivBtn('saveTmpImgs', 'Сохранить изображения?');
    this.saveTmpImgs = saveBtn;
    main.append(saveBtn);
    const sectionTempImg = this.renderSectionImg('temp');
    this.page.sectionTempImg = sectionTempImg;
    main.append(sectionTempImg);
    const sectionSavedImg = this.renderSectionImg('saved');
    this.page.sectionSavedImg = sectionSavedImg;
    main.append(sectionSavedImg);
    this.saveBodyElements(main);
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
    const nameSection = section[0].toUpperCase() + section.slice(1, section.length);
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
    const listImgs = activeSection.querySelector(`ul.${section}-list-img`);
    listImgs.prepend(imgItem);
    const imgEl = imgItem.querySelector(".img-img");
  }
  addSavedImgToPage(img) {}
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
;// CONCATENATED MODULE: ./src/js/State.js
class State {
  constructor() {
    this.nextTempId = 0;
    this.tempImages = [];
    this.savedImages = [];
  }
}
;// CONCATENATED MODULE: ./src/js/Image.js
class Image {
  constructor(img, id) {
    this.id = id;
    this.name;
    this.ext;
    this.src;
    this.createINewImg(img);
  }
  createINewImg(img) {
    const indexLastDot = img.name.lastIndexOf('.');
    const name = indexLastDot > -1 ? img.name.slice(0, indexLastDot) : img.name;
    const ext = indexLastDot > -1 ? img.name.slice(indexLastDot + 1, img.name.length) : '';
    const src = URL.createObjectURL(img);
    if (!src) {
      return;
    }
    this.name = name;
    this.ext = ext;
    this.src = src;
  }
}
;// CONCATENATED MODULE: ./src/js/connection.js
const createRequest = async req => {
  const baseUrl = 'https://ahj-lesson7-task2-backend-production.up.railway.app';
  // const baseUrl = 'http://192.168.1.104:7070/';
  let fullUrl = `${baseUrl}?act=${req.act}`;
  const optionsReq = {
    method: req.method,
    mode: 'cors'
  };
  const reqData = new FormData();
  if (req.act === 'saveImg') {
    const imgBlob = await fetch(req.file.src);
    const img = await imgBlob.blob();
    reqData.append('file', img, req.file.name);
  }
  if (req.act === 'upgImg') {
    reqData.append('newName', req.file.newName);
    reqData.append('id', req.file.id);
  }
  if (req.act === 'delImg') {
    reqData.append('id', req.file.id);
  }
  optionsReq.body = reqData;
  try {
    const resp = await fetch(fullUrl, optionsReq);
    const data = await resp.json();
    return data;
  } catch (err) {
    console.log(`Сервер недоступен`);
  }
};
/* harmony default export */ const connection = (createRequest);
;// CONCATENATED MODULE: ./src/js/Controller.js



const baseUrl = 'https://ahj-lesson7-task2-backend-production.up.railway.app';
// const baseUrl = 'http://192.168.1.104:7070';


class AppController {
  constructor(container) {
    this.container = document.querySelector(container);
    this.state = new State();
    this.render = new Render(this.container);
    this.init();
  }
  init() {
    this.addListeners();
  }
  addListeners() {
    this.render.addLoadSvdImgListeners('click', this.onClickLoadSvdImgs.bind(this));
    this.render.addSaveTmpImgListeners('click', this.onClickSaveTmpImg.bind(this));
    this.render.addNewImgSectionListeners("change", this.onChangeNewImgs.bind(this));
    this.render.addNewImgSectionListeners("dragover", this.onDragoverNewImgs.bind(this));
    this.render.addNewImgSectionListeners("drop", this.onDropNewImgs.bind(this));
    this.render.addTempImgSectionListeners("click", this.onClickTempImgs.bind(this));
    this.render.addTempImgSectionListeners("dblclick", this.onDblClickTempImgs.bind(this));
    this.render.addTempImgSectionListeners("focusout", this.onFocusoutTempImgs.bind(this));
    this.render.addSavedImgSectionListeners("click", this.onClickSavedImgs.bind(this));
    this.render.addSavedImgSectionListeners("dblclick", this.onDblClickSavedImgs.bind(this));
    this.render.addSavedImgSectionListeners("focusout", this.onFocusoutSavedImgs.bind(this));
  }
  onClickLoadSvdImgs(event) {
    const savedImgs = this.loadSvdImgs();
  }
  async onClickSaveTmpImg(event) {
    if (!this.state.tempImages) {
      return;
    }
    const images = this.state.tempImages.slice();
    for (let img of images) {
      await this.saveImg(img);
    }
  }
  onChangeNewImgs(event) {
    const newFiles = event.currentTarget.files;
    this.addTempImgs(newFiles);
    event.currentTarget.value = '';
  }
  onDragoverNewImgs(event) {
    if (event.target.closest(".new-img__drag-area")) {
      this.render.activeDropArea();
    } else {
      this.render.disableDropArea();
    }
  }
  onDropNewImgs(event) {
    this.render.disableDropArea();
    const files = event.dataTransfer.files;
    if (files) {
      this.addTempImgs(files);
    }
  }
  onClickTempImgs(event) {
    if (event.target.classList.contains("img-button__cancel")) {
      const id = Number(event.target.dataset.id);
      const src = this.removeTempImg(id);
      this.clearBlobFromMemory(src);
      return;
    }
    if (event.target.classList.contains("img-button__save")) {
      const id = Number(event.target.dataset.id);
      const img = this.state.tempImages.find(item => item.id === id);
      this.saveImg(img);
      return;
    }
  }
  onDblClickTempImgs(event) {
    if (event.target.classList.contains('img-name')) {
      event.target.setAttribute('contenteditable', 'true');
      event.target.focus();
      return;
    }
  }
  onFocusoutTempImgs(event) {
    if (event.target.classList.contains('img-name')) {
      event.target.setAttribute('contenteditable', 'false');
      const id = event.target.dataset.id;
      let newName = event.target.textContent.trim();
      if (newName.length === 0) {
        newName = 'No Name';
      }
      event.target.textContent = newName;
      this.renameTempImg(id, newName);
      return;
    }
  }
  async onClickSavedImgs(event) {
    if (event.target.classList.contains('img-button__remove')) {
      const id = event.target.dataset.id;
      const src = await this.removeSavedImg(id);
      if (src) {
        this.clearBlobFromMemory(src);
        return;
      }
    }
  }
  onDblClickSavedImgs(event) {
    if (event.target.classList.contains('img-name')) {
      event.target.setAttribute('contenteditable', 'true');
      event.target.focus();
      return;
    }
  }
  async onFocusoutSavedImgs(event) {
    if (event.target.classList.contains('img-name')) {
      event.target.setAttribute('contenteditable', 'false');
      const id = event.target.dataset.id;
      let newName = event.target.textContent.trim();
      if (newName.length === 0) {
        newName = 'No Name';
      }
      const chekUpgrade = await this.renameSavedImg(id, newName);
      if (chekUpgrade) {
        event.target.textContent = newName;
      } else {
        const savedImg = this.state.savedImages.find(item => item.id === id);
        console.log(id, this.state, savedImg);
        const oldName = savedImg.name;
        event.target.textContent = oldName;
      }
    }
  }
  addTempImgs(imgs) {
    for (let item of imgs) {
      if (!item.type.startsWith("image")) {
        console.log(`${item.name} - это не изображение`);
        continue;
      }
      if (item.size > 2 * 1024 * 1024) {
        console.log(`${item.name} - слишком тяжелое изображение`);
        continue;
      }
      const id = this.state.nextTempId;
      const img = new Image(item, id);
      this.state.nextTempId += 1;
      if (!this.state.tempImages.find(item => item.id === id)) {
        this.state.tempImages.push(img);
        this.render.addImgToPage(img, 'temp');
      }
    }
  }
  removeTempImg(id) {
    const indexImg = this.state.tempImages.findIndex(item => item.id === id);
    const imgLi = this.render.page.sectionTempImg.querySelector(`li.img-item[data-id="${id}"]`);
    const img = imgLi.querySelector('.img-img');
    const src = img.getAttribute('src');
    this.state.tempImages.splice(indexImg, 1);
    const countImg = this.state.tempImages.length;
    this.render.removeImgNode(imgLi, 'temp', countImg);
    return src;
  }
  renameTempImg(id, newName) {
    const img = this.state.tempImages.find(item => item.id === Number(id));
    if (img) {
      img.name = newName;
    }
  }
  async saveImg(img) {
    if (!img || !img.src) {
      return;
    }
    const id = Number(img.id);
    const req = {
      method: 'PUT',
      act: 'saveImg',
      file: img,
      pos: null
    };
    try {
      const response = await connection(req);
      if (response.success) {
        const src = this.removeTempImg(id);
        const img = response.data;
        img.src = src;
        this.state.savedImages.push(img);
        this.render.addImgToPage(img, 'saved');
      }
    } catch (err) {
      console.log(`Сервер недоступен`);
    }
  }
  async renameSavedImg(id, newName) {
    if (!id || !newName) {
      return;
    }
    const img = {
      id,
      newName
    };
    const req = {
      method: 'POST',
      act: 'upgImg',
      file: img,
      pos: null
    };
    try {
      const response = await connection(req);
      if (response.success) {
        const img = response.data;
        const idSavedImg = img.id;
        const newName = img.name;
        const imgState = this.state.savedImages.find(item => item.id === idSavedImg);
        imgState.name = newName;
        return true;
      }
    } catch (err) {
      console.log(`Сервер недоступен`);
      return false;
    }
  }
  async removeSavedImg(id) {
    if (!id) {
      return;
    }
    const img = {
      id
    };
    const req = {
      method: 'POST',
      act: 'delImg',
      file: img,
      pos: null
    };
    try {
      const response = await connection(req);
      if (response.success) {
        const idSavedImg = response.data;
        const imgIndex = this.state.savedImages.findIndex(item => item.id === idSavedImg);
        const src = this.state.savedImages[imgIndex].src;
        this.state.savedImages.splice(imgIndex, 1);
        const imgLi = this.render.page.sectionSavedImg.querySelector(`li.img-item[data-id="${idSavedImg}"]`);
        const countImg = this.state.savedImages.length;
        this.render.removeImgNode(imgLi, 'saved', countImg);
        return src;
      }
    } catch (err) {
      console.log(`Сервер недоступен`);
      return false;
    }
  }
  async loadSvdImgs() {
    const req = {
      method: 'POST',
      act: 'getAllImg',
      file: null,
      pos: null
    };
    try {
      const response = await connection(req);
      if (response.success) {
        const images = response.data;
        const newImgs = await this.createBlobImgs(images);
        if (newImgs) {
          this.updateSvdImgsList(newImgs);
        }
      }
    } catch (err) {
      console.log(`Сервер недоступен`);
      return false;
    }
  }
  async createBlobImgs(images) {
    try {
      for (let item of images) {
        const img = await fetch(`${baseUrl}${item.link}`);
        const blob = await img.blob();
        const src = URL.createObjectURL(blob);
        item.src = src;
      }
      return images;
    } catch (err) {
      return false;
    }
  }
  clearBlobFromMemory(src) {
    URL.revokeObjectURL(src);
  }
  updateSvdImgsList(newImgs) {
    this.clearSvdImgsList();
    this.addNewSvdImgsList(newImgs);
  }
  clearSvdImgsList() {
    const count = this.state.savedImages.length;
    for (let i = count; i > 0; i -= 1) {
      const currentImg = this.state.savedImages.shift();
      this.clearBlobFromMemory(currentImg.src);
      const imgLi = this.render.page.sectionSavedImg.querySelector(`li.img-item[data-id="${currentImg.id}"]`);
      const countImgs = i - 1;
      this.render.removeImgNode(imgLi, 'saved', countImgs);
    }
  }
  addNewSvdImgsList(images) {
    this.state.savedImages = images;
    for (let image of this.state.savedImages) {
      this.render.addImgToPage(image, 'saved');
    }
  }
}
;// CONCATENATED MODULE: ./src/js/app.js

new AppController("#app");
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;