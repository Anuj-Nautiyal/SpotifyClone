// let currentSong = new Audio();
// let songs;
// let currFolder;
// let musicLibrary;

// function formatTime(time) {
//     if (!isFinite(time) || time < 0) return "00:00";
//     let seconds = Math.floor(time);
//     let mins = Math.floor(seconds / 60);
//     let secs = seconds % 60;
//     return String(mins).padStart(2, '0') + ":" + String(secs).padStart(2, '0');
// }

// async function getsongs(folder) {
//     currFolder = folder;
//     let a = await fetch(`${currFolder}/`);
//     let response = await a.text();
//     // console.log(response.replaceAll("%5C", "/"));
//     const album = musicLibrary.albums.find(e => e.folder === currFolder);
//     if(album) {
//         songs = album.songs;

//     let div = document.createElement("div");
//     div.innerHTML = response.replaceAll("%5C", "/");

//     let as = div.getElementsByTagName("a");
    
//     songs = [];
//     for (let index = 0; index < as.length; index++) {
//         const element = as[index];
//         if (element.href.endsWith(".mp3")) {
//             songs.push(element.href.split(`${currFolder}/`)[1].split(".mp3")[0]);
//         }
//     }

//     console.log(songs);
//     //show all the songs in the playlist
//     let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
//     songUL.innerHTML = "";
//     for (const song of songs) {
//         songUL.innerHTML = songUL.innerHTML + `<li><img src="svgs/music.svg" alt="">
//         <div class="songnames">
//         <div>${song.replaceAll("%20", " ")}</div>
//         <div></div>
//         </div>
//         <div class="playnow">
//         <span>Play Now</span>
//         <img src="svgs/playnow.svg" alt="">
//         </div> </li>`;
//     }
//     //to play music when click on the list items
//     Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
//         e.addEventListener("click", element => {
//             playMusic(e.querySelector(".songnames").firstElementChild.innerHTML.trim(), true);
//         })
//     });
//     return songs;
// }

// const playMusic = (track, pause = false) => {
//     currentSong.src = `${currFolder}/` + track + ".mp3";
//     if (pause) {
//         play.src = "svgs/songplay.svg";
//         document.querySelector(".circle").style.left = 0;
//     } 
//     document.querySelector(".songtrack").innerHTML = decodeURI(track);
//     document.querySelector(".songduration").innerHTML = "00:00 / 00:00";

// }

// async function displayAlbums() {
//     let a = await fetch("Songs/");
//     let response = await a.text();
    
//     let div = document.createElement("div");
//     div.innerHTML = response.replaceAll("%5C", "/");
//     let anchors = div.getElementsByTagName("a");

//     let cardcontainer = document.querySelector(".cardcontainer");
//     let array = Array.from(anchors);
//     for (let index = 0; index < array.length; index++) {
//         const e = array[index];
//         if (e.href.includes("/Songs/")) {
//             let songFolder = e.href.split("/Songs/")[1].replace("/", "");

//             let a = await fetch(`Songs/${songFolder}/info.json`);
//             let response = await a.json();

//             cardcontainer.innerHTML = cardcontainer.innerHTML +   
//             `<div data-folder="${songFolder}" class="cards">
//                 <div class="cardimage">
//                     <img src="Songs/${songFolder}/coverpage.jpg" alt="">
//                 </div>

//                 <div class="play">
//                     <img src="svgs/play_button.svg" alt="">
//                 </div>
//                 <p>${response.title}</p>
//                 <p>${response.description}</p>
//             </div>`
//         };
//     }
//     Array.from(document.getElementsByClassName("cards")).forEach(item => {
//         item.addEventListener("click", async e => {
//             songs = await getsongs(`Songs/${e.currentTarget.dataset.folder}`);
//             playMusic(songs[0], true);
//         });
//     });
// }

// async function main() {

//     //get songs from first song folder and show it in the playlist
//     await getsongs("Songs/Arijit");
//     playMusic(songs[0], true);

//     //display all the albums on the website
//     displayAlbums();

