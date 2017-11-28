(function () {
  'use strict';

  angular
    .module('releases')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['ReleasesService', '$http', '$rootScope', '$timeout'];

  function HomeController(ReleasesService, $http, $rootScope, $timeout) {

    var vm = this;

    vm.oneAtATime = false;

    vm.releases = ReleasesService.query();

    // Variables to hold text for different titles and blurbs in the view
    vm.bannerText = 'Just One Drop.';
    vm.ParallaxCaption1 = 'Introducing: t*Rez';
    vm.Heading1 = 'Your Next Source of Antioxidant Benefits';
    vm.Heading2 = 'Now Making its Way in to All Your Favorite Products';
    vm.mainText1 = 'This is a blurb that serves to briefly summarize the initial product video featured above, and reaffirm the impact and power of this product to bring the heart-healthy, antioxidant-based benefits of resveratrol into the new t*Rez solution. This blurb should entice the reader to continue down the page to explore different artifacts (articles, releases, studies, etc).';
    vm.ParallaxCaption2 = 'In The News';
    vm.ReleasesHeading = 'This Just In';
    vm.ReleasesText = 'This is a blurb that introduces what the world is saying about antioxidants, resveratrol, and t*Rez.';

    vm.status = { isCustomHeaderOpen: false, isFirstOpen: true, isFirstDisabled: false };


    vm.animation_length = 15;
    vm.animation_length = vm.animation_length.toString() + 's';


    if ($rootScope.first_time === undefined) {
      $rootScope.hide_main = true;
      $rootScope.hide_animation = false;
      $rootScope.hide_footer = true;
      $rootScope.hide_header = true;
    }

    // Animation stuff


    var transform_x = function (x) {
      return x * 760 / 3.140;
    };

    var transform_y = function (y) {
      return y * -40 + 300;
    };


    vm.readCSV = function () {
        // http get request to read CSV file content
      $http.get('/modules/core/client/img/animation').success(vm.processData).error(vm.processError);
    };

    vm.processError = function (error) {
      console.log('Error' + error);
    };

    vm.line_path = '';
    vm.drop_path = '';
    vm.processData = function (allText) {
        // split content based on new line
      var allTextLines = allText.split(/\r\n|\n/);
      var headers = allTextLines[0].split(',');
      var lines = [];
      var xs = [];

      for (var i = 0; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length === headers.length) {
          var tarr = [];
          for (var j = 0; j < headers.length; j++) {
            var f = parseFloat(data[j]);
            tarr.push(transform_y(f));
          }
          lines.push(tarr);
        }
      }

      for (var i = 0; i !== lines[0].length; ++i) {
        xs.push(transform_x(i * 0.01));
      }

      vm.data = lines;

      var line_frames = [];
      for (var i = 0; i !== lines.length; ++i) {
        var frame_path = '';
        for (var j = 0; j !== lines[0].length - 1; ++j) {
          var p1_x = xs[j];
          var p2_x = xs[j + 1];

          var p1_y = lines[i][j];
          var p2_y = lines[i][j + 1];

          var path = 'M' + p1_x + ',' + p1_y + ',' + 'L' + p2_x + ',' + p2_y;
          frame_path += path;
        }
        var line_path_str = frame_path + ';';
        line_frames.push(line_path_str);
      }

      var num_drop_frame = 20;
      var last_drop_path = 0;
      var last_drop_path_first = 0;
      var last_text_path = 290;
      var start_moving_up_frame = 25;
      var moving_up_length = 30;
      var drop_end_y = 50;
      var text_end_y = 50;

      var drop_dy = 0;
      var text_dy = 0;


      vm.text_path = '';

        // Please dear god, make this code not have an off by one error.
      for (var i = 0; i !== line_frames.length + num_drop_frame; ++i) {
        var line_frame_index = i - num_drop_frame;

        if (i < num_drop_frame) { // Make the drop go down, don't change the line
          var drop_path_int = -20 + i * (330 / num_drop_frame);
          var drop_path_str = drop_path_int.toString() + ';';
          vm.drop_path += drop_path_str;
          vm.text_path += '290;';
          vm.line_path += 'M0,300 L 760, 300;';
          last_drop_path_first = drop_path_int;
        } else if (i < num_drop_frame + 5) { // Make the drop go up, wiggle the line

          var offset = line_frame_index + 1;
          var drop_path_int = last_drop_path_first - offset * (4 / offset);
          var drop_path_str = drop_path_int.toString() + ';';
          last_drop_path = drop_path_int;
          vm.drop_path += drop_path_str;
          vm.text_path += '290;';
          vm.line_path += line_frames[line_frame_index];

        } else { // Don't change the drop wiggle the line
          var drop_path_str = last_drop_path.toString() + ';';
          vm.drop_path += drop_path_str;
          vm.line_path += line_frames[line_frame_index];
          vm.text_path += '290;';
        }
      } // end for loop

      document.getElementById('drop').beginElement();
      document.getElementById('line').beginElement();

      // Setting the timeout after the csv loads
      $timeout(function () {
        $rootScope.hide_animation = true;
        $rootScope.first_time = true;
      }, 6000);

      $timeout(function () {
        $rootScope.hide_main = false;
        $rootScope.hide_footer = false;
        $rootScope.hide_header = false;
      }, 7500);
    };

    if ($rootScope.first_time === undefined) {
      vm.readCSV();
    }
  }
}());
