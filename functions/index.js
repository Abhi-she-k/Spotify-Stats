require('dotenv').config();

const express = require('express')
const app = express()
const router = express.Router();


const port =3004
const querystring = require('querystring')
const path = require('path');


const index = path.join(__dirname, '..', '/public', 'index.html');
app.use(express.static(path.join(__dirname, '..', '/public')));


// lest
global.access_token;
const client_id = 'df40d135664a4a2cbae1c4db4de04977';
const local_host = process.env.LOCAL_HOST
// const local_host = 'https://spotifystats-kou6.onrender.com'
const redirect_uri = local_host+'/callback';
const client_secret = '5419800129b84a63920a4d20d12fbb6e'
const scope = 'user-read-private user-read-email ugc-image-upload user-top-read user-library-read user-library-modify user-read-recently-played playlist-modify-private playlist-read-collaborative user-read-playback-state' 

app.listen(process.env.PORT ||3002,() => {
	console.log(`Example app listening at http://localhost:${port}/`);
  console.log(local_host)
});

router.get('/', function(req, res) {
  res.sendFile(index);
});

app.get('/login',  async function(req, res) {
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: 'a'
      }));
});

app.get('/callback', async function(req, res) {
    
  var code = await req.query.code || null;
  
  var body = new URLSearchParams({
    code: code,
    redirect_uri: redirect_uri,
    grant_type: "authorization_code",
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "post",
    body: body,
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
  });

  const data = await response.json();
  global.access_token = data.access_token
  res.redirect('/check')
  // res.redirect('/user')

});


async function getData(endpoint) {
  const response = await fetch("https://api.spotify.com/v1" + endpoint, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer "+ global.access_token,
      "Content-Type": "application/json"
    } 
  });

  const data = await response;
  return data.json();
}

function getListItems(data){

    let items = ""
    let count = 0;

    for(const a in data){
      if(count == 2){
        return items
      }
      items+=data[a]+ "\n"
      count+=1
    }
    return items
}

async function getInfoArt(data){
  dataList = []
  for(const a in data.items){
    dataList.push({name: data.items[a].name, pic: data.items[a].images[1].url, url: data.items[a].uri, popularity: data.items[a].popularity, genres: getListItems(data.items[a].genres)})
  }
  
  return dataList
}

async function getInfoSong(data){
  dataList = []
  for(const a in data.items){
    dataList.push({name: data.items[a].name, pic: data.items[a].album.images[1].url, url: data.items[a].uri, id: data.items[a].id})
  }
  
  return dataList
}

app.get('/check',async function(req,res){  
  try{
    const data = await getData('/me');
    res.redirect('/stats.html')
  }
  catch(error){
    res.redirect('/error.html')
  }
  
})


app.get('/user',async function(req,res){  
    
    const data = await getData('/me');

    try{
      res.json({name: data.display_name, pic: data.images[0].url, followers: data.followers.total})
      
    }
    catch{
      res.json({name: data.display_name, followers: data.followers.total})
    }
})

app.get('/TopArt/:length',async function(req,res){
  const length = req.params.length;
  const TopArtShort = await getData(`/me/top/artists?time_range=${length}_term&limit=5&offset=0`);
  res.json(await getInfoArt(TopArtShort))

})


app.get('/TopSong/:length',async function(req,res){
  const length = req.params.length;
  const TopSongShort = await getData(`/me/top/tracks?time_range=${length}_term&limit=5&offset=0`);
  res.json(await getInfoSong(TopSongShort))

})


app.get('/his',async function(req,res){
  
  const his = await getData('/me/player/recently-played/?limit=15');
  
  dataList=[]
  for(const a in his.items){
    await dataList.push({name: his.items[a].track.name, pic: his.items[a].track.album.images[1].url, url: his.items[a].track.uri,id: his.items[a].track.id})

  }
  res.json(await dataList)

})


app.get('/playlist',async function(req,res){
  
  const play = await getData('/me/playlists?limit=5&offset=0');

  dataList=[]
  for(const a in play.items){
    await dataList.push({name: play.items[a].name, pic: play.items[a].images[0].url, play: play.items[a].uri, id: play.items[a].id})
  }
  
  res.json(await dataList)

})




