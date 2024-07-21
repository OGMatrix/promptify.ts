import { Filesystem } from "../src";

const filesystem = new Filesystem(".md,.config,.ts");

(async() => {
    let path = __dirname;
    path = filesystem.back(path);
    console.log(path)
    path = filesystem.go(path, "assets");
    console.log(path)
    const items = await filesystem.getContentByLocation(path);
    console.log(items)
})()