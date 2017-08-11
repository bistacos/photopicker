angular.module('iFlyPurchaserController', ['ngDialog', 'toaster'])

	.controller('mainController', ['$scope', '$http', 'ngDialog', 'toaster', function($scope, $http, ngDialog, toaster) {
		$scope.formData = {};
		$scope.states = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL',
										 'IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT',
										 'NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI',
										 'SC','SD','TN','TX','UT','VT','VA','WA', 'WV','WI','WY'];

		// local copy of which photos to hide (purchased already but not in this session)
		// (resets on page refresh)
		var hiddenIds = [];
		var dialog;

		function init() {
			getPhotos(true);
		}
		// delete all records from the DB and seed with data...demo purposes only
		function clearAndSeedDb() {
			$http.delete('/api/photos/all')
				.success(function(data) {
					$http.post('/api/photos/seed')
					.success(function(data) {
						$scope.photos = data;
					});
				});
		}

		function getPhotos(init) {
			$http.get('/api/photos/')
				.success(function(data) {
					$scope.photos = data;
						// if we're loading the page for the first time,
						// loop through photos and flag if already purchased
						var keys = Object.keys($scope.photos);
						for (var i=0, l=keys.length; i<l; i++) {
							if ($scope.photos[keys[i]].purchased && init) {
								$scope.photos[keys[i]].hide = true;
								hiddenIds.push($scope.photos[keys[i]].id);
							} else if ($scope.photos[keys[i]].purchased && hiddenIds.indexOf($scope.photos[keys[i]].id) >= 0) {
								$scope.photos[keys[i]].hide = true;
							}
						}
				});
		}

		function makePurchase(formData) {
			var keys = Object.keys($scope.photos);
			var purchasedIds = [];
			for (var i=0, l=keys.length; i<l; i++) { // much easier with lodash, but this is a lightweight app
				if ($scope.photos[keys[i]].selected) purchasedIds.push($scope.photos[keys[i]].id);
			}
			$http.post('/api/photos/purchased', { purchasedIds })
				.success(function(data) {
					getPhotos();
				});
		}

		$scope.openCheckoutDialog = function() {
			dialog = ngDialog.open({
	      template: 'views/dialogs/checkoutDialog.html',
	      closeByEscape: true,
	      scope: $scope,
	      closeByNavigation: true,
	      className: 'ngdialog-theme-default',
	      width: '600px'
	    });
		};

		$scope.validateInputs = function() {
			var toasterError;
			var cardNumberDigitsOnly = ($scope.formData.cardNumber || '').replace(/\D/g,'');
			var ccvDigitsOnly = ($scope.formData.ccv || '').replace(/\D/g,'');

			if (!$scope.formData.firstName) { toasterError = 'Please enter your first name'; }
			else if (!$scope.formData.lastName) { toasterError = 'Last name is a required field'; }
			else if (!$scope.formData.address) { toasterError = 'Address is a required field'; }
			else if (!$scope.formData.state) { toasterError = 'State is a required field'; }
			else if (!$scope.formData.zip) { toasterError = 'Zip code is a required field'; }
			else if (!$scope.formData.cardNumber) { toasterError = 'cardNumber is a required field'; }
			else if (!$scope.formData.ccv) { toasterError = 'CCV is a required field'; }
			else if (!$scope.formData.expiryDate) { toasterError = 'Expiration Date is a required field'; }

			else if ($scope.formData.zip.length !== 5 || !Number($scope.formData.zip) ) { toasterError = 'Please enter a valid Zip code'; }
			else if (cardNumberDigitsOnly.length !== 16) { toasterError = "Please enter your 16-digit card number using numeric characters and dashes only"; }
			else if (ccvDigitsOnly.length !== 3) { toasterError = "Please enter your 3-digit CCV (found on the back of your credit card) using numeric characters and dashes only"; }

			if (toasterError) {
				toaster.pop('error', 'Error', toasterError, 5000);
			} else {
				makePurchase($scope.formData);
				$scope.formData = {};
				dialog.close();
				toaster.pop('success', 'Success!', 'Thank you for your purchase!', 5000);
			}
		};

		$scope.toggleSelected = function(photo) {
			if (photo.purchased) { photo.selected = false; }
			else { photo.selected = !photo.selected; }
		};

		$scope.startOver = function() {
			clearAndSeedDb();
			hiddenIds = [];
		};

		init();
	}]);
