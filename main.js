import VersalPlayerAPI from 'versal-player-api';

var player = new VersalPlayerAPI();
player.watchBodyHeight({interval: 1000});


//Disqus embed code

var disqus_shortname = 'x1011-test';

var dsq = document.createElement('script');
dsq.async = true;
dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
document.getElementsByTagName('head')[0].appendChild(dsq);
