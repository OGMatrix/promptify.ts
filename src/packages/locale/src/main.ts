import * as fs from 'fs';
import * as path from 'path';
import { Filesystem } from '../../filesystem';
import { Locale } from '../interfaces';

export class LocaleManager {
    private locale: string;
    private localeTLC: string;
    private fileSystem = new Filesystem("*", true, true);
    private locales: Locale;

    constructor() {
        this.locale = new Intl.NumberFormat().resolvedOptions().locale;
        this.localeTLC = new Intl.NumberFormat().resolvedOptions().locale.split("-")[0];
        let path = this.fileSystem.getPath(__dirname);
        path = this.fileSystem.back(path);
        path = this.fileSystem.go(path, "locales");

        const jsonFilePath = this.fileSystem.getFile(path, this.localeTLC + ".json");
        const jsonContent = fs.readFileSync(jsonFilePath, 'utf-8');
        const jsonObject = JSON.parse(jsonContent);
        this.locales = jsonObject;
    }

    public getLocale(): string {
        return this.locale;
    }

    public getLocaleTwoLetterCode(): string {
        return this.localeTLC;
    }

    private capitalizeFirstLetter(string: string): string {
        console.log(string.charAt(0))
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    public generateInterface() {
        console.log(__dirname)
        let path = this.fileSystem.getPath(__dirname);
        path = this.fileSystem.back(path);
        path = this.fileSystem.go(path, "locales");

        const jsonFilePath = this.fileSystem.getFile(path, "en.json");
        path = this.fileSystem.back(path);
        const outputFilePath = this.fileSystem.getFile(path, "interfaces.ts")

        const jsonContent = fs.readFileSync(jsonFilePath, 'utf-8');
        const jsonObject = JSON.parse(jsonContent);

        let interfaces = this.createInterface('Locale', jsonObject);

        fs.writeFileSync(outputFilePath, interfaces);
    }

    private createInterface(name: string, obj: any): string {
        let interfaceString = `export interface ${name} {\n`;
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                const childInterfaceName = name + this.capitalizeFirstLetter(key);
                interfaceString += `    ${key}: ${childInterfaceName};\n`;
                interfaceString += `}\n\n`;
                interfaceString += this.createInterface(childInterfaceName, obj[key]);
            } else {
                interfaceString += `    ${key}: ${typeof obj[key]};\n`;
                interfaceString += `}\n\n`;
            }
        }
        return interfaceString;
    }

    public getLocales(): Locale {
        return this.locales;
    }
}