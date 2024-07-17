import { Input } from "../src/index";

const input = new Input();

(async () => {
  // const res = await input.prompt("text", "What is your name?", true, "json");
  // const res = await input.selection("single", ["Coomer", "Kemono"], "Which service do you want to use?", "json");
  const res = await input.selection({
    type: "single",
    choices: ["Choice 1", "Choice 2"],
    q: "Which service do you want to use?",
  });

  console.log(res);
})();
