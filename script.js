let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1].replace(".mp3", ""));
        }
    }    
 

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img src="images/music.svg" alt="">
        <div class="info">
            <div> ${song.replaceAll("%20", " ")}</div>
            <div>Artist</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img src="images/playnow.svg" alt="">
        </div></li>`;
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })

    return songs
}

const playMusic = (track, pause = false) => {
    currentSong.src = `${currFolder}/${track}.mp3`;
    if (!pause) {
        currentSong.play()
        play.src = "images/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


}

async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardcontainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json(); 
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
            <div class="circle">
            <div class="play"></div>
            </div>
            <img src="/songs/${folder}/cover.jpg" alt="">
            <h4>${response.title}</h4>
            <p>${response.description}</p>
        </div>`
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
            playMusic(songs[0])

        })
    })
}

async function main() {
    await getSongs("songs/Arjit")
    playMusic(songs[0], true)

    await displayAlbums()

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "images/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "images/play.svg"
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".point").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".point").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    document.getElementById("previous").addEventListener("click", () => {
        currentSong.pause();
        const currentSongName = currentSong.src.split("/").slice(-1)[0].replace(".mp3", ""); // Remove file extension
        let currentIndex = songs.findIndex(song => song === currentSongName);
        if (currentIndex > 0) {
            playMusic(songs[currentIndex - 1]);
        }
    });
    

    document.getElementById("next").addEventListener("click", () => {
        currentSong.pause();
        const currentSongName = currentSong.src.split("/").slice(-1)[0].replace(".mp3", ""); // Remove file extension
        let currentIndex = songs.findIndex(song => song === currentSongName);
        if (currentIndex > -1 && currentIndex < songs.length - 1) {
            playMusic(songs[currentIndex + 1]);
        }
    });
    
    
    

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("images/mute.svg", "images/volume.svg")
        }
    })

    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("images/volume.svg")){
            e.target.src = e.target.src.replace("images/volume.svg", "images/mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("images/mute.svg", "images/volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })

    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            document.querySelector(".hamburger").click();
            document.querySelector(".left").style.left = "0%";
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
        });
    });
    

}

main() 
