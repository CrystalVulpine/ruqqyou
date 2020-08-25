function filterBadwords() {
	getSetting('badwords', (result) => {
		if (result === undefined || result.badwords === '') {
			return;
		}
		
		var badwordsList = result.badwords.split('\n');
		
		let comments = document.getElementsByClassName('comment-text');
		checkComments:
		for (let i = 0; i < comments.length; i++) {
			let commentTexts = comments[i].getElementsByTagName('p');
			for (let k = 0; k < commentTexts.length; k++) {
				for (let j = 0; j < badwordsList.length; j++) {
					if (commentTexts[k].innerHTML.toLowerCase().includes(badwordsList[j].toLowerCase())) {
						commentTexts[k].parentNode.parentNode.outerHTML = '<p>[Removed for containing filtered word]</p>';
						
						// getElementsByClassName() returns a live list, so we have to compensate for the comment element being removed.
						i = i - 1;
						continue checkComments;
					}
				}
			}
		}
		
		let posts = document.getElementsByClassName('card');
		checkPosts:
		for (let i = 0; i < posts.length; i++) {
			if (posts[i].id.startsWith('post-')) {
				let postTexts = posts[i].getElementsByTagName('p');
				let postTitle = posts[i].getElementsByClassName('post-title')[0];
				for (let j = 0; j < badwordsList.length; j++) {
					if (postTitle.innerHTML.toLowerCase().includes(badwordsList[j].toLowerCase())) {
						postTitle.parentNode.parentNode.outerHTML = '<p>[Removed for containing filtered word]</p>';
						
						// the post element is not removed like the comment, so we don't have to subtract from the index here
						continue checkPosts;
					}
				}
				for (let k = 0; k < postTexts.length; k++) {
					for (let j = 0; j < badwordsList.length; j++) {
						if (postTexts[k].innerHTML.toLowerCase().includes(badwordsList[j].toLowerCase())) {
							postTexts[k].parentNode.parentNode.parentNode.outerHTML = '<p>[Removed for containing filtered word]</p>';
							
							continue checkPosts;
						}
					}
				}
			}
		}
	});
}

function filterGuilds() {
	getSetting('bannedguilds', (result) => {
		if (result === undefined || result.bannedguilds === '') {
			return;
		}
		
		var bannedGuilds = result.bannedguilds.split('\n');
		
		let guildNames = document.querySelectorAll('.post-meta-guild a');
		checkPostGuilds:
		for (let i = 0; i < guildNames.length; i++) {
			let guildName = guildNames[i].getAttribute('href').substring(2);
			for (let j = 0; j < bannedGuilds.length; j++) {
				if (guildName.toLowerCase() === bannedGuilds[j].toLowerCase()) {
					let postElement = guildNames[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
					postElement.parentNode.removeChild(postElement);
					
					i = i - 1;
					continue checkPostGuilds;
				}
			}
		}
	});
}

function setPageBanned(name) {
	var newHTML = '<div class="row justify-content-around" id="main-content-row"><div class="col h-100 " id="main-content-col"><div class="row justify-content-center"><div class="col-10 col-md-5"><div class="text-center px-3 my-8"><span class="fa-stack fa-5x text-muted mb-5"><i class="fad fa-chess-rook fa-stack-1x"></i><i class="far text-danger fa-ban fa-stack-2x"></i></span><h1 class="h5">+' + name + ' is banned.</h1><p class="text-muted mb-5">Reason: Blocked by Ruqqyou</p><div><a href="/" class="btn btn-primary">Go to frontpage</a></div></div></div></div></div></div>';
	document.getElementById('main-content-row').outerHTML = newHTML;
	document.getElementsByClassName('container-fluid')[0].outerHTML = newHTML;
	
	let navbar = document.getElementById('navbar');
	if (navbar !== undefined) {
		navbar.parentNode.removeChild(navbar);
	}
}

function blockPage(url) {
	if (url.startsWith('/+')) {
		getSetting('bannedguilds', (result) => {
			if (result === undefined || result.bannedguilds === '') {
				return;
			}
			
			var bannedGuilds = result.bannedguilds.split('\n');
			
			for (let j = 0; j < bannedGuilds.length; j++) {
				let urlParts = url.split('/');
				let guildName = urlParts[1].substring(1);
				if (guildName.toLowerCase() === bannedGuilds[j].toLowerCase()) {
					setPageBanned(guildName);
					return;
				}
			}
		});
	} else {
		// not an elegant way to get the guild name, but ruqqus has a lack of html info so it's the only way for now
		let guildName = document.getElementsByClassName('guild-border-top')[0].getElementsByTagName('a')[0].getAttribute('href').substring(2);
		getSetting('bannedguilds', (result) => {
			if (result === undefined || result.bannedguilds === '') {
				return;
			}
			
			var bannedGuilds = result.bannedguilds.split('\n');
			
			for (let j = 0; j < bannedGuilds.length; j++) {
				if (guildName.toLowerCase() === bannedGuilds[j].toLowerCase()) {
					setPageBanned(guildName);
					return;
				}
			}
		});
	}
}

window.addEventListener('DOMContentLoaded', (event) => {
	blockPage(location.pathname);
	filterBadwords();
	filterGuilds();
});
