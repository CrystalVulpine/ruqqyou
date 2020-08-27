function filterBadwords() {
	getSetting('badwords', (result) => {
		if (result === undefined || result.badwords === '') {
			return;
		}
		
		var badwordsList = result.badwords.split('\n');
		
		let comments = document.getElementsByClassName('comment-text');
		checkComments:
		for (let i = comments.length - 1; i >= 0; i--) {
			let commentTexts = comments[i].getElementsByTagName('p');
			for (const commentText of commentTexts) {
				for (const bw of badwordsList) {
					if (commentText.innerHTML.toLowerCase().includes(bw.toLowerCase())) {
						commentText.parentNode.parentNode.outerHTML = '<p>[Removed for containing filtered word]</p>';
						
						continue checkComments;
					}
				}
			}
		}
		
		let posts = document.getElementsByClassName('card');
		checkPosts:
		for (let i = posts.length - 1; i >= 0; i--) {
			if (posts[i].id.startsWith('post-')) {
				let postTexts = posts[i].getElementsByTagName('p');
				let postTitle = posts[i].getElementsByClassName('post-title')[0];
				for (const bw of badwordsList) {
					if (postTitle.innerHTML.toLowerCase().includes(bw.toLowerCase())) {
						posts[i].innerHTML = '<p>[Removed for containing filtered word]</p>';
						
						continue checkPosts;
					}
				}
				for (const postText of postTexts) {
					for (const bw of badwordsList) {
						if (postText.innerHTML.toLowerCase().includes(bw.toLowerCase())) {
							posts[i].innerHTML = '<p>[Removed for containing filtered word]</p>';
							
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
		// it's i += 2 because there's an extra a element in the post; this may need to change
		for (const gn of guildNames) {
			let guildName = gn.getAttribute('href').substring(2);
			for (const bg of bannedGuilds) {
				if (guildName.toLowerCase() === bg.toLowerCase()) {
					let postElement = gn.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
					postElement.parentNode.removeChild(postElement);
					
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
			
			for (const bg of bannedGuilds) {
				let urlParts = url.split('/');
				let guildName = urlParts[1].substring(1);
				if (guildName.toLowerCase() === bg.toLowerCase()) {
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
			
			for (const bg of bannedGuilds) {
				if (guildName.toLowerCase() === bg.toLowerCase()) {
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
