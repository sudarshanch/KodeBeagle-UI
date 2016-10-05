(function( module ) {
	module.directive('dropDownClose', ['$document',function($document) {
    return {
        restrict:'A',
        link:function(scope, element){
          $document.bind('click', function(event){
          var isClickedElementChildOfPopup = element.parents('.search-main-container')
            .find(event.target)
            .length > 0;
          scope.moreTerms = false;

          if (isClickedElementChildOfPopup)
            return;

          scope.isOpen = false;
          scope.$apply();
        });
        }
      }
  }])
} )(KB.module);
