const start = () => {
	const body = document.getElementsByTagName('body')[0];

	body.classList.add('wait');
};

const end = () => {
	const body = document.getElementsByTagName('body')[0];

	body.classList.remove('wait');
};

module.exports = {
	start,
	end
};