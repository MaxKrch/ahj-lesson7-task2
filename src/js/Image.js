export default class Image {
	constructor(img, id) {
		this.id = id;
		this.name;
		this.ext;
		this.src;

		this.createINewImg(img); 
	}

	createINewImg(img) {
		const indexLastDot = img.name.lastIndexOf('.');
		const name = (indexLastDot > -1) ? img.name.slice(0, indexLastDot) : img.name;
			const ext = (indexLastDot > -1) ? img.name.slice((indexLastDot + 1), img.name.length) : '';

		const src = URL.createObjectURL(img);
		
		if(!src) {
			return;
		}
	
		this.name = name;
		this.ext = ext;
		this.src = src;
	}
}
