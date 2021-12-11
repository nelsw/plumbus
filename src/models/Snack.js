export default class Snack {

    constructor(level, text) {
        this.level = level
        this.text = text
    }

    static OK(text = String) {
        return new Snack('success', text)
    }

    static Err(e = Error) {
        return new Snack('error', e.message)
    }

    static Warn(text = String) {
        return new Snack('warning', text)
    }

}