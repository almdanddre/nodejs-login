const express = require("express");
const res = require("express/lib/response");
const mysql = require("mysql");
const path = require("path");
const app = express();

// Criando conexão com o banco de dados
const db = mysql.createConnection({
    host: "",
    user: "",
    password: '',
    database: ""
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory))

// Testando conexão com o banco de dados
db.connect( (error) => {
    if(error) {
        console.log(error);
    } else {
        console.log("MYSQL Conectado!");
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
});

app.get("/cadastro.html", (req, res) => {
    res.sendFile(path.join(__dirname + '/cadastro.html'))
});

// POST para autenticação dos dados
app.post('/auth', function(request, response) {
    let email = request.body.email;
	let password = request.body.password;
	if (email && password) {
        // Consulta ao banco de dados para obter os registros existentes na tabela que armazena os dados para login
		db.query('SELECT * FROM accounts WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			if (error){
                 throw error
            }
            // Verificação das credenciais
			if (results.length > 0) {
                if(results[0].email == email && results[0].password == password) {
                    response.send("Login com sucesso!")
                }
			} else {
				response.send('Usuário e Senha incorreto!');
			}			
			response.end();
		});
	} else {
		response.send('Por favor entre com usuário e senha!');
		response.end();
	}
});

// POST para cadastro dos dados
app.post('/register', function(request, response) {
    let email = request.body.email_cad;
	let password = request.body.senha_cad;
	if (email && password) {
        // Consulta ao banco de dados para obter os registros existentes na tabela que armazena os dados para login
		db.query('SELECT * FROM accounts WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			if (error){
                 throw error
            }
            // Verificação das credenciais
			if (results.length > 0) {
                if(results[0].email == email) {
                    response.send("Usuário já cadastrado! Tente novamente.")
                }
			} 
            else {
                // Consulta ao banco de dados para cadastrar dados do usuário
				db.query('INSERT INTO accounts (email, password) VALUES (?, ?)', [email, password]);
                response.send("Usuário cadastrado!")
			}			
			response.end();
            db.end();
		});
	} 
    else {
		response.send('Por favor entre com usuário e senha!');
		response.end();
	}
});

app.listen(5000, () => {
    console.log("Servidor está rodando...")
})