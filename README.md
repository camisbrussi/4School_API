<h1 align="center"> 4School (API) </h1>

<p align="center">
 
  <a href="https://github.com/camisbrussi/4School_API/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/camisbrussi/4School_API">
  </a>

</p>

Projeto desenvolvido para disciplina de Projeto Integrador II do curso de Engenharia de Software

## Objetivo

O objetivo deste projeto é desenvolver um sistema que gerencie eventos e atividades escolares. Constantemente a comunicação entre escola e responsáveis dos alunos é feita pelos próprios alunos, porém estes muitas vezes não entendem a importância de algumas situações e acabam não repassando a informação aos seus responsáveis.
Com um sistema de eventos e atividades a comunicação entre escola e responsáveis torna-se mais robusta e direta o que diminui a responsabilidade dos alunos em entregar bilhetes ou avisar referente alguma programação.
Além disso, o sistema também poderá auxiliar no controle de participantes nos eventos escolares, pois em tempos de pandemia o controle de acesso é necessário para evitar aglomerações.  


## Tecnologias
- Javascript
- NodeJS
- Sequelize

## Instalação local
Criar uma database no mysql com o nome de preferência
Baixar o projeto 
Criar um arquivo .env conforme o env-example e alterar os dados conforme sua configuração
abra o terminal na pasta do projeto 
Rodar os comandos 

1. Faça clone do projeto;
2. na pasta do projeto
  ```
  npm i 
  npx sequelize db:migrate 
  npx sequelize db:seed:all
  npm run dev
  ``` 

Criado por:
- [Camila Sbrussi](https://github.com/camisbrussi/) 
- [Christian Kroth](https://github.com/chriskroth/) 
- [Maryhana Kuhn](https://github.com/maryhanakuhn/) 

Professor Orientador da disciplina: JULIANO DERTZBACHER


