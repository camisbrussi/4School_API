"use strict";Object.defineProperty(exports, "__esModule", {value: true});const fs = require('fs').promises;

class ErrorController {
  async index(req, res) {
    let arquivos = [];
    const diretorio = './error'

    let listaDeArquivos = await fs.readdir(diretorio);
    for(let k in listaDeArquivos) {
        let stat = await fs.stat(diretorio + '/' + listaDeArquivos[k]);
        if(stat.isDirectory())
            await listarArquivosDoDiretorio(diretorio + '/' + listaDeArquivos[k], arquivos);
        else
            arquivos.push(listaDeArquivos[k]);
    }

    console.log(arquivos);
    return res.json(arquivos);
  }
  show(req, res) {
    
  }
}

  exports. default = new ErrorController();