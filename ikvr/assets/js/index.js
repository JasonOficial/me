const theme = {
      url: config.url,
      xat: config.xat,
      color: config.color,
      /**object dom  */
      banner: document.querySelector('.jd_banner__img img'),
      avatar_user: document.querySelector('.jd_user__avatar_box img'),
      user_tooltip: document.querySelector('.jd_user__avatar'),
      user_name: document.querySelector('.jd_user__data h1'),
      user_status: document.querySelector('.jd_user__data p'),
      user_id: document.querySelector('.jd_user__data strong'),
      user_location: document.querySelector('.jd_user__data_location span'),
      user_find: document.querySelector('.jd_user__find a'),
      user_about: document.querySelector('.jd_description p'),
      relation_name: document.querySelector('.jd_header__crush'),
      relation_image: document.querySelector('.jd_crush__avatar img'),
      relation_me: document.querySelector('.jd_crush__data a'),
      facebook: document.getElementById('facebook'),
      twitter: document.getElementById('twitter'),
      instagram: document.getElementById('instagram'),
      youtube: document.getElementById('youtube'),
      tiktok: document.getElementById('tiktok'),
      tumblr: document.getElementById('tumblr'),
      discord: document.getElementById('discord'),
      video_iframe: document.querySelector('.jd_video__box iframe'),
      friends_content: document.querySelector('.jd_friend__slider'),
      template: document.querySelector('body'),
      loading: document.querySelector('.jd_theme__load'),
      tooltip: document.querySelectorAll('.tooltip'),
      box_crush: document.querySelector('.jd_header__crush'),
      box_content_friend: document.querySelector('.jd_theme__friend'),
      
      init(){

            fetch(this.url)
            .then(response => {
                  return response.json()
            })
            .then(user => {
                  this.getBanner(user.user.banners.data ? '' : user.user.banners[0])
                  this.getInforData(user.user.infordata)
                  this.getRelation(user.user.relation)
                  this.getSocial(user.user.social)
                  this.getVideo(user.user.videos.data ? '' : user.user.videos[0])
                  this.getFriends(user.user.friends)
                  this.loading.style.visibility = 'hidden'
            })
            .catch(error => {
                  console.log('error', error)
            })
            .finally(
                  console.log('request data complete')
            );

            if(this.color != ''){
                  this.template.style.setProperty('--theme', this.color)
            }

            this.getEvent();
      },
      getEvent(){
            this.tooltip.forEach((item) => {
                  item.addEventListener('mousemove', (e) => {
                        let x = e.pageX;
                        let y = e.pageY;

                        item.style.setProperty('--p-x', (x + 20) + 'px');
                        item.style.setProperty('--p-y', y + 'px');
                  })
            })
      },
      getBanner(data){
            if(data == '') return;
            this.banner.src = data.image
      },
      getInforData(data){
            if(data.data) return;
            this.avatar_user.src = data.avatar;
            this.user_tooltip.setAttribute('data-tooltip', data.name);
            this.user_name.innerText = data.name;
            this.user_id.innerText = data.id_xat;
            this.user_location.innerText = data.location;
            this.user_find.href = this.xat;
            this.user_about.innerText = data.about;
      },
      getRelation(data){
            if(data.data){
                  this.box_crush.style.display = 'none'; 
                  return;
            }
            
            this.relation_name.setAttribute('data-tooltip', data.name);
            this.relation_image.src = data.avatar;
            this.relation_me.href = data.me;
      },
      getSocial(data){
            if(data.data) return;
            this.facebook.href = (data.facebook == '' ? 'https://www.facebook.com' : data.facebook);
            this.twitter.href = (data.twitter == '' ? 'https://www.twitter.com' : data.twitter);
            this.instagram.href = (data.instagram == '' ? 'https://www.instagram.com' : data.instagram);
            this.youtube.href = (data.youtube == '' ? 'https://www.youtube.com' : data.youtube);
            this.tiktok.href = (data.tiktok == '' ? 'https://www.tiktok.com' : data.tiktok);
            this.tumblr.href = (data.tumblr == '' ? 'https://www.tumblr.com' : data.tumblr);
            this.discord.href = (data.discord == '' ? 'https://www.discord.com' : data.discord);
      },
      getVideo(data){
            if(data == '') return;
            path = `https://www.youtube.com/embed/${data.id_video}`;
            this.video_iframe.src = path
      },
      getFriends(data){
            if(data.data) {
                  this.box_content_friend.style.visibility = 'hidden';
                  return;
            }
            box = '';
            friends = data;

            friends.map(friend => {
                  box += `<div class="jd_friend__card">
                              <div class="jd_card__inner">
                                    <div class="jd_card__avatar">
                                          <img src="${friend.avatar}" alt="Friend Avatar" />
                                    </div>
                                    <h2>${friend.name}</h2>
                                    <a href="${friend.me}" target="_blank">xat.me</a>
                              </div>
                        </div>`
            })

            this.friends_content.innerHTML = box;

            $(this.friends_content).slick({
                  infinite: true,
                  slidesToShow: 3,
                  slidesToScroll: 1,
                  dots: false,
                  arrows: true,
                  speed: 500,
                  variableWidth: true,
                  autoplay: true,
                  autoplaySpeed: 4000,
                  prevArrow: $("#next"),
                  nextArrow: $("#prev"),
                  responsive: [
                        {
                              breakpoint: 640,
                                    settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 1
                              }
                        },
                        {
                              breakpoint: 320,
                              settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1
                              }
                        }
                  ]
            });
      }
}

window.addEventListener('load', () => {
      theme.init();
})