//     play.addEventListener("click", () => {
//         if (currentSong.paused) {
//             currentSong.play();
//             play.src = "svgs/pause.svg";
//         }
//         else {
//             currentSong.pause();
//             play.src = "svgs/songplay.svg";
//         }
//     });

//     const songdurationEl = document.querySelector(".songduration");
//     currentSong.addEventListener("loadedmetadata", () => {
//         if (songdurationEl) {
//             songdurationEl.textContent = `00:00 / ${formatTime(currentSong.duration)}`;
//         }
//     });

//     currentSong.addEventListener("timeupdate", () => {
//         document.querySelector(".songduration").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
//         document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
//     });

//     const seekbarEl = document.querySelector(".seekbar");
//     const circleEl = document.querySelector(".circle");

//     seekbarEl.addEventListener("click", e => {
//         const rect = seekbarEl.getBoundingClientRect();
//         const offsetX = e.clientX - rect.left;
//         const fraction = offsetX / seekbarEl.offsetWidth;


//         if (!isNaN(currentSong.duration)) {
//             currentSong.currentTime = fraction * currentSong.duration;
//             const percent = fraction * 100;
//             circleEl.style.left = percent + "%";
//         }
//     });

//     document.querySelector(".hamburger-img").addEventListener("click", () => {
//         document.querySelector(".leftbox").style.left = "0";
//     });

//     document.querySelector(".close").addEventListener("click", () => {
//         document.querySelector(".leftbox").style.left = "-100%";
//     });

//     previous.addEventListener("click", () => {
//         let index = songs.indexOf(currentSong.src.split(`${currFolder}/`)[1].split(".mp3")[0]);
//         if ((index - 1) >= 0) {
//             playMusic(songs[index - 1], true);
//         } else {
//             playMusic(songs[songs.length - 1], true);
//         }
//     });

//     next.addEventListener("click", () => {
//         let index = songs.indexOf(currentSong.src.split(`${currFolder}/`)[1].split(".mp3")[0]);
//         if ((index + 1) < songs.length) {
//             playMusic(songs[index + 1], true);
//         } else {
//             playMusic(songs[0], true);
//         }
//     });

//     let tooltip = document.querySelector(".tooltip");
//     document.querySelector(".range").querySelector("input[type = range]").addEventListener("change", (e) => {
//         currentSong.volume = parseInt(e.target.value) / 100;
//         tooltip.textContent = e.target.value;
//     });

//     let mute = document.getElementById("volume-btn");
//     mute.addEventListener("click", e => {
//         if (e.target.src.includes("volume.svg")) {
//             e.target.src = e.target.src.replace("volume.svg", "mute.svg");
//             currentSong.volume = 0;
//             document.querySelector(".range").querySelector("input[type = range]").value = 0;
//             tooltip.textContent = 0;
//         } else {
//             e.target.src = e.target.src.replace("mute.svg", "volume.svg");
//             currentSong.volume = 0.1;
//             document.querySelector(".range").querySelector("input[type = range]").value = 10;
//             tooltip.textContent = 10;
//         }
//     });
// }
// main();

let currentSong = new Audio();
let songs;
let musicLibrary;
let currentFolder;

// Function to format time from seconds to MM:SS
function formatTime(time) {
    if (!isFinite(time) || time < 0) return "00:00";
    let seconds = Math.floor(time);
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return String(mins).padStart(2, '0') + ":" + String(secs).padStart(2, '0');
}

// Function to play a music track
const playMusic = (track, pause = false) => {
    currentSong.src = `${currentFolder}/` + track + ".mp3";
    if (!pause) {
        currentSong.play();
        play.src = "svgs/pause.svg";
    } else {
        play.src = "svgs/songplay.svg";
    }
    document.querySelector(".songtrack").innerHTML = decodeURI(track);
    document.querySelector(".songduration").innerHTML = "00:00 / 00:00";
}

