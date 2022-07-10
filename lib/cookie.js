import Cookies from 'js-cookie';

/*
	set('testName', 'testValue');
*/
const set = (key, value) => {
	if(!key || !value) {
		console.error('"key" or "value" is not defined');
		return;
	}

	const options = {
		path: '/',
		sameSite: 'strict'
	};

	Cookies.set(key, value, options);
};

/*
	get();
	get('testName');
*/
const get = (key) => {
	if(!key) {
		console.error('"key" is not defined');
		return;
	}

	return (key ? Cookies.get(key) : Cookies.get());
};

/*
	remove('testName');
*/
const remove = (key) => {
	if(!key) {
		console.error('"key" is not defined');
		return;
	}

	const options = {
		path: '/'
	};

	Cookies.remove(key, options);
};

module.exports = {
	set,
	get,
	remove
};