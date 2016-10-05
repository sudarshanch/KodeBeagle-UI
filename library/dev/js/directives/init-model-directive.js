(function( module ) {
  var processedData={};
  module.directive('initModel', [
    'model',
    '$location',
    '$rootScope',
    'docsService',
    '$document',
    function(model, $location, $rootScope, docsService, $document) {


      docsService.config(model.config);

      var backTotop = angular.element( document.getElementById( 'back-to-top' ) )
      var navEle = angular.element( document.getElementById( 'header-nav' ) );
      var bodyEle = angular.element( document.body );
      var prevScrollTop;

      $document.bind( 'scroll', function( e ) {
        var topOffset = document.body.scrollTop;
        if( topOffset > 5 ) {
          backTotop.addClass( 'show' );

        } else {
          backTotop.removeClass( 'show' );
          navEle[0].style.top = '';
          bodyEle.removeClass( 'stick-to-top' );
          return;
        }

        if( prevScrollTop > topOffset ) {
          bodyEle.addClass( 'stick-to-top' );

          setTimeout( function  () {
            navEle[0].style.top = '0px';
          }, 10 );

        } else {
          navEle[0].style.top = '';
          setTimeout( function  () {
            bodyEle.removeClass( 'stick-to-top' );
          }, 100 );
        }


        prevScrollTop = topOffset;
      } );

      backTotop.bind( 'click', function( e ) {
        e.preventDefault();
        window.scrollTo(0, 0);
      } )

      return {
        controller: ['$scope', '$rootScope', function(scope, $rootScope) {

          scope.model = model;
          scope.$watch(function() {
            return $location.search().searchTerms + $location.search().searchType;
          }, function(params) {
            model.currentPageNo = 0;
            var queryParams = $location.search();
            var selectedTexts = JSON.parse(queryParams.searchTerms);
            model.repos = false;
            model.selectedTexts = [];
            $rootScope.editorView = false;
            model.showErrorMsg = false;

            if (selectedTexts) {
              model.selectedTexts = selectedTexts;
              model.searchedData = _.pluck(model.selectedTexts, 'term').join(', ');
              model.searchOptions.selectedSearchType = queryParams.searchType;
              if(model.searchOptions.selectedSearchType === model.langConstants.JAVA_SCRIPT){
                model.searchOptions.langType = 'js';
              }
              else{
                model.searchOptions.langType = 'java'
              }
              model.showPageResponse = true;
              $rootScope.editorView = true;
              docsService.searchRequest(model.selectedTexts);

              document.getElementById( 'searchText' ) && document.getElementById( 'searchText' ).blur();
              model.isCode = false;
              model.packages = false;

            }
          });

          scope.$watch(function() {
            return $location.search().filter;
          }, function( newval, oldval ) {

            model.currentPageNo = 0;
            if( !newval ) {
              newval = '{}';
              model.packages = false;
            } else {
              model.packages = JSON.parse(newval);
            }
            if( newval || oldval ) {
              //KB.updateEditorsList( processedData.result, model.packages, model,  docsService );
            }

          });
        }]
      };
    }
  ]);
} )(KB.module);
