export class LangController {
    constructor(lang) {
        this._language = lang;
    }

    set language(lang) {
        this._language = lang;
    }

    get language() {
        return this._language;
    }
}