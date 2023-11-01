// Criação da API para integrar ao postgree
// Inicialmente:
// npm install express cors dotenv body-parser pg
// npm install --save-dev nodemon
// nodemon: equivalente ao Live Server, que deve ser instalado em ambiente de desenvolvimento ("--save-dev")
// pg: permite conexão com o postgree
// dotenv: cria variáveis de ambiente para conexão com o banco de dados, portas
// cors: adiciona cabeçalho http, utilizado para habilitar solicitações entre sites
// body-parser: converte o body da requisição para vários formatos, inclusive json

// Associa variaveis as bibliotecas instaladas no npm
const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const config = require("./config");
const { Client } = require("pg");
const app = express();

// Inicialização de middlewares
// middlewares: conecta apps, dados e usuários
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());

var conString = config.urlConnection;
var client = new Client(conString);

// Função para verificar se há conexão com o banco de dados client, que é associado ao Postgrree
client.connect(function (err) {
  if (err) {
    return console.error("Não foi possível conectar ao banco.", err);
  }
  client.query("SELECT NOW()", function (err, result) {
    if (err) {
      return console.error("Erro ao executar a query.", err);
    }
    console.log(result.rows[0]);
  });
});

// Rota "/": para verificar se a API está funcionando
app.get("/", (req, res) => {
  console.log("Response ok.");
  //Resposta para verificar se o servidor esta online
  res.send("Ok – Servidor disponível.");
});

// Criação da rota usuários
app.get("/usuarios", (req, res) => {
  try {
    // query: consulta
    // Função anônima que consulta o banco de dados, com tratamento de erro
    // Seleciona todas as colunas da tabela usuario
    client.query("SELECT * FROM Usuarios", function (err, result) {
      if (err) {
        // Retorna uma mensagem para a variavel err, se não tiver erro na consulta
        return console.error("Erro ao executar a qry de SELECT", err);
      }
      // Envia uma resposta caso a consulta tenha sucesso
      res.send(result.rows);
      console.log("Chamou get usuarios");
    });
    // Verifica se houve erro na resposta
  } catch (error) {
    console.log(error);
  }
});

// Criação de rota que filtra um usuário específico
// Primeiro paramentro: construção de rota com variavel.
// Segundo parâmetro: arrow function
app.get("/usuarios/:id", (req, res) => {
  try {
    // req.params.id: seleciona o id como parametro da resposta
    console.log("Chamou /:id " + req.params.id);
    client.query(
      // $1: utilizado para passar parametro
      "SELECT * FROM Usuarios WHERE id = $1",
      [req.params.id],
      function (err, result) {
        if (err) {
          return console.error("Erro ao executar a qry de SELECT id", err);
        }
        if (results.rowCount == 0) {
          res.send(
            "Usuario com o codigo " +
              req.params.id +
              " não existe no banco de dados"
          );
        } else res.send(result.rows);
        //console.log(result;
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//Se o verbo for delete, haverá uma lógica de programação para determinar o comportamento da rota
app.delete("/usuarios/:id", (req, res) => {
  try {
    console.log("Chamou delete /:id " + req.params.id);
    const id = req.params.id;
    client.query(
      "DELETE FROM Usuarios WHERE id = $1",
      [id],
      function (err, result) {
        if (err) {
          return console.error("Erro ao executar a qry de DELETE", err);
        } else {
          if (result.rowCount == 0) {
            res.status(400).json({ info: "Registro não encontrado." });
          } else {
            res.status(200).json({ info: "Registro excluído. Código ${id}" });
          }
        }
        console.log(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.post("/usuaris", (req, res) => {
  try {
    console.log("alguém enviou um post com os dados: ", req.body);
    const { nome, email, altura, peso } = req.body;
    client.query(
      "INSERT INT Usuarios (nome, email, altura, peso) VALUES ($1, $2, $3, $4) RETURNING * ",
      [nome, email, altura, peso],
      (err, result) => {
        if (err) {
          return console.error("Erro ao executar a query de INSERT", err);
        }
        const { id } = result.row[0];
        res.setHeader("id", "${id}");
        res.status(201).json(result.row[0]);
        console.log(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.put("/usuarios/:id", (req, res) => {
  try {
    console.log("Alguém enviou um update com os dados:", req.body);
    const id = req.params.id;
    const { nome, email, altura, peso } = req.body;
    client.query(
      "UPDATE Usuarios SET nome=$1, email=$2, altura=$3, peso=$4 WHERE id =$5 ",
      [nome, email, altura, peso, id],
      function (err, result) {
        if (err) {
          return console.error("Erro ao executar a qry de UPDATE", err);
        } else {
          res.setHeader("id", id);
          res.status(202).json({ identificador: id });
          console.log(result);
        }
      }
    );
  } catch (error) {
    console.error(error);
  }
});

// Se houver uma requisição, fica ouvindo na porta do .env
// Deve ser o ultimo a ser escrito
app.listen(config.port, () =>
  console.log("Servidor funcionando na porta " + config.port)
);
