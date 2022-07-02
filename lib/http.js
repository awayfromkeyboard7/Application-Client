import Wait from './wait';

/*
	await fetch({
		url: 'http://localhost:7070',
		method: 'POST',
		body: {},
		token: ~~~
	}, true);
*/
const _fetch = async (obj, waitCursor = true) => {
	if(!obj.url || !obj.method) {
		throw new Error('"url" or "method" is not defined');
	}

	const options = {
		method: obj.method.toUpperCase(),
		headers: {
			'Content-Type': 'application/json',
      'Authorization': 'Basic ' + Buffer.from('admin:Enterphin1!', 'binary').toString('base64'),
			...(obj.token) && {'x-access-token': obj.token}
		},
		...(obj.body) && {body: JSON.stringify(obj.body)}
	};

	if(waitCursor) {
		Wait.start();
	}

	return await fetch(obj.url, options).then((res) => {
		if(waitCursor) {
			Wait.end();
		}
		return res.json();
	});
};

const defaultFetch = async (url, options) => {
	return await fetch(url, options).then((res) => {
		return res.json();
	});
};

module.exports = {
	fetch: _fetch,
  defaultFetch: defaultFetch
};