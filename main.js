import VersalPlayerAPI from 'versal-player-api';

var player = new VersalPlayerAPI();
player.on('attributesChanged', function(){});
player.on('learnerStateChanged', function(){});
player.on('editableChanged', function(){});
player.startListening();

var disqus_shortname = 'x1011-test';

var dsq = document.createElement('script');
dsq.async = true;
dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
document.getElementsByTagName('head')[0].appendChild(dsq);
