const player = {
      url: '',
      version: 2,
      stream_id: 1,
      stream_path: '/stream?icy=http',
      isplaying: false,
      cors: 'https://shoutcastapps.herokuapp.com',
      anable_cors: false,
      type: '/;type=mp3',
      artwork: true,
      default_cover: 'https://i.postimg.cc/d1RR9vx1/not-cover-02.jpg',
      default_logo:  'https://i.postimg.cc/wxVt2PHR/default-image.jpg',
      audio:  new Audio(),
      volume: 0.5,
      autoplay: false,
      data: {},
      buttons: null,
      rows: null,
      current_song: 0,
      current_list: '',
      country: 'br',
      limit: 10,
      key: 'd488c730380d46508438fcc0ba9b266d',
      station_list: [
            {
                  url: "http://151.80.6.109:8090",
                  brand: "https://i.postimg.cc/yxv6j55y/los-90.jpg",
                  title: "Best 90s Dance",
                  genre: "Dance Hits",
                  xat: "https://xat.com/centraldosplayers"
            },
            {
                  url: "https://server08.srvsh.com.br:7060",
                  brand: "https://i.postimg.cc/CLxx5hBP/t1player-bg-cover.png",
                  title: "T1Player",
                  genre: "Varios",
                  xat: "https://xat.com/t1player"
            },
            {
                  url: "https://ssl.ndvendas.eu:9790",
                  brand: "",
                  title: "Web Radio Star",
                  genre: "Varios",
                  xat: "https://xat.com/"
            },
            {
                  url: "https://sp0.redeaudio.com:10941",
                  brand: "https://i.postimg.cc/4d6JQTM8/bg-hola-2.jpg",
                  title: "Holaxat",
                  genre: "Varios",
                  xat: "https://xat.com/hola"
            },
            {
                  url: "https://azuracast.masterteam.com.br:8000",
                  brand: "https://i.postimg.cc/26FZ0mfr/danada.jpg",
                  title: "Danada",
                  genre: "Varios",
                  xat: "https://xat.com/danada"
            }
      ],
      afftSize: 64,
      width: 228,
      height: 60,
      // elements html 
      player_box: document.querySelector('.jd_player'),
      btn_play: document.querySelector('.play'),
      btn_pause: document.querySelector('.pause'),
      btn_playpause: document.querySelector('.jd_btn__playpause'),
      load_play: document.querySelector('.pulse'),
      animated_title: document.querySelector('.jd_playing__animated'),
      artist: document.querySelector('.artist'),
      song: document.querySelector('.song'),
      title: document.querySelector('.jd_playing__static'),
      station: document.querySelector('.jd_station__top'),
      cover: document.querySelector('.jd_cover img'),
      list_box: document.querySelector('.jd_station__list'),
      loading: document.querySelector('.jd_load__player'),
      canvas: document.querySelector('canvas'),
      news_content: document.querySelector('.jd_news__group'),
      current_stationbrand: document.querySelector('.jd_current__brand img'),
      current_stationtitle: document.querySelector('.jd_current__info strong'),
      current_stationtrack: document.querySelector('.jd_current__song'),
      btn_volume: document.querySelector('.jd_volume'),
      btn_mute: document.querySelector('.jd_btn__updown'),
      btn_full: document.querySelector('.jd_btn_up'),
      seekbar: document.querySelector('.jd_progress__bar'),
      icon_low: document.querySelector('#low'),
      icon_mute: document.querySelector('#mute'),
      listener: document.querySelector('.jd_listener'),
      currentlistener: document.querySelector('.jd_clistener'),
      bitrate: document.querySelector('.jd_bitrate'),
      init(){
            this.audio.crossOrigin = "anonymous"
            this.audio.volume = this.volume
            this.audio.preload = "auto"
            this.audio.load()
            this.addCover(this.default_cover)
            this.stationList(this.station_list)
            this.action()
            this.setRadio(this.current_song)
            this.setCurrentStation()
            this.getNews()
            this.rows = document.querySelectorAll('.jd_row__list')
            this.rows[this.current_song].classList.add('active')
      },
      action(){
            
            this.buttons = document.querySelectorAll('.jd_btn__list')

            this.buttons.forEach((button, index) => {
                  button.addEventListener('click', (ev) => {
                        this.rows.forEach((item) => {
                              if(item.classList.contains('active')){
                                    item.classList.remove('active')
                              }
                        })
                        this.setRadio(index)
                        this.loading.style.display = 'flex'
                        this.setCurrentStation()
                        this.resetMetadata()
                        current = button.parentNode.parentNode
                        current.classList.add('active')      
                        this.onPlay()
                  })
            })
            //this.btn_play.onclick = () => this.onPlay()
            //this.btn_pause.onclick = () => this.onPause()
            this.btn_playpause.onclick = () => this.onPlayPause()
            this.btn_volume.oninput = () => this.setVolume()
            this.btn_mute.onclick = () => this.isMuted()
            this.btn_full.onclick = () => this.isVolumeFull()
      },
      setRadio(i){
            if(this.version == 2){
                  this.current_song = i 
                  const src = this.station_list[this.current_song].url + this.stream_path
                  this.audio.src = src
                  this.shoutCast()
            }
      },
      shoutCast(){
            dataUrl = null 
            if(this.anable_cors){
                  dataUrl = `${this.cors}?q=${this.setUrl()}/stats?sid=${this.stream_id}&json=1&callback=?`
            }
            else{
                  dataUrl = `${this.setUrl()}/stats?sid=${this.stream_id}&json=1&callback=?`
            }

            setInterval(async () => {
                  try{
                        const response = await fetchJsonp(dataUrl, { jasonCallback: 'jsonp'})
                        const result = await response.json()
                        this.update(result)
                  }
                  catch(err){
                        console.log(err)
                  }
                  finally{
                        console.log('End request')
                        this.loading.style.display = 'none'
                  }
            }, 10000)
      },
      update(result){
            if(result.songtitle != this.getTag()){
                  this.updateTag(result.songtitle)
                  let artist = this.getData(result.songtitle, 0)
                  let song = this.getData(result.songtitle, 1)
                  this.updateTrack(result.songtitle)
                  this.updateArtist(artist)
                  this.updateSong(song)
                  this.updateInfo(result)
                  this.artistImage(artist, song)
            }
      },
      updateTrack(track){
            this.animated_title.innerText = track
            this.title.innerText = track
            this.current_stationtrack.innerText = track

            inner_width = this.animated_title.scrollWidth
            this.animated_title.style.textShadow = `${inner_width}px 0 #fff`
            this.animated_title.classList.add('move_text')
      },
      updateArtist(artist){
            //this.artist.innerText = artist
      },
      updateSong(song){
            //this.song.innerText = song
      },
      updateInfo(result){
            this.station.innerText = result.servertitle
            this.listener.innerText = result.peaklisteners
            this.currentlistener.innerText = result.currentlisteners
            this.bitrate.innerText = result.bitrate
      },
      async artistImage(artist, song){
            artist = this.prepareArtist(artist)
            artist = encodeURI(artist)
            song = this.prepareSong(song)
            song = encodeURI(song)

            const url = `https://itunes.apple.com/search?term==${artist}-${song}&media=music&limit=1`

            try{
                  const response = await fetch(url)
                  const result = await response.json()
                  if(result.results.length == 1){
                        let cover = result.results[0].artworkUrl100
                        cover = cover.replace('100x100', '500x500')
                        this.addCover(cover)
                  }
                  else{
                        this.addCover(this.default_cover)
                  }
            }
            catch(err){
                  if(err){
                        console.log('Not found cover in apple api')
                  }
            }
            finally{
                  console.log('End request cover')
            }
      },
      addCover(img){
            this.cover.setAttribute('src', img)
      },
      prepareArtist(artist){
            if(artist){
                  artist = artist.toLowerCase()
                  artist = artist.trim()
                  if(artist.includes("&")){
                        artist = artist.substr(0, artist.indexOf(' &'))
                  }
                  else if(artist.includes("feat")){
                        artist = artist.substr(0, artist.indexOf(' feat'))
                  }
                  else if(artist.includes("ft.")){
                        artist = artist.substr(0, artist.indexOf(' ft.'))
                  }
            }
            return artist
      },
      prepareSong(song){
            if(song){
                  song = song.toLowerCase()
                  song = song.trim()
                  if(song.includes("&")){
                        song = song.replace('&', 'and')
                  }
                  else if(song.includes("(")){
                        song = song.substr(0, song.indexOf(' ('))
                  }
                  else if(song.includes("ft")){
                        song = song.substr(0, song.indexOf(' ft'))
                  }
            }
            return song
      },
      getData(data, position){
            if(data){
                  data = data.split(' -')
                  data = data[position]
                  return data?.trim()
            }
            return data
      },
      onPlayPause(){
            if(this.audio.paused){
                  this.load_play.classList.add('active')
                  this.onPlay()
            }
            else{
                  this.onPause()
            }
      },
      onPlay(){
            this.isplaying = true 
            this.isPlaying()
            start_play = this.audio.play()
            if(start_play !== undefined){
                  start_play.then(() => {
                        console.log('loading audio')
                  })
                  .catch((err) => {
                        console.log('loading audio filled' + err)
                  })
                  .finally(() => {
                        this.load_play.classList.remove('active')
                  })
            }
            this.spectrumAnalyser()
      },
      onPause(){
            this.audio.pause()
            this.isplaying = false
            this.isPaused()
      },
      isPlaying(){
            if(this.isPlaying){
                  console.log('playing')
                  //this.spectrumAnalyser()
                  this.btn_playpause.classList.remove('ispaused')
                  this.btn_playpause.classList.add('isplaying')
            }
      },
      isPaused(){
            if(!this.isplaying){
                  console.log('paused')
                  this.btn_playpause.classList.add('ispaused')
                  this.btn_playpause.classList.remove('isplaying')
            }
      },
      setVolume(){
            if(this.audio.muted){
                  console.log('muted')
                  this.audio.muted = false
                  this.icon_low.style.display = "flex" 
                  this.icon_mute.style.display = "none"
                  this.audio.volume = parseInt(this.btn_volume.value, 10) / 100 
            }
            
            if(this.audio.volume == 1){
                  let width = null
                  this.audio.volume = parseInt(this.btn_volume.value, 10) / 100 
                  width = this.audio.volume * 100 
                  this.seekbar.style.width = `${width}%`
            }
            else{
                  this.audio.volume = parseInt(this.btn_volume.value, 10) / 100 
                  let width = this.audio.volume * 100 
                  this.seekbar.style.width = `${width}%`
            }
            
      },
      isMuted(){
            this.audio.muted = !this.audio.muted 
            if(this.audio.muted){
                  this.icon_low.style.display = "none" 
                  this.icon_mute.style.display = "flex"
                  this.audio.volume = parseInt(this.btn_volume.value, 10) / 100 
                  let width = this.audio.volume * 100 

                  if(width > 0){
                        setInterval(() => {
                              if(width >= 1){
                                    width -= 1
                                    this.btn_volume.value = width
                                    this.seekbar.style.width = `${width}%`
                              }
                        }, 10)
                        
                  }
            }
            else{
                  this.icon_low.style.display = "flex" 
                  this.icon_mute.style.display = "none"
                  let width = 0

                  if(width == 0){
                        setInterval(() => {
                              if(width <= 49){
                                    width += 1
                                    this.btn_volume.value = width
                                    this.seekbar.style.width = `${width}%`
                              }
                              this.audio.volume = parseInt(this.btn_volume.value, 10) / 100
                        }, 10)
                  }
            }
      },
      isVolumeFull(){
            let width = null
            if(this.audio.muted){
                  this.audio.muted = false
                  this.icon_low.style.display = "flex" 
                  this.icon_mute.style.display = "none"
                  width = 0
                  setInterval(() => {
                        if(width >= 0 && width <= 99){
                              width += 1
                              this.btn_volume.value = width
                              this.seekbar.style.width = `${width}%`
                        }
                  }, 10)
            }
            else{
                  this.audio.volume = parseInt(this.btn_volume.value, 10) / 100 
                  width = this.audio.volume * 100 
                  setInterval(() => {
                        if(width <= 99){
                              width += 1
                              this.btn_volume.value = width
                              this.seekbar.style.width = `${width}%`
                              this.audio.volume = 1 
                        }
                  }, 10)
            }
      },
      getTag(){
            return this.player_box.getAttribute("data-tag")
      },
      updateTag(data){
            this.player_box.setAttribute("data-tag", data)
      },
      stationList(list){
            if(list.length){
                  let box = ''
                  for(let i = 0; i < list.length; i++){
                        let item = list[i]
                        brand = item.brand == '' ? this.default_logo : item.brand
                        box += `<li class="jd_row__list flex">
                                    <div class="jd_row__group flex">
                                          <div class="jd_station__info flex">
                                                <div class="jd_station__brand">
                                                      <img src="${brand}" alt="${item.title}" />
                                                </div>
                                                <div>
                                                      <strong>${item.title}</strong>
                                                      <span>${item.genre}</span>
                                                </div>
                                          </div>
                                          <a href="${item.xat}" class="jd_btn__chat" target="_blank">chat</a>
                                          <button class="jd_btn__list">
                                                <i class='bx bx-play'></i>
                                          </button>
                                    </div>
                                    <div class="jd_list__playing flex">
                                          <span>Selected station...</span>
                                          <div class="jd_row__progress"></div>
                                    </div>
                                </li>`
                  }
                        
                  this.list_box.innerHTML += box
            }
      },
      setUrl(){
            return this.station_list[this.current_song].url
      },
      setCurrentStation(){
            station = this.station_list[this.current_song]
            brand = station.brand != '' ? station.brand : this.default_logo
            this.current_stationbrand.setAttribute('src', brand)
            this.current_stationtitle.innerText = station.title
      },
      resetMetadata(){
            this.animated_title.innerText = 'Loading metadata...'
            this.current_stationtrack.innerText = 'Loading metadata...'
            this.title.innerText = 'Loading metadata...'
            this.station.innerText = 'Loading station title...'
            //this.artist.innerText = 'Loading artist track...'
            //this.song.innerText = 'Loading song track...'
            this.addCover(this.default_cover)
      },
      spectrumAnalyser(){
            let canvas = document.querySelector(".canvas");
            let ctx = canvas.getContext("2d");
            let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            let audioSource = audioCtx.createMediaElementSource(this.audio);
            let analyser = audioCtx.createAnalyser();
            audioSource.connect(analyser);
            analyser.connect(audioCtx.destination);
            analyser.afftSize = this.afftSize;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            canvas.width = this.width;
            canvas.height = this.height;

            const barWidth = 1; 
            let barHeight;
            let x;

            function animate(){
                  x = 0;
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                  analyser.getByteFrequencyData(dataArray);
                  drawSpectrum(bufferLength, x, barWidth, barHeight, dataArray);
                  requestAnimationFrame(animate);
            }
            animate();
            
            function drawSpectrum(bufferLength, x, barWidth, barHeight, dataArray){
                  let grad = ctx.createLinearGradient(0,0,0, canvas.height);
                  grad.addColorStop(0, "#2ca8fb");
                  grad.addColorStop(0.50, "#ffe600");
                  grad.addColorStop(1, "#ff4e00");
                  for(var i = 0; i < bufferLength; i++){
                        barHeight = dataArray[i]/5.5;
                        ctx.fillStyle = "white";
                        ctx.fillRect(x, canvas.height - barHeight - 4, barWidth, 1);
                        ctx.fillStyle = grad;
                        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                        x += barWidth + 1;
                  }
            }
      },
      async getNews(){
            url = `https://newsapi.org/v2/top-headlines?country=${this.country}&apiKey=${this.key}`
            try{
                  const response = await fetch(url)
                  const result = await response.json()
                  this.createNews(result)
            }
            catch(err){
                  console.log(err)
            }
            finally{
                  console.log('End request')
            }
      },
      createNews(result){
            if(result.status){
                  box = ''
                  for(let i = 0; i < this.limit; i++){
                        box += `<div class="jd_news__article">
                                    <a href="${result.articles[i].url}" target="_blank">
                                          <p>${result.articles[i].title}</p>
                                    </a>
                               </div>`
                  }
                  this.news_content.innerHTML += box
            }
      }
}

window.addEventListener('load', () => {
      player.init()
})
