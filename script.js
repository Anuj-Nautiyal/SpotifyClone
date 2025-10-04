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
    currentSong.src = `${currentFolder}/` + track;
    document.querySelector(".songtrack").innerHTML = decodeURI(track).replace(/\.[^/.]+$/, "");
    document.querySelector(".songduration").innerHTML = "00:00 / 00:00";
    document.querySelector(".circle").style.left = "0%";
    if (!pause) {
        currentSong.play();
        play.src = "svgs/pause.svg";
    } else {
        play.src = "svgs/songplay.svg";
    }
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
        const displayName = song.replace(/\.[^/.]+$/, "");

        songUL.innerHTML += `<li data-song="${song}">
            <img src="svgs/music.svg" alt="">
            <div class="songnames">
                <div>${displayName.replaceAll("%20", " ")}</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img src="svgs/playnow.svg" alt="">
            </div>
        </li>`;
    }

    // Add click listeners to the new list items
    Array.from(songUL.getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", (event) => {
            const songName = event.currentTarget.dataset.song;
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
                    playMusic(songs[0], true); // Auto-play the first song
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
        if(currentSong.ended) { play.src = "svgs/songplay.svg"; };
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
        const currentTrackName = decodeURI(currentSong.src.split("/").pop());
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
        const currentTrackName = decodeURI(currentSong.src.split("/").pop());
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