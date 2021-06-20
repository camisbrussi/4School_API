
const configurar = function(fone) {
    const wbm = require('wbm');
    wbm.start({session:true}).then(async () => {
        const phones = [fone];
        const message = 'WhatsApp configurado com sucesso!';
        await wbm.send(phones, message);
        await wbm.end();
    }).catch(err => console.log(err));
}

export default configurar;
/*
const parametros = process.argv;
const fone = parametros[2];

const wbm = require('wbm');
wbm.start({session:true}).then(async () => {
    const phones = [fone];
    const message = 'WhatsApp configurado com sucesso!';
    await wbm.send(phones, message);
    await wbm.end();
}).catch(err => console.log(err));
*/