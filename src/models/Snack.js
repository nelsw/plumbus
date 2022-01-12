export default class Snack {

    constructor(level, text) {
        this.level = level
        this.text = text
    }

    static OK(text = String) {
        return new Snack('success', text)
    }

    static Err(e = Error) {
        let msg = e.message
        if (e.response && e.response.statusText) {
            msg = e.response.statusText
        }
        return new Snack('error', msg)
    }

    static Warn(text = String) {
        return new Snack('warning', text)
    }

}