const createRequest = async (req) => {
	const baseUrl = 'https://ahj-lesson7-task2-backend-production.up.railway.app/';
	// const baseUrl = 'http://localhost:7070/';
	let fullUrl = `${baseUrl}?act=${req.act}`;
	
	const optionsReq = {
		method: req.method
	}	
	const reqData = new FormData();

	if(req.act === 'saveImg') {
		const imgBlob = await fetch(req.file.src);
		const img = await imgBlob.blob();
				
		reqData.append('name', req.file.name);
		reqData.append('file', img);
	}
	
	if(req.act === 'upgImg') {
		reqData.append('newName', req.file.newName);
		reqData.append('id', req.file.id);
	} 

	if(req.act === 'delImg') {
		reqData.append('id', req.file.id);
	}

	optionsReq.body = reqData;

	try {
		const resp = await fetch(fullUrl, optionsReq)
		const data = await resp.json();

		return data;
	} catch(err) {
		console.log(`Сервер недоступен`)
	}
// получить список 'query=getAllImg' 
// сохранить новые изображения (массив объектов) 'query=saveImg'

// удалить изображение 'query=delImg'
// переместить 'query=sortImg'

}

export default createRequest