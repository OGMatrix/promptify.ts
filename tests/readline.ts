import readline from "readline";

async function handle(): Promise<boolean> {
    

    readline.emitKeypressEvents(process.stdin);

    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    
  return new Promise((resolve, reject) => {
    const handleKeypress = async (chunk: any, key: any) => {
      if (!key) return;
      if (chunk) {
      }
      console.log(key);
      // console.log(key);
      if (key.name === "c" && key.ctrl) process.exit();
    };

    process.stdin.on("keypress", handleKeypress);
  });
}

(async() => {
    await handle();
})()