var createSongRow = function(songNumber, songName, songLength) {

         var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
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
            setSong(songNumber - 1);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();

             var $volumeFill = $('.volume .fill');
             var $volumeThumb = $('.volume .thumb');
             $volumeFill.width(currentVolume + '%');
             $volumeThumb.css({left: currentVolume + '%'});

            $(this).html(pauseButtonTemplate);
            updatePlayerBarSong();
        }

        else if (currentlyPlayingSongNumber === songNumber) {
            // Switch from Pause -> Play button to pause currently playing song.
            if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
            } else {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();
            }
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


 var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {

      currentSoundFile.bind('timeupdate', function(event) {

        var seekBarFillRatio = this.getTime() / this.getDuration();
        var $seekBar = $('.seek-control .seek-bar');

        updateSeekPercentage($seekBar, seekBarFillRatio);
        setCurrentTimeInPlayerBar(filterTimeCode(this.getTime()));
      });
    }
 };


 var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
 
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };


 var setupSeekBars = function() {
     var $seekBars = $('.player-bar .seek-bar');
 
     $seekBars.click(function(event) {
         
         var offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();
         
         var seekBarFillRatio = offsetX / barWidth;

         if ($(this).parent().attr('class') === 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
         } else {
            setVolume(seekBarFillRatio * 100);
         }

         updateSeekPercentage($(this), seekBarFillRatio);

     });

     $seekBars.find('.thumb').mousedown(function(event) {
         
         var $seekBar = $(this).parent();
 
         $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;

          if ($seekBar.parent().attr('class') === 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
          } else {
            setVolume(seekBarFillRatio);
         }

 
            updateSeekPercentage($seekBar, seekBarFillRatio);

         });
 
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });

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
    setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.length));

 };


 var setCurrentTimeInPlayerBar = function(currentTime) {

    $('.current-time').text(currentTime);

 };


 var setTotalTimeInPlayerBar = function(totalTime) {

    $('.total-time').text(totalTime);

 };


 var filterTimeCode = function(timeInSeconds) {

    var secondsInNumberForm = parseFloat(timeInSeconds);
    var wholeMinutes = Math.floor(secondsInNumberForm/60);
    var wholeSeconds = Math.floor(secondsInNumberForm % 60);
    if (wholeSeconds < 10) {
      wholeSeconds = "0" + wholeSeconds;
    }

    return wholeMinutes + ":" + wholeSeconds;

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
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
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
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
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

  if (currentSoundFile) {
    currentSoundFile.stop();
  }

    currentlyPlayingSongNumber = parseInt(songNumber + 1);
    currentSongFromAlbum = currentAlbum.songs[songNumber];

     currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         
         formats: [ 'mp3' ],
         preload: true
     });

    setVolume(currentVolume);

 };


 var seek = function(time) {
    if (currentSoundFile) {
      currentSoundFile.setTime(time);
    }
 }


 var setVolume = function(volume) {
    if (currentSoundFile) {
      currentSoundFile.setVolume(volume);
    }
 };


 var getSongNumberCell = function(number) {

  var songNumberCell = $('.song-item-number');

  return songNumberCell;

 };


 var togglePlayFromPlayerBar = function() {

  var songNumberCell = $(this).find('.song-item-number');

    if (currentSoundFile.isPaused()) {
      songNumberCell.html(playerBarPauseButton);
      $playPause.html(playerBarPauseButton);
      currentSoundFile.play();
    } else if (currentSoundFile) {
      songNumberCell.html(playerBarPauseButton);
      $playPause.html(playerBarPauseButton);
      currentSoundFile.pause();
    }

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
 var currentSoundFile = null;
 var currentVolume = 80;

//next and previous buttons
 var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');
 var $playPause = $('.main-controls .play-pause');
 
$(document).ready(function() {
    
    setCurrentAlbum(albumPicasso);
    setupSeekBars();

    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playPause.click(togglePlayFromPlayerBar);
     
 });


