

async function getStat(endpoint){
    var url = "http://localhost:3002/"
    try{
        const response = await fetch(url+endpoint)
        data = await response;
        return await data.json()
    }
    catch(e){
        console.log(e)
    }

    
}

async function userInfo(){
    var user = await getStat('user')

    let info = document.getElementsByClassName("UserInfo")[0];
    
    let img = document.createElement("img");
    let name = document.createElement("h3");
    let followers = document.createElement("h6");

    img.id = 'proPic';
    name.id = 'userName';

    img.src = user.pic;
    name.innerText = user.name;
    followers.innerText = "Followers | " + user.followers;
    followers.style.fontSize='20px';

    info.append(img);
    info.append(name);
    info.append(followers);


}


async function stats(endpoint, div, type){
    var stats = await getStat(endpoint)
    var count = 0;
    let list = document.getElementsByClassName(type)[div];

    stats.forEach((item)=>{
 
    count++
    let div = document.createElement("div")
    let link = document.createElement("a")
    div.className="Child2"
    let text = document.createElement("h5");
    text.className="Child2Text"
    let text2 = document.createElement("h5");
    text2.className="Child2Text2"
    let pic = document.createElement("img");
    text.innerText = count + ". "+item.name;
    if(endpoint.includes("TopArt")){
        percentage = 100 - item.popularity 
        text2.innerText = "Popularity\n" + "Top " + percentage + "%" + "\n\nGenres\n" + item.genres;
        text2.id = "songhis"
        text2.style.color="#FFD700"
        text2.style.Width="1000px"
        text2.style.fontSize="20px"
        div.appendChild(text2);
    }
    else if(endpoint.includes("playlist")){
        let div2 = document.createElement("div")
        div2.className = "Child2Text2"
        div2.innerHTML = `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/${item.id}?utm_source=generator" width="350px" height="375px" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
        console.log(div2.innerHTML)
        div.append(div2)
    }
    else{
        let div2 = document.createElement("div")
        div2.className = "Child2Text2"
        div2.innerHTML = `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/${item.id}?utm_source=generator" width="350px" height="375px" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
        console.log(div2.innerHTML)
        div.append(div2)
    }
    pic.src = item.pic
    text.id = "songhis"
    
    pic.id = "Pic"
    link.href = item.url


    
    link.appendChild(div)
    div.append(pic);
    div.appendChild(text);
    list.appendChild(link)
    })
}

userInfo()
stats('TopArt/short',0,"Songs")
stats('TopArt/medium',1,"Songs")
stats('TopArt/long',2,"Songs")
stats('TopSong/short',3,"Songs")
stats('TopSong/medium',4,"Songs")
stats('TopSong/long',5,"Songs")
stats("his",0,"History")
stats("playlist",0,"Playlists")
