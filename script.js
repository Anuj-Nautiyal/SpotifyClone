let currentSong = new Audio();
let songs;
let currFolder;

function formatTime(time) {
    if (!isFinite(time) || time < 0) return "00:00";
    let seconds = Math.floor(time);
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return String(mins).padStart(2, '0') + ":" + String(secs).padStart(2, '0');
}

async function getsongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${currFolder}/`);
    let response = await a.text();
    // console.log(response.replaceAll("%5C", "/"));
    

    let div = document.createElement("div");
    div.innerHTML = response.replaceAll("%5C", "/");

    let as = div.getElementsByTagName("a");
    
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${currFolder}/`)[1].split(".mp3")[0]);
        }
    }

    console.log(songs);
    //show all the songs in the playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img src="svgs/music.svg" alt="">
        <div class="songnames">
        <div>${song.replaceAll("%20", " ")}</div>
        <div></div>
        </div>
        <div class="playnow">
        <span>Play Now</span>
        <img src="svgs/playnow.svg" alt="">
        </div> </li>`;
    }
    //to play music when click on the list items
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".songnames").firstElementChild.innerHTML.trim(), true);
        })
    });
    return songs;
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track + ".mp3";
    if (pause) {
        play.src = "svgs/songplay.svg";
        document.querySelector(".circle").style.left = 0;
    } 
    document.querySelector(".songtrack").innerHTML = decodeURI(track);
    document.querySelector(".songduration").innerHTML = "00:00 / 00:00";

}

async function displayAlbums() {
    let a = await fetch("/songs/");
    let response = await a.text();
    
    let div = document.createElement("div");
    div.innerHTML = response.replaceAll("%5C", "/");
    let anchors = div.getElementsByTagName("a");

    let cardcontainer = document.querySelector(".cardcontainer");
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs/")) {
            let songFolder = e.href.split("/songs/")[1].replace("/", "");

            let a = await fetch(`/songs/${songFolder}/info.json`);
            let response = await a.json();

            cardcontainer.innerHTML = cardcontainer.innerHTML +   
            `<div data-folder="${songFolder}" class="cards">
                <div class="cardimage">
                    <img src="/songs/${songFolder}/coverpage.jpg" alt="">
                </div>

                <div class="play">
                    <img src="svgs/play_button.svg" alt="">
                </div>
                <p>${response.title}</p>
                <p>${response.description}</p>
            </div>`
        };
    }
    Array.from(document.getElementsByClassName("cards")).forEach(item => {
        item.addEventListener("click", async e => {
            songs = await getsongs(`songs/${e.currentTarget.dataset.folder}`);
            playMusic(songs[0], true);
        });
    });
}

async function main() {

    //get songs from first song folder and show it in the playlist
    await getsongs("Songs/Arijit");
    playMusic(songs[0], true);

    //display all the albums on the website
    displayAlbums();

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "svgs/pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "svgs/songplay.svg";
        }
    });

    const songdurationEl = document.querySelector(".songduration");
    currentSong.addEventListener("loadedmetadata", () => {
        if (songdurationEl) {
            songdurationEl.textContent = `00:00 / ${formatTime(currentSong.duration)}`;
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songduration").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    const seekbarEl = document.querySelector(".seekbar");
    const circleEl = document.querySelector(".circle");

    seekbarEl.addEventListener("click", e => {
        const rect = seekbarEl.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const fraction = offsetX / seekbarEl.offsetWidth;


        if (!isNaN(currentSong.duration)) {
            currentSong.currentTime = fraction * currentSong.duration;
            const percent = fraction * 100;
            circleEl.style.left = percent + "%";
        }
    });

    document.querySelector(".hamburger-img").addEventListener("click", () => {
        document.querySelector(".leftbox").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".leftbox").style.left = "-100%";
    });

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split(`/${currFolder}/`)[1].split(".mp3")[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1], true);
        } else {
            playMusic(songs[songs.length - 1], true);
        }
    });

    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split(`/${currFolder}/`)[1].split(".mp3")[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1], true);
        } else {
            playMusic(songs[0], true);
        }
    });

    let tooltip = document.querySelector(".tooltip");
    document.querySelector(".range").querySelector("input[type = range]").addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        tooltip.textContent = e.target.value;
    });

    let mute = document.getElementById("volume-btn");
    mute.addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").querySelector("input[type = range]").value = 0;
            tooltip.textContent = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = 0.1;
            document.querySelector(".range").querySelector("input[type = range]").value = 10;
            tooltip.textContent = 10;
        }
    });
}
main();