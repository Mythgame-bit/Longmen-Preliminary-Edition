class AudioPool {
  constructor(sounds) {
    this.sounds = {};
    this.muted = false;
    sounds.forEach(name => {
      const audio = new Audio(`sounds/${name}.mp3`);
      audio.preload = "auto";
      this.sounds[name] = audio;
    });
  }

  play(name) {
    if (this.muted || !this.sounds[name]) return;
    const audio = this.sounds[name].cloneNode();
    audio.play();
  }

  toggleMute() {
    this.muted = !this.muted;
    console.log("音效已", this.muted ? "静音" : "开启");
  }
}
