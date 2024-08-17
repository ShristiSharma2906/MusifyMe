let currentSong =new Audio();
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

async function getSongs(folder){
    currFolder= folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        } 
    }
    //show all the songs in the playlist
    let songUL= document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML= ""
    for (const song of songs){
        songUL.innerHTML =songUL.innerHTML + `<li>
                            <div class="music">
                                <i class="fa-solid fa-music"></i>
                            </div>

                            <div class="info">
                                <diveconds>${song.replaceAll("%20"," ")}</div>
                                
                            </div>
                        
                            <div class="playnow">
                                PlayNow   
                                <i class="fa-regular fa-circle-play"></i>
                            </div></li>`;
    }
    
    //attach an event listener to eaach song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    return songs;
    
}
const playMusic =(track, pause=false)=>{
    currentSong.src=(`/${currFolder}/`+track)
    if(!pause){
        currentSong.play()
        play.src= "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML ="00:00/00:00"

}

// Function to search for a song in the playlist
function searchSong(query) {
    const resultsDiv = document.getElementById('results'); // Get the div element for results
    const foundSong = songs.find(song => song.toLowerCase().includes(query.toLowerCase()));

    if (foundSong) {
        // Play the found song
        playMusic(foundSong);
        // Optionally, clear any previous results message
        resultsDiv.innerHTML = '';
    } else {
        // Display a message if the song is not found
        resultsDiv.innerHTML = 'Song not found in the playlist.';
    }
}

// Event listener for the search form
document.getElementById('search-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form submission
    const query = document.getElementById('searchQuery').value;
    searchSong(query);
});

async function displayAlbums(){
    console.log("displaying albums")
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if(e.href.includes("/songs/")){
            let folder = e.href.split("/").slice(-1)[0]
            // Get the meta data of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                            <div  class="play">
                                <i class="fa-regular fa-circle-play"></i>
                            </div>
                            <img class="cardimg" src="/songs/${folder}/cover.jpg" alt="">
                            <h3 car>${response.title}</h3>
                            <p>${response.description}</p>
                        </div>`
        }
    }    
        
    
    //load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click" ,async item=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
            
        })
    })
    
}

// Function to handle adding new songs to the playlist
function handleFileSelect(event) {
    const files = event.target.files;
    const songUL = document.querySelector(".songlist ul");

    for (const file of files) {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (fileExtension === "mp3") {
            const reader = new FileReader();
            reader.onload = (e) => {
                const songName = file.name;
                const songURL = e.target.result;
                // Add song to playlist
                songs.push(songName);
                songUL.innerHTML += `
                    <li>
                        <div class="music">
                            <i class="fa-solid fa-music"></i>
                        </div>
                        <div class="info">
                            <div>${songName}</div>
                        </div>
                        <div class="playnow">
                            PlayNow
                            <i class="fa-regular fa-circle-play"></i>
                        </div>
                    </li>`;
                // Create a temporary link and trigger download (if needed)
                const link = document.createElement('a');
                link.href = songURL;
                link.download = songName;
                link.click();
            };
            reader.readAsDataURL(file);
        } else {
            alert("Only MP3 files are allowed.");
        }
    }
}

// Add event listeners
document.getElementById('add-song').addEventListener('click', () => {
    document.getElementById('file-input').click();
});
document.getElementById('file-input').addEventListener('change', handleFileSelect);


async function main(){  
    //get the list of all songs
    await getSongs("songs/ncs")
    playMusic(songs[0] , true)

    //display all the albums on the page
    await displayAlbums()
    
   //attach an event listener to play,next and previous
   play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else{
            currentSong.pause()
            play.src= "img/play.svg"
        }
    })

    //listen for timeupdate event
    currentSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration) * 100 + "%";
    })

    //add eventlistener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent =  (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent)/100
    })

    //Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".bottom").style.left = "0"
    })


    //Add event listener for close button
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%"
        document.querySelector(".bottom").style.left= "-120%"
        
    })

    //Add an event llisterner to previous and next
    previous.addEventListener("click" , ()=>{
        console.log("previous clicked")
        let index= songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1) >= 0){
        playMusic(songs[index-1])}
    })

    next.addEventListener("click" , ()=>{
        console.log("next clicked")
        let index= songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1) < songs.length){
        playMusic(songs[index+1])}
    })
    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
         console.log("setting volume to ", e.targer , e.target.value,"/100")
         currentSong.volume =parseInt(e.target.value)/100
    })
    
    //add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{
        if(e.target.src.includes("img/volume.svg")){
            e.target.src = e.target.src.replace("img/volume.svg","img/mute.svg")
            currentSong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
        }
        else{
            e.target.src = e.target.src.replace("img/mute.svg","img/volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value =10;
        }
    })


    
}
main()