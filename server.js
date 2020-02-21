// configurando o servidor
const express = require("express")
const server = express()


// configurar o servidor ṕara apresentar arquivos estaticos
server.use(express.static('public'))


// habilitar body do formulario
server.use(express.urlencoded({ extended: true})) 


// configurar a conexão com o banco de dados
const Poll = require('pg').Pool
const db = new Poll({
    user: 'postgres',
    password: 'velocidade',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})




// configurando a templete engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true, //não quero que ele faça cash
})





// confiurar a apresentação da pagina
server.get("/", function(req, res) {
    
    db.query("SELECT * FROM donors", function(err, result) {
        if (err) return res.send("Erro de banco de dados")

        const donors = result.rows;
        return res.render("index.html", { donors })
    })

})
// responsavel por receber os dados do form
server.post("/", function(req, res) {
    // pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood


    // verificando se a variavel está vazia
    // se nome igual a vazio
    //  OU o email igual vazio
    // OU o blood igual a vazio
    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatorios")
    }

    // coloco valores dentro do banco de dados
    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)`

        const values = [name, email, blood]

    db.query(query, values, function(err) {
    // fluxo de erro
        if (err) return res.send("erro no banco de dados")


    // fluxo ideal
        return res.redirect("/")




    })


    
})






// ligar o servidor e ligar na porta 3000
server.listen(3000, function() {
    console.log("iniciei o servidor");
    
})