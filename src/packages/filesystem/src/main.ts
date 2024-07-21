import path from "node:path";
import {readdir} from "fs/promises"
import {Item} from "../index"

export class Filesystem {
    private extensions: string[];
    private showHiddenFolders: boolean;

    constructor(extensions: string, showHiddenFolders: boolean = false) {
        this.extensions = extensions.split(",");
        this.showHiddenFolders = showHiddenFolders;
    }

    public getPath(location: string): string {
        return path.resolve(location);
    }

    public getFile(location: string, name: string): string {
        return path.resolve(path.join(location, name))
    }

    public async getContentByLocation(location: string): Promise<Item[]> {
        let content: Item[] = []
        let items = await readdir(this.getPath(location));

        for await (const item of items) {
            if (item.startsWith(".") || !item.includes(".")) {
                // Folder
                if (this.showHiddenFolders && item.startsWith(".")) content.push({type: 'folder', name: item})
                else if (!this.showHiddenFolders && !item.startsWith(".")) content.push({type: 'folder', name: item})
            } else if (item.includes(".")) {
                // File
                if (this.extensions[0] !== "*") {
                    if (item.split(".").length > 1) {
                        const fileExtensions = item.split(".").slice(1)

                        for await (const fe of fileExtensions) {
                            if (this.extensions.includes("." + fe)) {
                                content.push({type: 'file', name: item});
                                break;
                            }
                        }
                    } else {
                        if (this.extensions.includes("." + item.split(".")[1])) {
                            content.push({type: 'file', name: item});
                        }
                    }
                } else {
                    content.push({type: 'file', name: item})
                }
            }
        }

        return content.sort((a, b) => (a.type === "file" ? 1 : 0) - (b.type === "file" ? 1 : 0));
    }

    public back(location: string): string {
        return path.resolve(path.join(location, ".."))
    }

    public go(location: string, item: string): string {
        return path.resolve(path.join(location, item))
    }
}