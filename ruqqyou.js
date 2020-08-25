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

window.addEventListener('DOMContentLoaded', (event) => {
	filterBadwords();
});
