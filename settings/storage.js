var browser = browser || chrome;

function saveSetting(name, value) {
	let store = {};
	store[name] = value;
	browser.storage.sync.set(store);
}

function getSetting(name, callback) {
	return browser.storage.sync.get(name, callback);
}
