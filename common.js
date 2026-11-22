var actx=null;
function getCtx(){
  try{
    var AC=window.AudioContext||window.webkitAudioContext;
    if(!AC)return null;
    if(!actx)actx=new AC();
    if(actx.state==='suspended')actx.resume();
    return actx;
  }catch(e){return null}
}
function unlockAudio(){
  getCtx();
  try{
    if(window.speechSynthesis){
      var u=new SpeechSynthesisUtterance(' ');
      u.volume=0;
      window.speechSynthesis.speak(u);
    }
  }catch(e){}
}
document.addEventListener('pointerdown',function once(){
  unlockAudio();
  document.removeEventListener('pointerdown',once);
},{passive:true});
function winSound(){
  var c=getCtx();
  if(!c)return;
  try{
    var t0=c.currentTime+0.02;
    [523.25,659.25,783.99,1046.5].forEach(function(f,i){
      var o=c.createOscillator(),g=c.createGain();
      o.type='triangle';o.frequency.value=f;
      var s=t0+i*0.15,e=(i===3)?t0+1.0:s+0.22;
      g.gain.setValueAtTime(0.0001,s);
      g.gain.exponentialRampToValueAtTime(0.3,s+0.03);
      g.gain.exponentialRampToValueAtTime(0.0001,e);
      o.connect(g);g.connect(c.destination);
      o.start(s);o.stop(e+0.05);
    });
  }catch(e){}
}
function speak(txt){
  try{
    if(!window.speechSynthesis)return;
    window.speechSynthesis.cancel();
    var u=new SpeechSynthesisUtterance(txt);
    u.lang='de-DE';u.rate=0.8;u.pitch=1.1;
    window.speechSynthesis.speak(u);
  }catch(e){}
}
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