// Function to get songs for a specific album and update the playlist UI
function getsongs(albumFolder) {
    const album = musicLibrary.albums.find(p => p.folder === albumFolder);
    if (!album) return; // Exit if album not found

    currentFolder = `Songs/${album.folder}`;
    songs = album.songs;

    // Update the playlist UI
    let songUL = document.querySelector(".songlist ul");
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML += `<li>
            <img src="svgs/music.svg" alt="">
            <div class="songnames">
                <div>${song.replaceAll("%20", " ")}</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img src="svgs/playnow.svg" alt="">
            </div>
        </li>`;
    }

    // Add click listeners to the new list items
    Array.from(songUL.getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            const songName = e.querySelector(".songnames").firstElementChild.innerHTML.trim();
            playMusic(songName);
        });
    });
}

// Main function to display albums and initialize the player
async function displayAlbums() {
    try {
        let response = await fetch('music-library.json');
        musicLibrary = await response.json();

        let cardcontainer = document.querySelector(".cardcontainer");
        cardcontainer.innerHTML = ""; // Clear existing cards

        for (const album of musicLibrary.albums) {
            cardcontainer.innerHTML += `
                <div data-folder="${album.folder}" class="cards">
                    <div class="cardimage">
                        <img src="Songs/${album.folder}/coverpage.jpg" alt="">
                    </div>
                    <div class="play">
                        <img src="svgs/play_button.svg" alt="">
                    </div>
                    <p>${album.title}</p>
                    <p>${album.description}</p>
                </div>`;
        }

        // Add click listeners to album cards
        Array.from(document.getElementsByClassName("cards")).forEach(item => {
            item.addEventListener("click", e => {
                const folderName = e.currentTarget.dataset.folder;
                getsongs(folderName);
                if (songs && songs.length > 0) {
                    playMusic(songs[0]); // Auto-play the first song
                }
            });
        });
    } catch (error) {
        console.error("Error loading music library:", error);
        // Optionally, display an error message to the user on the page
    }
}

async function main() {
    // Load all albums from the JSON manifest
    await displayAlbums();

    // Load the first album's songs into the playlist by default on startup
    if (musicLibrary && musicLibrary.albums.length > 0) {
        const firstAlbum = musicLibrary.albums[0];
        getsongs(firstAlbum.folder);
        // Set the first song as ready, but don't play it until the user clicks
        playMusic(firstAlbum.songs[0], true);
    }

    // --- Event Listeners for Player Controls ---

    // Play/Pause button
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "svgs/pause.svg";
        } else {
            currentSong.pause();
            play.src = "svgs/songplay.svg";
        }
    });

    // Update song duration and seek bar on time update
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songduration").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // Seekbar click event
    document.querySelector(".seekbar").addEventListener("click", e => {
        const percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    // Hamburger menu for mobile
    document.querySelector(".hamburger-img").addEventListener("click", () => {
        document.querySelector(".leftbox").style.left = "0";
    });

    // Close button for mobile menu
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".leftbox").style.left = "-100%";
    });

    // Previous button
    previous.addEventListener("click", () => {
        if (!songs || songs.length === 0) return;
        const currentTrackName = decodeURI(currentSong.src.split("/").pop().replace(".mp3", ""));
        let index = songs.indexOf(currentTrackName);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        } else {
            playMusic(songs[songs.length - 1]); // Loop to the last song
        }
    });

    // Next button
    next.addEventListener("click", () => {
        if (!songs || songs.length === 0) return;
        const currentTrackName = decodeURI(currentSong.src.split("/").pop().replace(".mp3", ""));
        let index = songs.indexOf(currentTrackName);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        } else {
            playMusic(songs[0]); // Loop to the first song
        }
    });

    // Volume control
    let tooltip = document.querySelector(".tooltip");
    document.querySelector(".range input").addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        tooltip.textContent = e.target.value;
    });
    
    // Mute button
    document.getElementById("volume-btn").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range input").value = 0;
            tooltip.textContent = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = 0.1;
            document.querySelector(".range input").value = 10;
            tooltip.textContent = 10;
        }
    });
}

main();