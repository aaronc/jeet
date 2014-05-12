'use strict';

/* Directives */

var colCount =0;

var jeet = {
  gutter: 3,
  parentFirst: false,
  layoutDirection : "LTR"
}


var getSpan = function (ratio) {
  var r = ratio || 1;
  return r * 100
};

var getColumn = function (ratios, g) {
  if (typeof ratios == 'number') {
    var tempRatio = [];
    tempRatio.push(ratios);
    ratios = tempRatio;
  }
  if (jeet.parentFirst !== true) {
    ratios = reverse(ratios);
  }
  var w = 100;
  ratios.forEach( function (ratio) {
    g = g / w * 100;
    w = 100 * ratio - g + ratio * g;
  })
  return [w,g];
};

var getLayoutDirection = function() {
  var result;
  jeet.layoutDirection === 'RTL' ? result = 'right' : result = 'left';
  return result;
};

var oppositeDirection = function (dir) {
  if (dir === 'left') {
    return 'right';
  }
  else if (dir === 'right'){
    return 'left';
  }
  else if (dir === 'ltr'){
    return 'rtl';
  }
  else if (dir === 'rtl') {
    return 'ltr';
  }
  else if (dir === 'top'){
    return 'bottom';
  }
  else if (dir === 'bottom') {
    return 'top';
  }
  else {
    console.log(dir+" is not a direction! Make sure your direction is all lowercase!");
    return false;
  }
};

var reverse = function (list) {
  var result = [];
  list.forEach( function (item){
    result.unshift(item);
  })
  return result;
};


var jeetApp = angular.module('myApp.directives', []);

//jeetApp.directive('appVersion', ['version', function (version) {
//  return function(scope, elm, attrs) {
//    elm.text(version);
//  };
//}]);



jeetApp.directive('jtColumn', function () {
  return {
    restrict: 'EA',
    link: function(scope, elm, attrs) {
      var ratios  = scope.$eval(attrs.ratios) || 1,
          offset  = scope.$eval(attrs.offset) || 0,
          cycle   = scope.$eval(attrs.cycle)  || 0,
          uncycle = scope.$eval(attrs.uncycle)|| 0,
          gutter  = scope.$eval(attrs.gutter) || 0,
          last    = attrs.last || false,
          marginL, marginLast = 0,
          side = getLayoutDirection(),
          index= elm.index() + 1;

          if(elm.children().length !== 0){
            for(var i =0; i<elm.children().length; i++){
            }

          }


      var columnWidths = getColumn(ratios, gutter)
      var marginR = columnWidths[1]

      if(offset !==0){
        if(offset < 0){
          offset *= -1;
          offset = getColumn(offset, columnWidths[1])[0];
          marginLast = offset + columnWidths[1] * 2;
          marginR = marginLast;
        }
        else {
          offset = getColumn(offset, columnWidths[1])[0];
          marginL = offset + columnWidths[1];
        }
      }
      //edit ? elm.find('*').css('background-color', 'rgba(0,0,0,0.2)') : false
      elm.css('clear', 'both');
      elm.css({
        float       : side,
        display     : 'inline',
        clear       : 'none',
        textAlign   : 'inherit',
        paddingLeft : '0',
        paddingRight: '0',
        width       : (columnWidths[0] )+ '%'
      })
      elm.css( 'margin-'+side, marginL + '%');
      elm.css( 'margin-'+oppositeDirection(side), marginR +'%');
      if(uncycle !== 0){
        if (index % uncycle !== 0 ) {
          elm.css('margin-'+oppositeDirection(side), marginR+'%');
          elm.css(float, side);
        }
        if (index % (uncycle +1) !== 0 ){
          elm.css('clear','none');
        }
      }
      if(cycle !== 0) {

      } else if(last) {
        elm.css( 'margin-'+oppositeDirection(side), marginLast+'%');
      }
    }
  };
});

jeetApp.directive('jtSpan', function () {
  return {
    link: function (scope, elm, attrs) {
      var ratio    = scope.$eval(attrs.ratio)  || 1,
          offset   = scope.$eval(attrs.offset) || 0,
          cycle    = scope.$eval(attrs.cycle)  || 0,
          uncycle  = scope.$eval(attrs.uncycle)|| 0,
          side     = getLayoutDirection(),
          spanWitdh= getSpan(ratio),
          marginL, marginR = 0

      if (offset !== 0) {
        if (offset < 0 ) {
          offset *= -1
          marginR = getSpan(offset)
        }
        else{
          marginL == getSpan(offset)
        }
      }
      elm.css({
        float       : side,
        display     : 'inline',
        clear       : 'none',
        paddingLeft : '0',
        paddingRight: '0',
        textAlign   : 'inherit',
        width       : spanWitdh + '%',
        marginLeft  : marginL + '%',
        marginRight : marginR + '%'
      })
    }
  };
});

