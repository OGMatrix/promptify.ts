export interface Locale {
    methods: LocaleMethods;
}

export interface LocaleMethods {
    url: LocaleMethodsUrl;
}

export interface LocaleMethodsUrl {
    errors: LocaleMethodsUrlErrors;
}

export interface LocaleMethodsUrlErrors {
    invalid: string;
}