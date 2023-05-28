(function () {

  var container = document.querySelector('#container');
  var c = document.querySelector('canvas');
  var cx = c.getContext('2d');
  var pixels = 0;
  var imageData;
  var img;

  /* Mouse and touch events */
  var mousedown = false;
  var touched = false;

  document.getElementById('imageA').addEventListener('click', function (e) {
    paintletter(e.srcElement.currentSrc);
  })

  document.getElementById('imagea').addEventListener('click', function (e) {
    paintletter(e.srcElement.currentSrc);
  })

  document.getElementById('imagec').addEventListener('click', function (e) {
    paintletter(e.srcElement.currentSrc);
  })
  
  function paintletter(src) {
    c.width = container.offsetWidth;
    c.height = 460;
    cx.fillStyle = 'rgb(' + [255, 255, 255].join(',') + ')';
    cx.fillRect(0, 0, c.width, c.height);
    img = new Image();
    img.src = src;
    
    img.onload = function () {
      cx.drawImage(img, (c.width - img.width) / 2, (c.height - img.height) / 2);
      imageData = cx.getImageData((c.width - img.width) / 2, (c.height - img.height) / 2, img.width, img.height);
      
      for (var i = 0; i < imageData.data.length; i += 4) {
        if ((imageData.data[i] != 0 && imageData.data[i + 1] != 0 && imageData.data[i + 2] != 0) && (imageData.data[i] != 255 && imageData.data[i + 1] != 255 && imageData.data[i + 2] != 255)) {
          imageData.data[i] = 254;
          imageData.data[i + 1] = 254;
          imageData.data[i + 2] = 254;
        }
      }
      // put the altered data back on the canvas  
      cx.putImageData(imageData, (c.width - img.width) / 2, (c.height - img.height) / 2);
      pixels = cx.getImageData(0, 0, c.width, c.height);
    }
  }
  
  function getpixelclickamount(x, y, r, g, b) {
    pixels = cx.getImageData(x, y, 20, 20);
    var a = 0;
    for (i = 0; i < pixels.data.length; i += 4) {
      if (pixels.data[i] === r && pixels.data[i + 1] === g && pixels.data[i + 2] === b) {
        a++;
      }
    }
    return a;
  }
  
  function paint(x, y) {
    var colour = pixelcolour(x, y);
    var hasblack = getpixelclickamount(x - 20, y - 20, 0, 0, 0);
    var haswhite = getpixelclickamount(x - 20, y - 20, 254, 254, 254)
    if (hasblack || haswhite) {
      var rectData = cx.getImageData(x - 20, y - 20, 40, 40);
      for (var i = 0; i < rectData.data.length; i += 4) {
        if ((rectData.data[i] == 0 || rectData.data[i] == 254) && (rectData.data[i + 1] == 0 || rectData.data[i + 1] == 254) && (rectData.data[i + 2] == 0 || rectData.data[i + 2] == 254)) {
          rectData.data[i] = 255;
          rectData.data[i + 1] = 0;
          rectData.data[i + 2] = 0;
        }
      }
      // put the altered data back on the canvas  
      cx.putImageData(rectData, x - 20, y - 20);
    } else {
      if (colour.r ===  255 && colour.g === 0 && colour.b === 0) {
        cx.strokeStyle = 'rgb(' + [255, 0,0].join(',') + ')';
      } else {
        cx.strokeStyle = 'rgb(' + [255, 255, 255].join(',') + ')';
      }
    }
  }
  
  function pixelcolour(x, y) {
    pixels = cx.getImageData(0, 0, c.width, c.height)
    var index = ((y * pixels.width) + x) * 4;
    return {
      r: pixels.data[index],
      g: pixels.data[index + 1],
      b: pixels.data[index + 2],
      a: pixels.data[index + 3]
    };
  }

  /* Mouse event listeners */

  function onmouseup(ev) {
    ev.preventDefault();
    mousedown = false;
  }
  
  function onmousedown(ev) {
    ev.preventDefault();
    mousedown = true;
  }
  
  function onmousemove(ev) {
    ev.preventDefault();
    if (mousedown) {
      paint(ev.clientX, ev.clientY - 90)
      ev.preventDefault();
    }
    }
  
  /* Touch event listeners */
  
  function ontouchstart(ev) {
    touched = true;
  }
  
  function ontouchend(ev) {
    touched = false;
  }
  
  function ontouchmove(ev) {
    if (touched) {
      paint(
        ev.changedTouches[0].pageX,
        ev.changedTouches[0].pageY - 90
        );
        ev.preventDefault();
      }
    }
    /* c event handlers */
    
    c.addEventListener('mouseup', onmouseup, false);
    c.addEventListener('mousedown', onmousedown, false);
    c.addEventListener('mousemove', onmousemove, false);
    c.addEventListener('touchstart', ontouchstart, false);
    c.addEventListener('touchend', ontouchend, false);
    c.addEventListener('touchmove', ontouchmove, false);

    setTimeout(function () {
      paintletter('http://localhost:3060/A1.png')
    }, 100)
  })();
