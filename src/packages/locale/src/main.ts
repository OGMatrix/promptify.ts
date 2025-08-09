import * as fs from 'fs';
import * as path from 'path';
import { Filesystem } from '../../filesystem';
import * as locale from '../locales/en.json';
type Locale = typeof locale;

export class LocaleManager {
    private locale: string;
    private localeTLC: string;
    private fileSystem = new Filesystem("*", true, true);
    private locales: Locale;
    private interfaceQueue: any[] = [];

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

    // private capitalizeFirstLetter(string: string): string {
    //     return string.charAt(0).toUpperCase() + string.slice(1);
    // }

    // public generateInterface() {
    //     console.log(__dirname)
    //     let path = this.fileSystem.getPath(__dirname);
    //     path = this.fileSystem.back(path);
    //     path = this.fileSystem.go(path, "locales");

    //     const jsonFilePath = this.fileSystem.getFile(path, "en.json");
    //     path = this.fileSystem.back(path);
    //     const outputFilePath = this.fileSystem.getFile(path, "interfaces.ts")

    //     const jsonContent = fs.readFileSync(jsonFilePath, 'utf-8');
    //     const jsonObject = JSON.parse(jsonContent);

    //     let interfaces = this.createInterface('Locale', jsonObject);

    //     fs.writeFileSync(outputFilePath, interfaces);
    // }

    // private createInterface(name: string, obj: any): string {
    //     let interfaceString = `export interface ${name} {\n`;
    //     for (const key in obj) {
    //         const childInterfaceName = name + this.capitalizeFirstLetter(key);
    //         if (typeof obj[key] === 'object' && obj[key] !== null) {
    //             interfaceString += `    ${key}: ${childInterfaceName};\n`;
    //             this.interfaceQueue.push({ name: childInterfaceName, obj: obj[key] })
    //         } else {
    //             interfaceString += `    ${key}: ${typeof obj[key]};\n`;
    //         }
    //     }
        
    //     interfaceString += `}\n\n`;
    //     console.log(this.interfaceQueue.length)

    //     if (this.interfaceQueue.length > 0) {
    //         console.log(this.interfaceQueue[0].obj)
    //         interfaceString += this.createInterface(this.interfaceQueue[0].name, this.interfaceQueue[0].obj);
    //         this.interfaceQueue = this.interfaceQueue.slice(-1);
    //     }
    //     return interfaceString;
    // }

    public getLocales(): Locale {
        return this.locales;
    }
}