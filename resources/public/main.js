angular.module('fileUpload', [ 'angularFileUpload' ])

.controller('MyCtrl',[ '$scope', '$http', '$timeout', '$upload', '$location', function($scope, $http, $timeout, $upload, $location) {
    var profile = Number($location.search().account);
    console.log(profile)
    $scope.fileReaderSupported = window.FileReader != null;
    $scope.uploadRightAway = false;
    $scope.changeAngularVersion = function() {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    }
    $scope.hasUploader = function(index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function(index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? window.location.hash.substring(1) : '1.2.0';
    $scope.onFileSelect = function($files) {
        $scope.selectedFiles = [];
        $scope.progress = 0;
        if ($scope.upload && $scope.upload.length > 0) {
            for (var i = 0; i < $scope.upload.length; i++) {
                if ($scope.upload[i] != null) {
                    $scope.upload[i].abort();
                }
            }
        }
        $scope.upload = [];
        $scope.uploadResult = [];
        $scope.selectedFiles = $files;
        $scope.dataUrls = [];
        $scope.uploadCount = 0;
        for ( var i = 0; i < $files.length; i++) {

            $scope.uploadCount++;
            var $file = $files[i];
            if (window.FileReader) {
                var fileReader = new FileReader();
                fileReader.readAsBinaryString($files[i]);
                function setPreview(fileReader, index) {
                    fileReader.onload = function(e) {
                        console.log(e)
                        $timeout(function() {
                            $scope.uploadCount--;
                            $scope.dataUrls[index] = e.target.result;
                        });
                    }
                }
                setPreview(fileReader, i);
            }
        }
    }

    $scope.uploadCount = 0;
    $scope.start = function() {
        $scope.progress = 0;
        var zip = new JSZip();
        for(var x = 0; x < $scope.dataUrls.length; x++) {
            zip.file($scope.selectedFiles[x].name, $scope.dataUrls[x], {binary: true});
        }

        var content = zip.generate();

        var mb100 = 1048576 * 100;
        if(content.length > mb100) {
            var blobs = []
            for (var i = 0; (i + 1) * 1e6 < content.length; i++) {
                blobs.push(content.slice(i * 1e6, (i + 1) * 1e6))
            }
            console.log(blobs)


            var formData = new FormData();
            for (var i = 0; i < blobs.length; i++)
                formData.append("slice" + i, blobs[i], file.name + ".part" + i);
        }

        $scope.upload[$scope.uploadCount] = $upload.upload({
            url : '/upload',
            method: "POST",
            data : {
            },
            file: content,
            fileFormDataName: 'myFile'
        })
            .then(function(response) {
                $scope.uploadResult.push(response.data);
            }, null, function(evt) {
                $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
            }).xhr(function(xhr){
                xhr.upload.addEventListener('abort', function(){console.log('aborted complete')}, false);
            });
    }
} ])

