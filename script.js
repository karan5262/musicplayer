console.log("Lets Write javaScript");
let currentSong = new Audio();
let songs;
function formatTime(seconds) {
    // Ensure input is a number
    seconds = Math.max(0, Math.floor(seconds));
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Format the minutes and seconds with leading zeros
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {


    let a = await fetch("http://127.0.0.1:5500/soongs/")

    let response = await a.text();
    // console.log(response);

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(as);
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/soongs/")[1])
        }
    }

    return songs


}

const playMusic=(track , pause=false)=>{
    // let audio = new Audio("/soongs/" + track);
    currentSong.src="/soongs/" + track
    currentSong.play();
    if(!pause){
        currentSong.play();
        play.src="img/pause.svg"
    }
 
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00/00:00"
}

async function main() {

    


    songs = await getSongs();
    playMusic(songs[1],true)

    let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML+`<li>
                            <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20","")}</div>
                                <div>Karan</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img  class="invert" src="img/play.svg" alt="">
                            </div> </li>`
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{

            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
        
    })


    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src="img/pause.svg";
        }else{
            currentSong.pause();
            play.src="img/play.svg";
        }
    })


    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime , currentSong.duration);
        document.querySelector(".songtime").innerHTML=`${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%";
    })

    document.querySelector(".seekbar").addEventListener("click",e=>{

        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100

     document.querySelector(".circle").style.left=percent+"%";
     currentSong.currentTime= ((currentSong.duration)*percent)/100
    })


    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })

    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%"
    })

    previous.addEventListener("click",()=>{
console.log("previous clicked");

let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        
        if((index-1)>=0)
        playMusic(songs[index-1])


})
next.addEventListener("click",()=>{
        currentSong.pause();
        console.log("next clicked");

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        
        if((index+1)<songs.length)
        playMusic(songs[index+1])
        
        
    })


    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentSong .volume=parseInt(e.target.value)/100
    })


}

main();