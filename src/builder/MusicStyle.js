import BirdsChirpingMusic from "../../res/sound/birds-chirping.mp3";

export const MUSIC_NONE = '--none--';
export const MUSIC_BIRDS = 'birds-chirping.mp3';

export const MUSIC_TYPES = [MUSIC_NONE, MUSIC_BIRDS];

export const MUSIC_STYLES = [];

MUSIC_STYLES[MUSIC_NONE] = {
	url: null
};

MUSIC_STYLES[MUSIC_BIRDS] = {
	url: MUSIC_BIRDS,
	resource: BirdsChirpingMusic
};
