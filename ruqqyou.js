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
						commentText.parentNode.parentNode.outerHTML = '<p>[Removed by Ruqqyou for containing filtered word]</p>';
						
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
						posts[i].innerHTML = '<p>[Removed by Ruqqyou for containing filtered word]</p>';
						
						continue checkPosts;
					}
				}
				for (const postText of postTexts) {
					for (const bw of badwordsList) {
						if (postText.innerHTML.toLowerCase().includes(bw.toLowerCase())) {
							posts[i].innerHTML = '<p>[Removed by Ruqqyou for containing filtered word]</p>';
							
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
		
		let modals = document.getElementsByClassName('card-title');
		for (const modal of modals) {
			let modalname = modal.getAttribute('href').substring(2);
			for (const bg of bannedGuilds) {
				if (modalname.toLowerCase() === bg.toLowerCase()) {
					let elem = modal.parentNode.parentNode.parentNode.parentNode;
					elem.parentNode.removeChild(elem);
				}
			}
		}
	});
}

function setPageBanned(name) {
	document.body.id = 'frontpage';
	let newHTML = '<div class="row justify-content-around" id="main-content-row"><div class="col h-100 " id="main-content-col"><div class="row justify-content-center"><div class="col-10 col-md-5"><div class="text-center px-3 my-8"><span class="fa-stack fa-5x text-muted mb-5"><i class="fad fa-chess-rook fa-stack-1x"></i><i class="far text-danger fa-ban fa-stack-2x"></i></span><h1 class="h5">+' + name + ' is banned.</h1><p class="text-muted mb-5">Reason: Blocked by Ruqqyou.</p><div><a href="/" class="btn btn-primary">Go to frontpage</a></div></div></div></div></div></div>';
	document.getElementsByClassName('container-fluid')[1].outerHTML = newHTML;
	// the list is live, so since we removed the previous element we're still at index of 1 for the next one
	let elem = document.getElementsByClassName('container-fluid')[1];
	if (elem) {
		elem.parentNode.removeChild(elem);
	}
}

function setPageUserBanned(name) {
	let newHTML = '<div class="row justify-content-around" id="main-content-row"><div class="col h-100 custom-gutters" id="main-content-col"><div class="row no-gutters"><div class="col-12"><div class="text-center py-7 py-md-8"><span class="fa-stack fa-2x text-muted mb-4"><i class="fas fa-square text-danger opacity-25 fa-stack-2x"></i><i class="fas text-danger fa-user-slash fa-stack-1x text-lg"></i></span><h2 class="h5">@' + name + ' is banned</h2><p class="text-muted">This account has been suspended from Ruqqus.</p><p class="text-small text-muted"><span class="font-weight-bold">Reason:</span> Blocked by Ruqqyou.</p></div></div></div></div></div>';
	document.getElementsByClassName('container-fluid')[1].outerHTML = newHTML;
	let elem = document.getElementsByClassName('container-fluid')[1];
	elem.parentNode.removeChild(elem);
}

function blockPage(url) {
	if (url.startsWith('/+')) {
		getSetting('bannedguilds', (result) => {
			if (result === undefined || result.bannedguilds === '') {
				return;
			}
			
			var bannedGuilds = result.bannedguilds.split('\n');
			let guildName = url.split('/')[1].substring(1);
			for (const bg of bannedGuilds) {
				if (guildName.toLowerCase() === bg.toLowerCase()) {
					setPageBanned(guildName);
					return;
				}
			}
		});
	} else if (url.startsWith('/@')) {
		getSetting('blocks', (result) => {
			if (result === undefined || result.blocks === '') {
				return;
			}
			
			var blocks = result.blocks.split('\n');
			let username = url.split('/')[1].substring(1);
			for (const block of blocks) {
				if (username.toLowerCase() === block.toLowerCase()) {
					setPageUserBanned(username);
				}
			}
		});
	} else {
		// not an elegant way to get the guild name, but ruqqus has a lack of html info so it's the only way for now
		let guildBanner = document.getElementsByClassName('guild-border-top')[0];
		if (guildBanner) {
			let guildName = guildBanner.getElementsByTagName('a')[0].getAttribute('href').substring(2)
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
}

function filterUsers() {
	getSetting('blocks', (result) => {
		if (result === undefined || result.blocks === '') {
			return;
		}
		
		var blocks = result.blocks.split('\n');
		
		let posts = document.getElementsByClassName('card');
		checkUserPosts:
		for (let i = posts.length - 1; i >= 0; i--) {
			let unElement = posts[i].getElementsByClassName('user-name')[0];
			if (!unElement) {
				continue checkUserPosts;
			}
			let username = unElement.innerHTML;
			for (const block of blocks) {
				if (username.toLowerCase() === block.toLowerCase()) {
					posts[i].innerHTML = '<p>[You are blocking this user]</p>';
				}
			}
		}
		let comments = document.getElementsByClassName('comment');
		checkUserComments:
		for (let i = comments.length - 1; i >= 0; i--) {
			let unElement = comments[i].getElementsByClassName('user-name')[0];
			if (!unElement) {
				continue checkUserComments;
			}
			let username = unElement.innerHTML;
			for (const block of blocks) {
				if (username.toLowerCase() === block.toLowerCase()) {
					comments[i].innerHTML = '<p>[You are blocking this user with Ruqqyou]</p>';
				}
			}
		}
	});
}

window.addEventListener('DOMContentLoaded', (event) => {
	blockPage(location.pathname);
	filterBadwords();
	filterGuilds();
	filterUsers();
});
