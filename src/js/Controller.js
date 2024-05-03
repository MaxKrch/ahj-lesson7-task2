import Render from './Render';
import State from './State';
import Image from './Image';

// const baseUrl = 'https://ahj-lesson7-task2-backend-production.up.railway.app';
const baseUrl = 'http://192.168.1.104:7070';

import createRequest from './connection';

export default class AppController {
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

	onClickLoadSvdImgs (event) {
		const savedImgs = this.loadSvdImgs();
	}

	async onClickSaveTmpImg(event) {
		if(!this.state.tempImages) {
			return;
		}
		const images = this.state.tempImages.slice()
		for(let img of images) {
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
			this.clearBlobFromMemory(src)
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
		if(event.target.classList.contains('img-name')) {
			event.target.setAttribute('contenteditable', 'true');
			event.target.focus();
			return;
		}
	}

	onFocusoutTempImgs(event) {
		if(event.target.classList.contains('img-name')) {
			event.target.setAttribute('contenteditable', 'false');

			const id = event.target.dataset.id;

			let newName = event.target.textContent.trim();

			if(newName.length === 0) {
				newName = 'No Name';
			} 
			
			event.target.textContent = newName;

			this.renameTempImg(id, newName);
			return;
		}
	}

	async onClickSavedImgs(event) {
		if(event.target.classList.contains('img-button__remove')) {
			const id = event.target.dataset.id;
			const src = await this.removeSavedImg(id);
			if(src) {
				this.clearBlobFromMemory(src)
				return;
			}
		}
	}

	onDblClickSavedImgs(event) {
		if(event.target.classList.contains('img-name')) {
			event.target.setAttribute('contenteditable', 'true');
			event.target.focus();
			return;
		}
	}

	async onFocusoutSavedImgs(event) {
		if(event.target.classList.contains('img-name')) {
			event.target.setAttribute('contenteditable', 'false');

			const id = event.target.dataset.id;

			let newName = event.target.textContent.trim();

			if(newName.length === 0) {
				newName = 'No Name';
			} 
			
			const chekUpgrade = await this.renameSavedImg(id, newName);
		
			if(chekUpgrade) {
				event.target.textContent = newName;
			} else {
				const savedImg = this.state.savedImages.find(item => item.id === id);
				console.log(id, this.state, savedImg)
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

			if(item.size > 2 * 1024 * 1024) {
				console.log(`${item.name} - слишком тяжелое изображение`);
				continue;
			}

			const id = this.state.nextTempId;
			const img = new Image(item, id);
			this.state.nextTempId += 1;
			
			if(!this.state.tempImages.find(item => item.id === id)) {
				this.state.tempImages.push(img);
				this.render.addImgToPage(img, 'temp');
			}
		}
	}

	removeTempImg(id) {
		const indexImg = this.state.tempImages.findIndex((item) => item.id === id);
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

		if(img) {
			img.name = newName;
		}
	}

	async saveImg(img) {
		if(!img || !img.src) {
			return;
		}
	
		const id = Number(img.id)

		const req = {
			method: 'PUT',
			act: 'saveImg',
			file: img,
			pos: null
		}
	
		try {
			const response = await createRequest(req);

			if(response.success) {
				const src = this.removeTempImg(id);
				const img = response.data;
				img.src = src;
			
				this.state.savedImages.push(img);
				this.render.addImgToPage(img, 'saved');
			}
		} catch (err) {
			console.log(`Сервер недоступен`)
		}
	}

	async renameSavedImg(id, newName) {
		if(!id || !newName) {		
			return;
		}

		const img = {
			id,
			newName
		}
		
		const req = {
			method: 'POST',
			act: 'upgImg',
			file: img,
			pos: null
		}
		
		try {
			const response = await createRequest(req);
		
			if(response.success) {
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
		if(!id) {		
			return;
		}

		const img = {
			id
		}
		
		const req = {
			method: 'POST',
			act: 'delImg',
			file: img,
			pos: null
		}
		
		try {
			const response = await createRequest(req);
	
			if(response.success) {
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
		}

		try {
			const response = await createRequest(req);

			if(response.success) {
				const images = response.data;
				const newImgs = await this.createBlobImgs(images)
				if(newImgs) {
					this.updateSvdImgsList(newImgs)
				}
			} 
		} catch(err) {
			console.log(`Сервер недоступен`);
			return false;
		}
	}

	async createBlobImgs(images) {
		try {
			for(let item of images) {
				const img = await fetch(`${baseUrl}${item.link}`)
	 			const blob = await img.blob();
	 			const src = URL.createObjectURL(blob)
	 		 	item.src = src;
			}
		 	return images;
		} catch(err) {
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
		
		for(let i = count; i > 0; i -= 1) {
			const currentImg = this.state.savedImages.shift();

			this.clearBlobFromMemory(currentImg.src);
			const imgLi = this.render.page.sectionSavedImg.querySelector(`li.img-item[data-id="${currentImg.id}"]`);	
			const countImgs = i - 1;	
			this.render.removeImgNode(imgLi, 'saved', countImgs);
		}
	}

	addNewSvdImgsList(images) {
		this.state.savedImages = images;
		for(let image of this.state.savedImages) {
			this.render.addImgToPage(image, 'saved');
		}		
	}
}