jeetApp.directive('jtShift', function () {
  return {
    restrict: 'A',
    link: function (scope, elm, attrs) {
    }
  };
});

jeetApp.directive('jtEdit',  function () {
  return {
    restrict: 'A',
    link: function (scope, elm, attrs) {
      //edit = true;
      //document.body.querySelectorAll('body *')
      elm.find("body *").css({"background": "rgba(0, 0, 0, 0.2)"})
      $("body *").css({"background": "rgba(0, 0, 0, 0.2)"})
    }
  };
});



jeetApp.directive('jtCenter',  function () {
  return {
    restrict: 'A',
    link: function (scope, elm, attrs) {
      var maxWidth = attrs.maxWitdh || '800px',
          pad = scope.$eval(attrs.pad) || 0
      //edit ? elm.find('*').css('background-color', 'rgba(0,0,0,0.2)') : false
      elm.css({
        width       : 'auto',
        maxWidth    : maxWidth,
        float       : 'none',
        display     : 'block',
        marginRight : 'auto',
        marginLeft  : 'auto',
        paddingLeft : pad,
        paddingRight: pad
      })
    }
  };
});

jeetApp.directive('jtStack', function ($window) {
  return {
    restrict: 'AE',
    link: function (scope, elm, attrs) {
      var pad      = scope.$eval(attrs.pad)    || 0,
          align    = attrs.align               || false,
          first    = attrs.first || false,
          last     = attrs.last  || true,
          side     = getLayoutDirection(),
          stackOn  = 600;


      $(window).on('resize', function() {
        scope.width = $window.innerWidth
        if($window.innerWidth < 600 ) {
          elm.css({
            display: 'block',
            clear: 'both',
            float: 'none',
            width: '100%',
            'margin-left': 'auto',
            'margin-right': 'auto'
          })
        }
        if(first){
          elm.css('margin-'+side, 'auto');
        }
        if(last){
          elm.css('margin-'+oppositeDirection(side), 'auto');
        }
        if (pad != 0) {
          elm.css({
            'padding-left': pad,
            'padding-right': pad
          })
        }
        if (align !== false) {
          if (align === 'center' || align === 'c') {
            elm.css('text-align', 'center');
          }
          if (align === 'left' || align === 'l') {
            elm.css('text-align', 'left');
          }
          if (align === 'right' || align === 'r') {
            elm.css('text-align', 'right');
          }
        }
      })



    }
  };
});

jeetApp.directive('jtUnstack', function ($window) {
  return {
    restrict: 'A',
    link: function (scope, elm, attrs) {

      var side  = getLayoutDirection(),
          first = attrs.first || false,
          last  = attrs.last  || true;

      $(window).on('resize', function () {
        if($window.innerWidth > 600) {
          elm.css({
            display: 'inline',
            clear: 'none',
            width: 'auto',
            'margin-left': '0',
            'margin-right':'0'
          })
          if(first){
            elm.css('margin-'+side, '0');
          }
          if(last){
            elm.css('margin-'+oppositeDirection(side), '0')
          }
          if (jeet.layoutDirection === 'RTL'){
            elm.css('textAlign', 'right')
          }else {
            elm.css('textAlign', 'left')
          }
        }
      })
    }
  };
});

jeetApp.directive('jtAlign', function () {
  return {
    restrict: 'A',
    link: function (scope, elm, attrs) {
      var direction = attrs.direction || 'both',
          position  = 'absolute';

      if (direction === 'horizontal' || direction === 'h') {
        elm.css({
          left: '50%'
          //transform: translateX(-50%)///////
        });
      }else if (direction === 'vertical' || direction === 'v') {
        elm.css({
          top: '50%'
          //transform: translateY(-50%)/////////
        })
      }else {
        elm.css({
          top: '50%',
          left: '50%'
          //transform : translate(-50%, -50%)/////////
        })
      }
    }
  };
});



