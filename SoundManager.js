export class SoundManager {
    constructor(sounds) {
        this.LoadFiles(sounds);
    }
    LoadFiles(soundList) {
        for (const [key, value] of Object.entries(soundList)) {
            if (typeof soundList[key].length === 'number')
                soundList[key].forEach(sound => {
                    this.LoadSound(sound)
                });
            else
                this.LoadSound(soundList[key])
        }
    }
    LoadSound(sound) {
        let fileBlob;
        fetch(sound.filePath)
        .then(function(response) {return response.blob()})
        .then(function(blob) {
            fileBlob = URL.createObjectURL(blob);
            new Audio(fileBlob); // forces a request for the blob
            sound.fileBlob = fileBlob;
        });
    }
    Play(soundObj) {
         let snd = new Audio(soundObj.fileBlob);
        snd.play();
        setTimeout(()=>{
            snd = null;
        }, 2000);
    }
}