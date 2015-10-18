var createSongRow = function(songNumber, songName, songLength) {

         var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     var $row = $(template);

     var clickHandler = function() {

        var songNumber = parseInt($(this).attr('data-song-number'));

        if (currentlyPlayingSongNumber !== null) {
            // Revert to song number for currently playing song because user started playing new song.
            var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
            // var currentlyPlayingCell = (getSongNumberCell() + '[data-song-number="' + currentlyPlayingSongNumber + '"]');
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }

        if (currentlyPlayingSongNumber !== songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            $(this).html(pauseButtonTemplate);
            setSong(songNumber - 1);
            updatePlayerBarSong();
        }

        else if (currentlyPlayingSongNumber === songNumber) {
            // Switch from Pause -> Play button to pause currently playing song.
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            setSong(null);
            // currentlyPlayingSongNumber = null;
            // currentSongFromAlbum = null;
        }

    };


     var onHover = function(event) {

        var songNumberCell = $(this).find('.song-item-number');
        // var songNumberCell = $(this).getSongNumberCell();
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };
     
    var offHover = function(event) {

        var songNumberCell = $(this).find('.song-item-number');
        // var songNumberCell = $(this).getSongNumberCell();
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
    };


     $row.find('.song-item-number').click(clickHandler);
     // $row.getSongNumberCell(songNumber).click(clickHandler);
     $row.hover(onHover, offHover);

     console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);

     return $row;
 
 };


 var setCurrentAlbum = function(album) {
     currentAlbum = album;
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     $albumTitle.text(album.name);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     $albumSongList.empty();
 
     for (i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
         $albumSongList.append($newRow);
     }
 
 };

 var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
 };

 var updatePlayerBarSong = function() {

    var songName = $('.currently-playing .song-name');
    var artistName = $('.currently-playing .artist-name');
    var artistSongMobile = $('.currently-playing .artist-song-mobile');

    songName.text(currentSongFromAlbum.name);
    artistName.text(currentAlbum.artist);
    artistSongMobile.text(currentSongFromAlbum.name + " - " + currentAlbum.artist);

    $('.main-controls .play-pause').html(playerBarPauseButton);

 };

 var nextSong = function() {

    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    var getLastSongNumber = function(index) {
        if (index === 0) {
            return currentAlbum.songs.length;
        } else {
            return index;
        }
    };

    setSong(currentSongIndex);
    // currentlyPlayingSongNumber = currentSongIndex + 1;
    // currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    //updatePlayerBarSong() function, but modifying left controls
    var songName = $('.currently-playing .song-name');
    var artistName = $('.currently-playing .artist-name');
    var artistSongMobile = $('.currently-playing .artist-song-mobile');

    songName.text(currentSongFromAlbum.name);
    artistName.text(currentAlbum.artist);
    artistSongMobile.text(currentSongFromAlbum.name + " - " + currentAlbum.name);

    $('.left-controls .play-pause').html(playerBarPauseButton);

    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $newCurrentSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    // var $newCurrentSongNumberCell = (getSongNumberCell() + '[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    // var $previousSongNumberCell = (getSongNumberCell + '[data-song-number="' + lastSongNumber + '"]');

    $newCurrentSongNumberCell.html(pauseButtonTemplate)
    $previousSongNumberCell.html(lastSongNumber);

 };

 var previousSong = function() {

    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

    var getLastSongNumber = function(index) {
        if (index === currentAlbum.songs.length - 1) {
            return 1;
        } else {
            return index + 2;
        }
    };

    setSong(currentSongIndex);
    // currentlyPlayingSongNumber = currentSongIndex + 1;
    // currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    //updatePlayerBarSong() function, but modifying left controls
    var songName = $('.currently-playing .song-name');
    var artistName = $('.currently-playing .artist-name');
    var artistSongMobile = $('.currently-playing .artist-song-mobile');

    songName.text(currentSongFromAlbum.name);
    artistName.text(currentAlbum.artist);
    artistSongMobile.text(currentSongFromAlbum.name + " - " + currentAlbum.name);

    $('.left-controls .play-pause').html(playerBarPauseButton);

    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $newCurrentSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    // var $newCurrentSongNumberCell = (getSongNumberCell() + '[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    // var $previousSongNumberCell = (getSongNumberCell + '[data-song-number="' + lastSongNumber + '"]');

    $previousSongNumberCell.html(lastSongNumber);
    $newCurrentSongNumberCell.html(pauseButtonTemplate);

 };

 var setSong = function(songNumber) {

    currentlyPlayingSongNumber = songNumber + 1;
    currentSongFromAlbum = currentAlbum.songs[songNumber];

 };

 var getSongNumberCell = function(number) {

  var songNumberCell = $('.song-item-number');

  return songNumberCell;

 };


 //Album button templates
 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
 var playerBarPlayButton = '<span class="ion-play"></span>';
 var playerBarPauseButton = '<span class="ion-pause"></span>';

 //Store the state of playing songs
 var currentAlbum = null;
 var currentlyPlayingSongNumber = null;
 var currentSongFromAlbum = null;

//next and previous buttons
 var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');
 
$(document).ready(function() {
    
    setCurrentAlbum(albumMarconi);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
     
 });


