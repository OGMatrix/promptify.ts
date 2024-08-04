export class LocaleManager {
    private locale: string;

    constructor() {
        this.locale = new Intl.NumberFormat().resolvedOptions().locale;
    }
}