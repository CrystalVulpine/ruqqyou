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
	
	let checkboxes = document.getElementsByClassName('checkbox');
	for (const checkbox of checkboxes) {
		let name = checkbox.getAttribute('name');
		getSetting(name, (result) => {
			let savedValue = result[name];
			if (savedValue === 'true') {
				checkbox.checked = true;
			} else {
				checkbox.checked = false;
			}
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

Array.from(document.getElementsByClassName('checkbox')).forEach((checkbox) => {
	checkbox.onclick = (e) => {
		saveSetting(checkbox.getAttribute('name'), checkbox.checked.toString());
	}
});
