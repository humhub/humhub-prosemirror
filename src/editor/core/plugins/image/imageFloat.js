export const FLOAT_NONE = 0;
export const FLOAT_LEFT = 1;
export const FLOAT_CENTER = 2;
export const FLOAT_RIGHT = 3;

export const FLOAT_ALT_EXT_NONE = '';
export const FLOAT_ALT_EXT_LEFT = '<';
export const FLOAT_ALT_EXT_CENTER = '><';
export const FLOAT_ALT_EXT_RIGHT = '>';

export const FLOAT_MAP = [
    FLOAT_ALT_EXT_NONE,
    FLOAT_ALT_EXT_LEFT,
    FLOAT_ALT_EXT_CENTER,
    FLOAT_ALT_EXT_RIGHT
];

export function getAltExtensionByFloat(float) {
    return FLOAT_MAP[parseInt(float)] || FLOAT_ALT_EXT_NONE;
}

export function parseFloatFromAlt(alt) {
    var float = FLOAT_NONE;
    var ext = FLOAT_ALT_EXT_NONE;

    if(!alt) {
        return {
            alt: alt,
            float: float,
            ext: ext
        }
    }

    if(endsWith(alt, FLOAT_ALT_EXT_CENTER)) {
        alt = alt.substring(0, alt.length -2);
        ext = FLOAT_ALT_EXT_CENTER;
        float = FLOAT_CENTER;
    } else if(endsWith(alt, FLOAT_ALT_EXT_LEFT)) {
        alt = alt.substring(0, alt.length -1);
        ext = FLOAT_ALT_EXT_LEFT;
        float = FLOAT_LEFT;
    } else if(endsWith(alt, FLOAT_ALT_EXT_RIGHT)) {
        alt = alt.substring(0, alt.length -1);
        ext = FLOAT_ALT_EXT_RIGHT;
        float = FLOAT_RIGHT;
    }

    return {
        alt: alt,
        ext: ext,
        float: float
    }
}

export function getClassForFloat(float) {
    float = parseInt(float);
    switch (float) {
        case FLOAT_LEFT:
            return 'pull-left';
        case FLOAT_CENTER:
            return 'center-block';
        case FLOAT_RIGHT:
            return 'pull-right';
        default:
            return '';
    }
}

let endsWith = function(string, suffix) {
    return string.indexOf(suffix, string.length - suffix.length) !== -1;
};