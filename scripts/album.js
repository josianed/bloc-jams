// Example Album
 var albumPicasso = {
     name: 'The Colors',
     artist: 'Pablo Picasso',
     label: 'Cubism',
     year: '1881',
     albumArtUrl: 'assets/images/album_covers/01.png',
     songs: [
         { name: 'Blue', length: '4:26' },
         { name: 'Green', length: '3:14' },
         { name: 'Red', length: '5:01' },
         { name: 'Pink', length: '3:21'},
         { name: 'Magenta', length: '2:15'}
     ]
 };
 
 // Another Example Album
 var albumMarconi = {
     name: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { name: 'Hello, Operator?', length: '1:01' },
         { name: 'Ring, ring, ring', length: '5:01' },
         { name: 'Fits in your pocket', length: '3:21'},
         { name: 'Can you hear me now?', length: '3:14' },
         { name: 'Wrong phone number', length: '2:15'}
     ]
 };


 var createSongRow = function(songNumber, songName, songLength) {

         var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     return template;
 
 };

 var setCurrentAlbum = function(album) {
 
     var albumTitle = document.getElementsByClassName('album-view-title')[0];
     var albumArtist = document.getElementsByClassName('album-view-artist')[0];
     var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
     var albumImage = document.getElementsByClassName('album-cover-art')[0];
     var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
 
     albumTitle.firstChild.nodeValue = album.name;
     albumArtist.firstChild.nodeValue = album.artist;
     albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
     albumImage.setAttribute('src', album.albumArtUrl);
 
     albumSongList.innerHTML = '';
 
     for (i = 0; i < album.songs.length; i++) {
         albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
     }
 
 };


 var findParentByClassName = function(element, className) {

    var currentParent = element.parentElement;

    while (currentParent.className != className) {
        currentParent = currentParent.parentElement;
    }

    return currentParent;

 };

//always returns the element with the song item number class
 var getSongItem = function(element) {
    
    switch (element.className) {
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
            return findParentByClassName(element, 'song-item-number');
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        case 'song-item-title':
        case 'song-item-duration':
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        case 'song-item-number':
            return element;
        default:
            return;
    }
    
};

var clickHandler = function(targetElement) {

    var songItem = getSongItem(targetElement);

    if (currentlyPlayingSong === null) {
        //if no song currently playing, set the pause button on the song row that was clicked 
        //set currentlyPlayingSong to the clicked song's number
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
        //if the playing song is clicked again/paused, revert the button back to a play button
        songItem.innerHTML = playButtonTemplate;
        currentlyPlayingSong = null;
    } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
        //if new song is clicked, set content of new song to pause button
        var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
        currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    }

};


//Elements with listeners
 var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
 var songRows = document.getElementsByClassName('album-view-song-item');

 //Album button templates
 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

 //Store the state of playing songs
 var currentlyPlayingSong = null;
 
 window.onload = function() {
   
     setCurrentAlbum(albumPicasso);

     songListContainer.addEventListener('mouseover', function(event) {

        var songItem = getSongItem(event.target);
        var songItemNumber = songItem.getAttribute('data-song-number');

        if (songItemNumber !== currentlyPlayingSong) {
         //only target individual song rows during event delegation
         //switch to play button template when mouse moves over song row
             if (event.target.parentElement.className === 'album-view-song-item') {
                event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
             }
         }
     });

     for (i = 0; i < songRows.length; i++) {
        songRows[i].addEventListener('mouseleave', function(event) {
            
            //cache the song item & song number just left in a variable
            var songItem = getSongItem(event.target);
            var songItemNumber = songItem.getAttribute('data-song-number');

            //added a conditional to check if the item the mouse is leaving is not the current song
            //only change the content if it isn't
            if (songItemNumber !== currentlyPlayingSong) {
                songItem.innerHTML = songItemNumber;
            }
        });

        songRows[i].addEventListener('click', function(event) {
            clickHandler(event.target);
        });
     }
     
 };


