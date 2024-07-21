import { Input } from "../src/index";
// import { Logger } from "../src/packages/logger/src/logger";
// import { Designer } from "../src/packages/input/src/designer";
// import { Design } from "../src/packages/input/enums";
// import { Colors } from "../src/packages/input/variables";

const input = new Input();
// const logger = new Logger();
// const designer = new Designer({ header: Design.Modern, body: Design.Modern, colors: { box_color: Colors.foreground.white, shadow_color: Colors.foreground.gray } }, logger, "1.0.0", "How are you");

(async () => {
  // const res = await input.prompt("text", "What is your name?", true, "json");
  // const res = await input.prompt({type: "text", q: "How are you?"});
  // const res = await input.selection("single", ["Coomer", "Kemono"], "Which service do you want to use?", "json");
  // const res = await input.selection({
  //   type: "single",
  //   choices: ["Choice 1", "Choice 2"],
  //   q: "Which service do you want to use?",
  // });
  // const res = await input.pwd({q: "How are you?"});
  const res = await input.bool({
    q: "Möchtest du abbrechen?",
    default_bool: true,
    format: "json"
  })

  console.log(res)
  
  process.exit()

  // designer.log_header()
})();
