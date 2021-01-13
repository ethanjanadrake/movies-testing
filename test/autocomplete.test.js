// this will allow us to check to see if a test worked every certain interval, and then fail it after a certain amount of time
const waitFor = (selector) => {
	return new Promise((resolve, reject) => {
		const interval = setInterval(() => {
			if (document.querySelector(selector)) {
				clearInterval(interval);
				clearTimeout(timeout);
				resolve();
			}
		}, 30);

		const timeout = setTimeout(() => {
			clearInterval(interval);
			reject();
		}, 2000);
	});
};

// will be executed before each it statement (mocha)
beforeEach(() => {
	document.querySelector('#target').innerHTML = '';
	createAutoComplete({
		root         : document.querySelector('#target'),
		fetchData() {
			return [
				{ Title: 'Avengers' },
				{ Title: 'Not Avengers' },
				{ Title: 'Some Other Movie' }
			];
		},
		renderOption(movie) {
			return movie.Title;
		}
	});
});

it('Dropdown starts closed', () => {
	const dropdown = document.querySelector('.dropdown');

	// using chai (look for inserted script in the test.html)
	expect(dropdown.className).not.to.include('is-active');
});

it('After searching, dropdown opens up', async () => {
	const input = document.querySelector('input');
	input.value = 'avengers';
	// dispatchEvent is used to fake an event because if we just use js to set a value it doesn't count as an event in the browser
	input.dispatchEvent(new Event('input'));

	await waitFor('.dropdown-item');

	const dropdown = document.querySelector('.dropdown');

	expect(dropdown.className).to.include('is-active');
});

it('After searching, displays some results', async () => {
	const input = document.querySelector('input');
	input.value = 'avengers';
	input.dispatchEvent(new Event('input'));

	await waitFor('.dropdown-item');

	const items = document.querySelectorAll('.dropdown-item');

	expect(items.length).to.equal(3);
});
