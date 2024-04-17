import Render from "./Render";
import State from "./State";

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
		this.render.addImgListener("change", this.onChangeAddImgs.bind(this));
		this.render.addImgListener("dragover", this.onDragoverAddImgs.bind(this));
		this.render.addImgListener("drop", this.onDropAddImgs.bind(this));
		this.render.addTempImgListener("click", this.onClickTempImgs.bind(this));
	}

	onChangeAddImgs(event) {
		const newFiles = event.currentTarget.files;

		this.addNewImgs(newFiles);
	}

	addNewImgs(imgs) {
		for (let item of imgs) {
			if (!item.type.startsWith("image")) {
				continue;
			}

			const src = URL.createObjectURL(item);
			const img = {
				id: this.state.nextTempId,
				name: item.name,
				src,
			};

			this.state.tempImages.push(img);
			this.state.nextTempId += 1;

			this.render.addTempImg(img);
		}
	}

	onDragoverAddImgs(event) {
		if (event.target.closest(".add-img__drag-area")) {
			this.render.activeDropArea();
		} else {
			this.render.disableDropArea();
		}
	}

	onDropAddImgs(event) {
		this.render.disableDropArea();
		const files = event.dataTransfer.files;
		if (files) {
			this.addNewImgs(files);
		}
	}

	onClickTempImgs(event) {
		if (event.target.classList.contains("img-button__cancel")) {
			this.removeImg(event.target);
			return;
		}

		if (event.target.classList.contains("img-button__save")) {
			this.saveImg(event.target);
			return;
		}
	}

	removeImg(button) {
		const id = Number(button.dataset.id);
		const indexImg = this.state.tempImages.indexOf((item) => item.id === id);
		const img = button.closest("li.img-item");

		this.state.tempImages.splice(indexImg, 1);

		const countImg = this.state.tempImages.length;
		this.render.removeImgNode(img, countImg);
	}

	saveImg() {
		return;
	}
}
