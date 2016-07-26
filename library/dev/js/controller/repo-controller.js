(function() {
  var app = angular.module( 'RepoExplorer', [ 'KodeBeagleRepoExplore'] );
  app.controller( 'repoExplorerController', [
    '$scope',
    '$location',
    'model',
    'http',
    function(
        $scope,
        $location,
        model,
        http
    ) {
        var fileName = document.location.search.split('?filename=')[1];

        init();

        function init() {
          var splitFile = fileName.split('/');
          fileRepo = splitFile[0]+'/'+splitFile[1];
          var encodedFileName = encodeURIComponent(fileRepo);
          var url = model.config.esURL
                    + '/repodetails'
                    + '/'+ encodedFileName;
          //basepath +"library/data/source.txt"
          http.get(url)
          .then(repoDetailsHandler,failureHandler);
        }

        function repoDetailsHandler(res) {
          $scope.showMessage = true;
          if (!res) {
            $scope.dataLoaded = false;
          }

          if (res && res.length > 0) {
            var repoInfo = res[0];
            $scope.summary = repoInfo.gitHubInfo;
            $scope.mostChanged = repoInfo.gitHistory.mostChanged;
            $scope.dataLoaded = true;
          }
          
          $scope.data = {
            commits: $scope.repoInfo
          }
          $scope.options = {
            margin: {top: 20, right:0},
            series: [
              {
                  axis: "y",
                  dataset: "commits",
                  key: "count",
                  color: "#1f77b4",
                  type: ["line"],
                  label: "Commits in the repository",
                  id: 'repoCommits'
              }
            ],
            axes: {
              x: {
                key: "name",
                type: "date"
              }
            }
          }
        }

        function failureHandler(error) {
          $scope.showMessage = true;
          $scope.dataLoaded = false;
        }
      }
  ])
  .filter('countFormatter', function() {
    return function(input) {
      input = input = (input/1000);
      return input.toFixed(2) + 'k';
    };
  });

  angular.bootstrap( document, [ 'RepoExplorer' ] );
})();