
let volumColor = [0,0,0];

painthtml();

painthtmlTwo();

function painthtml(){
    let html = /*HTML*/`
    <div style="width:80%;margin:auto;margin-top:40px;text-align:center;">
        <div style="width:80%;margin:auto;text-align:center;">
            <div id="player"></div>
            <br />
            
            <br />
            <canvas id="colorWheel" width="300" height="300"></canvas>
        </div>
    </div>
    `;
    document.getElementById('app').innerHTML = html;
}

function painthtmlTwo(){
    let html = /*HTML*/`
    <div id="volumIndicator" style="width:100px;height:50px;background-color:rgb(${volumColor[0]}, ${volumColor[1]}, ${volumColor[2]});text-align:center;font-weight:bold;align-content:center;margin:auto;border-radius:15px;"></div>
    `;
    document.getElementById('volumConteiner').innerHTML = html;
}

const canvas = document.getElementById('colorWheel');
const ctx = canvas.getContext('2d');
const radius = canvas.width / 2;
const image = ctx.createImageData(canvas.width, canvas.height);
const data = image.data;
canvas.addEventListener("click", function(event){var eventLocation = getEventLocation(this, event);
var context = this.getContext("2d");
volumColor = context.getImageData(eventLocation.x, eventLocation.y, 1, 1).data; console.log(volumColor); changeVolume();}, false);
let hei;
for (let y = -radius; y < radius; y++) {
    for (let x = -radius; x < radius; x++) {
        const dx = x;
        const dy = y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        if (distance <= radius) {
        const angle = Math.atan2(dy, dx);
        const hue = (angle * 180 / Math.PI + 360) % 360;

        const sat = distance / radius;

        const rgb = hslToRgb(hue / 360, sat, 0.5);
        const index = ((y + radius) * canvas.width + (x + radius)) * 4;
        data[index] = rgb[0];
        data[index + 1] = rgb[1];
        data[index + 2] = rgb[2];
        data[index + 3] = 255;
        }
    }
}

ctx.putImageData(image, 0, 0);

// HSL to RGB function
function hslToRgb(h, s, l) {
let r, g, b;
if (s === 0) {
    r = g = b = l;
} else {
    const hue2rgb = (p, q, t) => {
    if(t < 0) t += 1;
    if(t > 1) t -= 1;
    if(t < 1/6) return p + (q - p) * 6 * t;
    if(t < 1/2) return q;
    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
}
return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

let player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '360',
      width: '640',
      videoId: 'ks6pkadbiTg', // Replace with actual video ID
      events: {
        'onReady': onPlayerReady
      },
      playerVars: { controls: 0 }
    });
}

function onPlayerReady(event) {
    console.log('Player ready!');
}

function getElementPosition(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

function getEventLocation(element,event){
    // Relies on the getElementPosition function.
    var pos = getElementPosition(element);

    return {
        x: (event.pageX - pos.x),
          y: (event.pageY - pos.y)
    };
}


function changeVolume(){
    let volum1 = Math.min(volumColor[0], volumColor[1], volumColor[2]) * 100 / 255;
    let volum2 = Math.max(volumColor[0], volumColor[1], volumColor[2]) * 100 / 255;
    let volum3 = Math.random(volum1, volum2);
    if (player) player.setVolume(volum3 * 100);
    console.log(volum3);

    painthtmlTwo();
    document.getElementById('volumIndicator').innerHTML = `<p>${Math.trunc(volum3 * 100)}</p>`;
}
