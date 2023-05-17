import { _decorator, AudioClip, AudioSource, director, Node, resources } from 'cc';
import { GameComponent } from './GameComponent';
const { ccclass, menu } = _decorator;

@ccclass('AudioManager')
@menu('Utils/AudioManager')
export class AudioManager extends GameComponent {

    private static _instance: AudioManager | null = null;
    public static get instance(): AudioManager {
        if (this._instance == null) {
            const audioManager = new Node();
            audioManager.name = '__audioManager__';
            director.getScene().addChild(audioManager);
            director.addPersistRootNode(audioManager);
            this._instance = audioManager.addComponent(AudioManager);
        }
        return this._instance;
    }

    private _audioSource: AudioSource

    public get audioSource() {
        return this._audioSource;
    }

    protected onLoad() {
        this._audioSource = this.addComponent(AudioSource);
    }

    protected onGamePause() {
        this._audioSource.pause();
    }

    protected onGameUnpause() {
        if (this._audioSource.state === AudioSource.AudioState.PAUSED) {
            this._audioSource.play();
        }
    }

    /**
     * @en
     * play short audio, such as strikes,explosions
     * @zh
     * 播放短音频,比如 打击音效，爆炸音效等
     * @param sound clip or url for the audio
     * @param volume 
     */
    playOneShot(sound: AudioClip | string, volume: number = 1.0) {
        if (sound instanceof AudioClip) {
            this._audioSource.playOneShot(sound, volume);
        }
        else {
            resources.load(sound, (err, clip: AudioClip) => {
                if (err) {
                    console.log(err);
                }
                else {
                    this._audioSource.playOneShot(clip, volume);
                }
            });
        }
    }

    /**
     * @en
     * play long audio, such as the bg music
     * @zh
     * 播放长音频，比如 背景音乐
     * @param sound clip or url for the sound
     * @param volume 
     */
    play(sound: AudioClip | string, volume: number = 1.0) {
        if (sound instanceof AudioClip) {
            this._audioSource.clip = sound;
            this._audioSource.play();
            this.audioSource.volume = volume;
        }
        else {
            resources.load(sound, (err, clip: AudioClip) => {
                if (err) {
                    console.log(err);
                }
                else {
                    this._audioSource.clip = clip;
                    this._audioSource.play();
                    this.audioSource.volume = volume;
                }
            });
        }
    }
}

