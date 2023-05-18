import { _decorator, AudioClip, AudioSource, director, Enum, Node, resources } from 'cc';

export class AudioManager {

    static readonly Sounds = Enum({
        PISTOL_SHOT: 'Arrow Flying Past 1',
        BULLET_HIT_1: 'Bloody punches 6',
        BULLET_HIT_2: 'Bloody punches 7',
        MELEE_HIT_1: 'Body Head (Headshot) 3',
        MELEE_HIT_2: 'Body Head (Headshot) 4',
        MELEE_HIT_3: 'Body Head (Headshot) 5',
        ENEMY_DEATH_1: 'Debuff 1',
        ENEMY_DEATH_2: 'Debuff 20',
        PLAYER_DEATH: 'Impact Classic_01',
        UI_CLICK: 'Pop sounds 1',
        PLAYER_RISE: 'Buff 10',
    });

    private static _instance: AudioManager | null = null;
    public static get instance(): AudioManager {
        if (this._instance == null) {
            const audioManager = new Node();
            audioManager.name = '__audioManager__';
            director.getScene().addChild(audioManager);
            director.addPersistRootNode(audioManager);
            this._instance = new AudioManager()
            this._instance._audioSource = audioManager.addComponent(AudioSource);
        }
        return this._instance;
    }

    private _audioSource: AudioSource;
    private audioClips: { [key: string]: AudioClip } = {};
    public readonly loaded: Promise<void>;

    constructor() {
        this.loaded = Promise.all([
            Object.keys(AudioManager.Sounds).map((key) => {
                return this.loadAudioClip(AudioManager.Sounds[key]);
            })
        ]).then(() => { })
    }

    private loadAudioClip(name: string): Promise<AudioClip> {
        return new Promise((resolve, reject) => {
            resources.load(`audio/${name}`, AudioClip, (err, prefab) => {
                if (err) {
                    reject(err);
                } else {
                    this.audioClips[name] = prefab;
                    resolve(prefab);
                }
            });
        });
    }

    public get audioSource() {
        return this._audioSource;
    }

    public pause() {
        this._audioSource.pause();
    }

    public resume() {
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
        } else if (this.audioClips[sound]) {
            this._audioSource.playOneShot(this.audioClips[sound], volume);
        } else {
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
        } else if (this.audioClips[sound]) {
            this._audioSource.playOneShot(this.audioClips[sound], volume);
        } else {
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

