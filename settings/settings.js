document.body.onload = () => {
	let submits = document.getElementsByClassName('submit');
	for (const submit of submits) {
		let name = submit.getAttribute('name');
		getSetting(name, (result) => {
			let savedValue = result[name];
			if (savedValue === undefined) {
				savedValue = '';
			}
			document.getElementById(name).value = savedValue;
		});
	}
}

Array.from(document.getElementsByClassName('submit')).forEach((button) => {
	button.onclick = (e) => {
		e.preventDefault();
		let name = e.target.getAttribute('name');
		saveSetting(name, document.getElementById(name).value);
	}
});
