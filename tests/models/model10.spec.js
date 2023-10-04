import { Selector } from 'testcafe';

const pageUrl = process.env.APP_DEBUG_URL ? process.env.APP_DEBUG_URL : 'http://localhost:5173/debug/model';
const modelName = 'MODEL10';
const maxIndex = 1070

fixture(modelName)
    .page(pageUrl);

test('Verificando altura do botão Continuar', async t => {
    await t.resizeWindow(1440, 900);
    await t.eval(() => location.reload(true));
    
    const modelElement = Selector("a").withExactText(modelName);
    await t.click(modelElement);

    for (let index = 0; index <= maxIndex; index++) {

        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`\x1b[34m ${modelName}: ${index}/${maxIndex}`);
        
        const continueButton = Selector("button")
            .withExactText("Continuar")
            .with({ visibilityCheck: true });

        let buttonHeight = await continueButton.clientHeight;

        if (buttonHeight < 33 || buttonHeight > 35) {
            console.log(`\x1b[33m ${modelName}: ${pageUrl}/${modelName}?index=${index} - INCONSISTENTE \x1b[0m`);
        }

        // await t.expect(buttonHeight).gte(33);
        // await t.expect(buttonHeight).lte(35);

        const nextElement = Selector('a').withText('Próximo');
        await t.click(nextElement);
    }
    console.log('');
}).skipJsErrors();