const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function procuraID(id) {
  
  for (let i = 0; i < repositories.length; i++) { 
      if ( repositories[i].id === id) { 
          return i;
      }
  }

  return -1;

}


app.get("/repositories", (request, response) => {
  
  response.status(200); 
  response.send(repositories);

});

app.post("/repositories", (request, response) => {
  

  let {title, url, techs} = request.body;
  
  let aux = true;
  let status = 201;
  let retorno = {}; 
 
  if ( (!!title == false || !!url == false || !!techs == false) ||
       (!Array.isArray(techs)) ) 
  {
     status = 400;
     aux = false;
  }

  if(aux===false){

    status = 400; 

  }else{

    retorno = { id: uuid(), title, url, techs, likes: 0 };
    repositories.push(retorno);

  }

  response.status(status); 
  response.send(retorno);
  return response;

});


//PUT /repositories/:id: A rota deve alterar apenas o title, a url 
//e as techs do repositório que possua o id igual ao id presente nos parâmetros da rota;

app.put("/repositories/:id", (request, response) => {
  
  let {title, url, techs, likes} = request.body;

  /*if (!!title == false && !!url == false && (!!techs == false || !Array.isArray(techs)) ) 
  {
      response.status(400); 
      response.send({});
      return response;
  }*/

  let { id } = request.params;
  let pos = procuraID(id);

  if(pos < 0){
    response.status(400); 
    response.send({});
    return response;
  }

  repositories[pos].title = title || repositories[pos].title ;      
  repositories[pos].techs = techs || repositories[pos].techs ;      
  repositories[pos].url   = url   || repositories[pos].url   ;      
  

  let resposta_title = !!title  === false ? ' ' : `title:  ${repositories[pos].title}`;
      resposta_title = !!title  === false && (!!url==true || !!techs==true || !!likes==true ) ? ' ' : `title :  ${repositories[pos].title},`;
  let resposta_url   = !!url    === false ? ' ' : `"url":  ${repositories[pos].url}`;
      resposta_url   = !!url    === false && (!!techs==true || !!likes==true ) ? ' ' : `"url" :  ${repositories[pos].url},`;
  let resposta_techs = !!techs  === false ? ' ' : `"techs":  ${repositories[pos].techs}`;
      resposta_techs = !!techs  === false && (!!likes==true ) ? ' ' : `"techs" :  ${repositories[pos].techs},`;
  let resposta_likes = !!likes  === false ? ' ' : `"likes":  ${repositories[pos].likes}`;
 
  let final = `{
    ${resposta_title}
    ${resposta_url}
    ${resposta_techs}

    ${resposta_likes}
  }`;


  response.status(200); 
  response.send(JSON.parse(final));
  return response;


});


app.delete("/repositories/:id", (request, response) => {
  
    let { id } = request.params;
    let pos = procuraID(id);

    if(pos < 0){
      response.status(400); 
      response.send({});
      return response;
    }

    repositories.splice(pos, 1); 

    response.status(204); 
    response.send({});
    return response;
});

//POST /repositories/:id/like: A rota deve aumentar o número de likes do 
//repositório específico escolhido 
//através do id presente nos parâmetros da rota, a cada chamada dessa rota
//, o número de likes deve ser aumentado em 1;

app.post("/repositories/:id/like", (request, response) => {
 
    let { id } = request.params;
    let pos = procuraID(id);

    if(pos < 0){
      response.status(400); 
      response.send({});
      return response;
    }

    repositories[pos].likes++;      

    response.status(200); 
    response.send({likes : repositories[pos].likes});
    return response;

});

module.exports = app;
