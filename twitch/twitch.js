document.addEventListener("DOMContentLoaded", () => {
	async function main() {
		const streamers = [
			{ name: "ESL_SC2", filters: ["all"] },
			{ name: "OgamingSC2", filters: ["all"] },
			{ name: "cretetion", filters: ["all"] },
			{ name: "habathcx", filters: ["all"] },
			{ name: "freecodecamp", filters: ["all"] },
			{ name: "storbeck", filters: ["all"] },
			{ name: "RobotCaleb", filters: ["all"] },
			{ name: "noobs2ninjas", filters: ["all"] }
		];
		let timeout;
		let selector = "all";
		let loadingScreenProgress = 0;
		
		for(let i = 0; i < streamers.length; i++) {
			document.querySelector("#display").innerHTML = `
				<div id="loading-screen">
					<i class="fa-solid fa-spinner"></i>
					LOADING ${(loadingScreenProgress / streamers.length * 100).toFixed()}%
				</div>
			`;
			
			loadingScreenProgress++;
			
			let res = await fetch(`https://twitch-proxy.freecodecamp.rocks/twitch-api/channels/${streamers[i].name}`);
			const channelData = await res.json();
			res = await fetch(`https://twitch-proxy.freecodecamp.rocks/twitch-api/streams/${streamers[i].name}`);
			const streamData = await res.json();
			
			streamers[i].logo = channelData.logo;
			streamers[i].url = channelData.url;
			streamers[i].game = channelData.game;
			streamers[i].stream = streamData.stream;
			
			if(channelData.status) {
				if(channelData.status.length > 50) {
					streamers[i].status = channelData.status.split('').slice(0, 51).concat(['.', '.', '.']).join('');
				} else {
					streamers[i].status = channelData.status;
				}
			}
		}

		loadingScreenStop();
		showStreamers();
	
		document.querySelector("#btns").style.marginLeft = `${Number(window.getComputedStyle(document.querySelector("#top")).width.split("px")[0]) - 90}px`;
		
		window.addEventListener("resize", () => {
			document.querySelector("#btns").style.marginLeft = `${Number(window.getComputedStyle(document.querySelector("#top")).width.split("px")[0]) - 90}px`;
		});
		
		Array.from(document.querySelectorAll(".btn")).forEach((item, index) => {
			item.addEventListener("click", () => {
				Array.from(document.querySelectorAll(".btn")).forEach((item, index) => {
					if(Array.from(document.querySelectorAll(".btn-txt"))[index].innerHTML.toLowerCase() === selector) {
						item.style.marginLeft = "4rem";
						hideBtn(selector);
					}
				});
				
				selector = Array.from(document.querySelectorAll(".btn-txt"))[index].innerHTML.toLowerCase();
				item.style.marginLeft = "0";
				showBtn(selector);
				showStreamers();
			});
			
			item.addEventListener("mouseenter", () => {
				if(selector !== Array.from(document.querySelectorAll(".btn-txt"))[index].innerHTML.toLowerCase()) {
					item.style.marginLeft = "0";
					showBtn(Array.from(document.querySelectorAll(".btn-txt"))[index].innerHTML.toLowerCase());
				}
			});
			
			item.addEventListener("mouseleave", () => {
				if(selector !== Array.from(document.querySelectorAll(".btn-txt"))[index].innerHTML.toLowerCase()) {
					item.style.marginLeft = "4rem";
					hideBtn(Array.from(document.querySelectorAll(".btn-txt"))[index].innerHTML.toLowerCase());
				}
			});
		});
		
		
		
		
		
		function showBtn(selector) {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				document.querySelector(`#${selector}-btn-txt`).style.display = "block";
			}, 400);
		}
		
		
		
		
		
		function hideBtn(selector) {
			clearTimeout(timeout);
			document.querySelector(`#${selector}-btn-txt`).style.display = 'none';
		}





		function showStreamers() {
			document.querySelector("#display").innerHTML = '';

			for(let i = 0; i < streamers.length; i++) {
				if(!streamers[i].stream) {
					if(streamers[i].filters.indexOf("online") !== -1) {
						streamers[i].filters.splice(streamers[i].filters.indexOf("online"), 1);
					}
					
					if(streamers[i].filters.indexOf("offline") === -1) {
						streamers[i].filters.push("offline");
					}

					if(streamers[i].filters.includes(selector)) {
						document.querySelector("#display").innerHTML += `
							<div class="display ${streamers[i].filters.join(' ')}">
								<img alt="logo" src="${streamers[i].logo}" />
								<div class='a'>
									<a target='_blank' href="${streamers[i].url}">${streamers[i].name}</a>
								</div>
								<div class='p'>
									<p>Offline</p>
								</div>
							</div>
						`;
					}
				} else {
					if(streamers[i].filters.indexOf("online") === -1) {
						streamers[i].filters.push("online");
					}
					
					if(streamers[i].filters.indexOf("offline") !== -1) {
						streamers[i].filters.splice(streamers[i].filters.indexOf("offline"), 1);
					}
					
					if(streamers[i].filters.includes(selector)) {
						document.querySelector("#display").innerHTML += `
							<div class="display ${streamers[i].filters.join(' ')}">
								<img alt="logo" src="${streamers[i].logo}" />
								<div class='a'>
									<a target='_blank' href="${streamers[i].url}">${streamers[i].name}</a>
								</div>
								<div class='p'>
									<p>${streamers[i].game}<span class="status">: ${streamers[i].status}</span></p>
								</div>
							</div>
						`;
					}
				}

				if(streamers[i].filters.includes("online")) {
					Array.from(document.querySelectorAll(".display a")).map((item, index) => {
						if(item.innerText === streamers[i].name) {
							Array.from(document.querySelectorAll(".display"))[index].style.backgroundColor = "#A1B674";
							item.style.color = "#747DB6";
							Array.from(document.querySelectorAll(".display p"))[index].style.color = "#84776F";
						}
					});
				} else if(streamers[i].filters.includes("offline")) {
					Array.from(document.querySelectorAll(".display a")).map((item, index) => {
						if(item.innerText === streamers[i].name) {
							Array.from(document.querySelectorAll(".display"))[index].style.backgroundColor = "#747DB6";
							item.style.color = "#A1B674";
							Array.from(document.querySelectorAll(".display p"))[index].style.color = "#A5B1FF";
						}
					});
				}
			}
		}





		function loadingScreenStop() {
			document.querySelector("#display").innerHTML = ``;
		}
	}





	main();
});
