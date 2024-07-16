import { Format, Input, InputEnum } from "../src/index";

const input = new Input();

(async() => {
    // const res = await input.prompt(InputEnum.Prompt.Text, "What is your name?", true, Format.Json);
    const res = await input.selection(InputEnum.Selection.Single, ["Coomer", "Kemono"], "Which service do you want to use?", Format.Json);

    console.log(res);
})();