(function(d) {

    var clips;

    createClipHTML();
    processClips();

    function createClipHTML() {
        var clipData = {
            "clips": [{
                "title": "Clip 1",
                "artist": "Artist 1",
                "media": {
                    "src": "SoundClips/clip1.mp3",
                    "type": "audio/mpeg"
                }
            }, {
                "title": "Clip 2",
                "artist": "Artist 2",
                "media": {
                    "src": "SoundClips/clip2.mp3",
                    "type": "audio/mpeg"
                }
            }]
        }
        var clipTemplate = '<div class="clipContainer"> \
                            <div id="#id" class="play"></div> \
                            <p class="artist">#artist: <span class="title">#title</span></p> \
                            <div id="#resetid" class="reset"></div> \
                            <div id="#progressid" class="progress"> \
                                <div id="#progressbarid" class="progressbar"></div> \
                            </div> \
                            <audio id="#clipid"> \
                                <source src="#clipSource" type="#clipType"></source> \
                            </audio> \
                            </div>'
        var clipHTML = "";
        for (var i = 0; i < clipData.clips.length; i++) {
            var newClip = clipTemplate
                .replace("#id", i + 1)
                .replace("#resetid", "reset" + (i + 1))
                .replace("#progressid", "progress" + (i + 1))
                .replace("#progressbarid", "progressbar" + (i + 1))
                .replace("#clipid", "clip" + (i + 1))
                .replace("#artist", clipData.clips[i].artist)
                .replace("#title", clipData.clips[i].title)
                .replace("#clipSource", clipData.clips[i].media.src)
                .replace("#clipType", clipData.clips[i].media.type);
            clipHTML += newClip
        };

        d.body.innerHTML = clipHTML;
    }

    function processClips() {
        clips = d.getElementsByTagName("audio");
        clips.activeClip = "";

        for (var i = clips.length - 1; i >= 0; i--) {
            processProgressBar(clips[i]);
            processResetButton(clips[i]);
            processPlayPauseDiv(clips[i]);
            processClip(clips[i]);
        }
    }

        function processProgressBar(clip) {
            var progress = d.getElementById("progress" + (clip.id[clip.id.length-1]));
            progress.rect = progress.getBoundingClientRect();
            progress.clip = clip;
            clip.progress = progress;

            progress.onclick = function(xy) {
                processClickTouch(xy, this);
            }

            progress.ontouchstart = function(xy) {
                processClickTouch(xy, this);
            }

            function processClickTouch(mouseEvent, progressBar) {
                progressBar.clip.currentTime =
                    progressBar.clip.duration *
                    ((mouseEvent.clientX -
                        progressBar.rect.left) /
                    (progressBar.rect.right - progressBar.rect.left));
            }
        }

        function processResetButton(clip) {
            var resetButton = d.getElementById("reset" + (clip.id[clip.id.length-1]));
            resetButton.clip = clip;

            resetButton.onclick = function(mouseEvent) {
                this.clip.currentTime = 0;
                
            }
        }

        function processPlayPauseDiv(clip) {
            var playPauseDiv = d.getElementById((clip.id[clip.id.length-1]));
            playPauseDiv.clip = clip;
            clip.playPauseDiv = playPauseDiv;

            playPauseDiv.onclick = function(mouseEvent) {

                if (this.className == "pause") {
                    this.clip.pause();
                } else {

                    if (typeof(clips.activeClip.id) != "undefined") {
                        clips.activeClip.pause();
                    }
                    this.clip.play();
                }
            }
        }

        function processClip(clip) {

            clip.ontimeupdate = function() {
                var id = this.id;
                var progress = (this.currentTime / this.duration) * 100;
                this.progress.childNodes[1].style.width = progress + '%';
                if (this.currentTime == this.duration) {
                    this.currentTime = 0;
                    this.progress.childNodes[1].style.width = "0%";

                    this.playPauseDiv.className = "play";
                }


            }

            clip.onpause = function() {
                clips.activeClip = "";
                this.playPauseDiv.className = "play";

            }

            clip.onplay = function() {
                clips.activeClip = this;
                this.playPauseDiv.className = "pause";

            }
        }

})(document);