console.log("Let's write javascript")

async function getsongs(){
    let a = await fetch("http://127.0.0.1:3000/assests/songs/Dua%20Lipa/")
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href)
        }
    }
    return songs;
}
async function main(){
    let songs = await getsongs();
    console.log(songs)
    var audio = new Audio(songs[0]);
    audio.play();
}
main()