import { Selector } from 'testcafe';
const cliProgress = require('cli-progress');

const pageUrl = process.env.APP_DEBUG_URL ? process.env.APP_DEBUG_URL : 'http://localhost:5173/debug/model';
const modelName = 'QME2x2Text';
const maxIndex = 3

fixture(modelName)
    .page(pageUrl);

test('Verificando altura do botão Continuar', async t => {
    // await t.resizeWindow(1440, 900);
    // await t.eval(() => location.reload(true));
    
    const modelElement = Selector("a").withExactText(modelName);
    await t.click(modelElement);

    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.rect);
    progressBar.start(maxIndex, 0);

    for (let index = 0; index <= maxIndex; index++) {
        
        const continueButton = Selector("button")
            .withExactText("Continuar")
            .with({ visibilityCheck: true });

        let buttonHeight = await continueButton.clientHeight;

        if (buttonHeight < 33 || buttonHeight > 35) {
            console.log(`\x1b[33m ${modelName}: ${pageUrl}/${modelName}?index=${index} - INCONSISTENTE \x1b[0m`);
        }

        progressBar.update(index);
        await t.expect(buttonHeight).gte(33);
        await t.expect(buttonHeight).lte(35);

        const nextElement = Selector('a').withText('Próximo');
        await t.click(nextElement);
    }
    console.log('');
}).skipJsErrors();