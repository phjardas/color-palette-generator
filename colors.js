var RGB = function(r, g, b) {
  this.r = r;
  this.g = g;
  this.b = b;

  this.hex = function() {
    return (
        (this.r + 0x10000).toString(16).substr(-2)
      + (this.g + 0x10000).toString(16).substr(-2)
      + (this.b + 0x10000).toString(16).substr(-2)
    ).toUpperCase();
  }
  
  this.rgb = function() {
    return this;
  }
      
  this.hsl = function() {
  	var r = this.r / 255;
  	var g = this.g / 255;
  	var b = this.b / 255;

    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    
    var l = (max + min) / 2;
    var s = 0;
    var h = 0;
        
    if (max != min) {
      if (l < .5) {
        s = (max - min) / (max + min);
      } else {
        s = (max - min) / (2 - max - min);
      }
      
      if (r == max) {
        h = (g - b) / (max - min);
      } else if (g == max) {
        h = 2 + (b - r) / (max - min);
      } else if (b == max) {
        h = 4 + (r - g) / (max - min);
      }
    }
    
    h = (Math.round(h * 60 * 100) / 100) % 360;
    while (h < 0) h += 360;
    
    s = Math.round(s * 100 * 100) / 100;
    l = Math.round(l * 100 * 100) / 100;
  	
  	return new HSL(h, s, l);
  }
  
  this.toString = function() {
    return 'RGB(' + r + ', ' + g + ', ' + b + ')';
  }
}

var HSL = function(h, s, l) {
  this.h = h;
  this.s = s;
  this.l = l;
  
  this.add = function(h, s, l) {
    var h = (this.h + h) % 360;
    while (h < 0) h += 360;
    
    s = Math.max(Math.min(this.s + s, 100), 0);
    l = Math.max(Math.min(this.l + l, 100), 0);
    
    return new HSL(h, s, l);
  }

  this.multiply = function(h, s, l) {
    var h = (this.h * h) % 360;
    while (h < 0) h += 360;
    
    s = Math.max(Math.min(this.s * s, 100), 0);
    l = Math.max(Math.min(this.l * l, 100), 0);
    
    return new HSL(h, s, l);
  }
  
  this.hsl = function() {
    return this;
  }

  function findColor(p1, p2, h) {
    h = h % 360;
    while (h < 0) h += 360;
    
    if (h < 60) {
      return p1 + (p2 - p1) * h / 60;
    }
    
    if (h < 180) {
      return p2;
    }
    
    if (h < 240) {
      return p1 + (p2 - p1) * (240 - h) / 60;
    }
    
    return p1;
  }
  
  this.rgb = function() {
    var l = this.l / 100;
    var s = this.s / 100;
    
    var r = 0, g = 0, b = 0;

    if (s == 0) {
      r = l;
      g = l;
      b = l;
    } else {
      var p2 = (l <= .5) ? (l * (1 + s)) : (l + s - (l * s));
      var p1 = 2 * l - p2; 
      r = findColor(p1, p2, this.h + 120);
      g = findColor(p1, p2, this.h);
      b = findColor(p1, p2, this.h - 120);
    }
    
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);

    return new RGB(r, g, b);  
  }
 
  this.hex = function() {
    return this.rgb().hex();
  }
  
  this.toString = function() {
    return 'HSL(' + h + ', ' + s + ', ' + l + ')';
  }
}


$(function() {
  function set(index, col) {
    var hex = '#' + col.hex();
    var rgb = col.rgb();
    var hsl = col.hsl();
                                                
    $('#swatch-' + index + ' .col').css('background', hex);
    $('#swatch-' + index + ' .rgb').text('rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')');
    $('#swatch-' + index + ' .hsl').text('hsl(' + Math.round(hsl.h) + ', ' + Math.round(hsl.s) + ', ' + Math.round(hsl.l) + ')');
    $('#swatch-' + index + ' .hex').text(hex);
  }

  function update() {
    var r = parseInt($('#r').val());
    var g = parseInt($('#g').val());
    var b = parseInt($('#b').val());
    
    var rgb = new RGB(r, g, b);
    var hsl = rgb.hsl();
    
    $('#h').val(Math.round(hsl.h));
    $('#s').val(Math.round(hsl.s));
    $('#l').val(Math.round(hsl.l));
    $('#hex').val(rgb.hex());
    
    set(0, rgb);
    set(1, hsl.add(30, 0, 0));
    set(2, hsl.add(60, 0, 0));
    set(3, hsl.add(90, 0, 0));
    set(7, hsl.add(120, 0, 0));
    set(11, hsl.add(150, 0, 0));
    set(15, hsl.add(180, 0, 0));
    set(14, hsl.add(210, 0, 0));
    set(13, hsl.add(240, 0, 0));
    set(12, hsl.add(270, 0, 0));
    set(8, hsl.add(300, 0, 0));
    set(4, hsl.add(330, 0, 0));

    set(5, hsl.multiply(1, .25, 1));
    set(6, hsl.add(90, 0, 0).multiply(1, .25, 1));
    set(9, hsl.add(270, 0, 0).multiply(1, .25, 1));
    set(10, hsl.add(180, 0, 0).multiply(1, .25, 1));
  }
  
  var swatches = $('#swatches');
  for (var i = 0; i < 16; i++) {
    var s = $('<div>').attr('id', 'swatch-' + i).addClass('swatch');
    s.append($('<span>').addClass('col'));
    $('<div>').addClass('details').append($('<span>').addClass('rgb')).append($('<span>').addClass('hsl')).append($('<span>').addClass('hex')).appendTo(s);
    swatches.append(s);
  }

  $('#r').val(Math.floor((Math.random() * 255) + 1));
  $('#g').val(Math.floor((Math.random() * 255) + 1));
  $('#b').val(Math.floor((Math.random() * 255) + 1));
  update();

  $('#color-selector-form').submit(function() {
    return false;
  });
  
  $('#r, #g, #b').change(update);
});
