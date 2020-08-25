document.body.onload = () => {
	getSetting('badwords', (result) => {
		document.getElementById('badwords').value = result.badwords;
	});
}

document.getElementById('badwords-submit').onclick = (e) => {
	e.preventDefault();
	saveSetting('badwords', document.getElementById('badwords').value);
}
