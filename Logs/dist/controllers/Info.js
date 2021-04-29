"use strict";Object.defineProperty(exports, "__esModule", {value: true});const fs = require('fs').promises;

class InfoController {
  async index(req, res) {
    let arquivos = [];
    const diretorio = './info'

    let listaDeArquivos = await fs.readdir(diretorio);
    for(let k in listaDeArquivos) {
      let data = await fs.readFile(`${diretorio}/${listaDeArquivos[k]}`, "utf-8");
      if(data.length > 0 ){
        arquivos.push(listaDeArquivos[k]);
      }
    }
    return res.json(arquivos);
  }

  async filterIndex(req, res) {

    const {start, end} = req.body;

    var dateFilterStart = new Date(start)
    var dateFilterEnd = new Date(end)
    
    dateFilterStart.setHours(dateFilterStart.getHours() );
    dateFilterEnd.setHours(dateFilterEnd.getHours() );

    
    let arquivos = [];
    const diretorio = './info'
   
    let listaDeArquivos = await fs.readdir(diretorio);
    for(let k in listaDeArquivos) {
      let data = await fs.readFile(`${diretorio}/${listaDeArquivos[k]}`, "utf-8");
      
      if(data.length > 0 ){
        let temp = listaDeArquivos[k].split(".")
        var dateArquive = new Date(temp[0])

        if(dateFilterStart <= dateArquive && dateFilterEnd >= dateArquive)
        arquivos.push(listaDeArquivos[k]);
      }
    }
    return res.json(arquivos);
  }
  async show(req, res) {

    const { arquive } = req.params;
    const diretorio = "./info/" + arquive;

    let arquivo = [];
    let data = await fs.readFile(diretorio, "utf-8");


    arquivo = data.split(/\n/g)
    
    

    return res.json(arquivo);
  }
}

  exports. default = new InfoController();