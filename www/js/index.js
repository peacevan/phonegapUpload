  
var app = {
  // Application Constructor
  initialize: function () {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
	
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function () {
    this.receivedEvent('deviceready');
  },

  // Update DOM on a Received Event
  receivedEvent: function (id) {
	$('#uploadsucess').append('<b>Lista de imagens:</b>' );
	 try {
	  //this.loadPhotos();
	  
	 }
     catch (e) {
       console.log('error'+ e);
	   alert('error'+ e);
     }
		
  },

  requestAuthorization: function (action) {
    var self = this;
      cordova.plugins.photoLibrary.requestAuthorization( //recursivo
	 
      function () {
        // Retry
		 alert('requestAuthorization');
		if(action=='loadPhotos'){
		  alert('load foto em autorizaça');
         self.loadPhotos();
		}
		else if(action=='getNomeOriginalFoto'){
			 alert('getNomeOriginalFoto em autorizaça');
			self.getNomeOriginalFoto();
		}
      },
      function (err) {
        console.log('Error in requestAuthorization: ' + err);
        // TODO: explain to user why you need the permission, and continue when he agrees
        // Ask user again
		
        self.requestAuthorization(action);
      }, {
        read: true,
        write: false 
      }
    );

  },
  
  //LER A ULTIMAFOTO TIRADA
  getNomeOriginalFoto: function () {
	 
    var self = this;
      cordova.plugins.photoLibrary.getLibrary(
      function (chunk) {
		 try{
        var isLastChunk = chunk.isLastChunk;
        var library = chunk.library;
        if (isLastChunk) {
			//  console.log(libraryItem.id);          // ID of the photo
			//  console.log(libraryItem.photoURL);    // Cross-platform access to photo
			//  console.log(libraryItem.thumbnailURL);// Cross-platform access to thumbnail
			//  console.log(libraryItem.fileName);
			//	console.log(libraryItem.width);
			//	console.log(libraryItem.height);
			//	console.log(libraryItem.creationDate);
			//	console.log(libraryItem.latitude);
			//	console.log(libraryItem.longitude);
			//	console.log(libraryItem.albumIds); 
			//	libraryItem=libraryItem[array.length-1]
     	    return library[library.length-1].fileName;
         }
	}
	catch (e) {
      alert('error'+ e);
	  console.log('error'+ e);
		          }
    },
      function (err) {
        if (err.startsWith('Permission')) {
          console.log('Please provide the permission');
          self.requestAuthorization('getNomeOriginalFoto');
        } else { // Real error
          console.log('Error in getLibrary: ' + err);
        }
      }, {
        //chunkTimeSec: 0.3,
      }
    );

  },
  //FIM
  
  //LER TODAS AS FOTOS DA GALERIA
  loadPhotos: function () {
   
    var self = this;
      cordova.plugins.photoLibrary.getLibrary(
      function (chunk) {
		  alert('chunk');
        var isLastChunk = chunk.isLastChunk;
        var library = chunk.library;
        if (isLastChunk) {
          // Here we have the library as array
          //self.initializePhotoSwipe(library); lista todos as fotos
		  //loop das fotos
	    library.forEach(function(libraryItem){ 
		    //se  a foto foi tirada hoje faz upload da foto
		    try {
				var data = new Date(); 
		    	if (libraryItem.creationDate.toLocaleDateString()==data.toLocaleDateString()) {
					self.initializeUpload(libraryItem);//faz upload das imagens
				  }
				 }
                 catch (e) {
                      console.log('error'+ e);
                  }
		//
    });
          
     }
    },
      function (err) {
        if (err.startsWith('Permission')) {
          console.log('Please provide the permission');
          // TODO: explain to user why you need the permission, and continue when he agrees
          self.requestAuthorization();
        } else { // Real error
          console.log('Error in getLibrary: ' + err);
        }
      }, {
        //chunkTimeSec: 0.3,
      }
    );

  },

  initializePhotoSwipe(library) {

    var pswpElement = document.querySelectorAll('.pswp')[0];

    var items = library.map(function(libraryItem) {
      return {
        src:   libraryItem.photoURL,
        w:     libraryItem.width,
        h:     libraryItem.height,
        title: libraryItem.fileName,
      };
    });

    // define options (if needed)
    var options = {
      // optionName: 'option value'
      // for example:
      index: 0, // start at first slide
      tapToClose: false,
      clickToCloseNonZoomable: false,
      pinchToClose: false,
      closeOnVerticalDrag: false,
      closeOnScroll: false,
    };

    // Initializes and opens PhotoSwipe
    var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();

  },
  
  
   // Change image source and upload photo to server
  initializeUpload(libraryItem) {
	           
				/*console.log(libraryItem.id);          // ID of the photo
				console.log(libraryItem.photoURL);    // Cross-platform access to photo
				console.log(libraryItem.thumbnailURL);// Cross-platform access to thumbnail
				console.log(libraryItem.fileName);
				console.log(libraryItem.width);
				console.log(libraryItem.height);
				console.log(libraryItem.creationDate);
				console.log(libraryItem.latitude);
				console.log(libraryItem.longitude);
				console.log(libraryItem.albumIds);    // array of ids of appropriate AlbumItem, only of includeAlbumsData was used
			    */
				var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = libraryItem.fileName;   //imageURI.substr(imageURI.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                var params = {};
                params.value1  = "test";
                params.value2  = "param";
				params.uuid    = device.uuid;
                options.params = params;
                options.chunkedMode = false;
				try {
				  var ft = new FileTransfer();
                  }
                 catch (e) {
                      alert('error'+ e);
					  console.log('error'+ e);
		          }
		        ft.upload(libraryItem.photoURL, "http://ssasgo-com.umbler.net/sgo/upload.php", function(result){
        		$('#uploadsucess').append('<br><b>'+libraryItem.fileName+'</b>' );
	           }, function(error){
                    alert('error : ' + JSON.stringify(error));
					return false;
                }, options);
                
            },



            // Change image source and upload photo to server
  onSuccess:function  (imageURI) {
                // Set image source
                var image = document.getElementById('img');
                image.src = imageURI  + '?' + Math.random();
                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                
                var params = {};
                params.value1 = "test";
                params.value2 = "param";
                params.uuidCelular = device.uuid;
                options.params = params;
                options.chunkedMode = false;
				
				salvarImagem(targetPath);
				

                var ft = new FileTransfer();
                ft.upload(imageURI, "http://ssasgo-com.umbler.net/sgo/upload.php", function(result){
               // ft.upload(imageURI, "http://demo.makitweb.com/phonegap_camera/upload.php", function(result){ 
				alert('successfully uploaded ' + result.response);
                }, function(error){
                    alert('error : ' + JSON.stringify(error));
                }, options);
            },
              // take picture from camera
  but_take(){ 
       		var self = this;			  
			    navigator.camera.getPicture(this.onSuccess,this.onFail,{ quality: 20,
                    destinationType: Camera.DestinationType.FILE_URL 
                });
				nomeOriginalFoto= self.getNomeOriginalFoto();
				$('#uploadsucess').html('');
				$('#uploadsucess').append('<b>Nome Original da Foto:</b>'+nomeOriginalFoto);
            },
            // upload select 
  but_select(){
                navigator.camera.getPicture(this.onSuccess,this.onFail,{ quality: 50,
                    sourceType:2, //Camera.PictureSourceType.PHOTOLIBRARY, 
                    allowEdit: true,
                    destinationType: Camera.DestinationType.FILE_URI
                });
                
            },

           
            onFail:function (message) {
                alert('Failed because: ' + message);
            },
    
		
 salvarImagem:(targetPath){		
       //var targetPath = cordova.file.externalDataDirectory + Constants.APP_DIR_IMAGES + "/IMG-" + new Date().getTime()+ '&ext=.jpg';
    	cordova.plugins.photoLibrary.saveImage(targetPath, "com.terikon.PhotoLibraryDemoPhotoSwipe", function (libraryItem) {
    		console.log(libraryItem);
    	}, function (err) {
    		console.log(err);
    	});
},
getImagem:(){
	
}
			
};

app.initialize();
