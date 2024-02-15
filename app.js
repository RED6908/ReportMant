//invocamos a express
const express = require('express');
const app = express();

// 3.- Seteamos urlencoded para capturar los datos de nuestro formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//4.- Invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

//5.- el directorio public
app.use('/', express.static('public'));
app.use('/', express.static(__dirname + '/public'));
app.use('/', express.static('principal'));
app.use('/', express.static(__dirname +'/principal'));
app.use('/', express.static('About us'));
app.use('/', express.static(__dirname +'/About us'));

//6.- Establecemos el motor de plantillas ejs
app.set('view engine', 'ejs');

//7.- Invocamos a bcryptjs
const bcryptjs = require('bcryptjs');

//8.- Variables de sesion
const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//9.- Invocamos el modulo de conexion DB, colocarlo despues de configurar env y db
const connection = require('./database/db');
const { name } = require('ejs');

//SEGUNDA PARTE
/*app.get ('/', (req, res)=>{
    res.send('Hello World');
})*/

// Establecer las routes

/*app.get ('/', (req, res)=>{
    res.render('index'/*, {msg: 'ESTO ES UN MENSAJE DESDE NODE'} Colocarlo en index.ejs <%= msg %>*///);
//});

app.get ('/login', (req, res)=>{
    res.render('login');
});

app.get ('/register', (req, res)=>{
    res.render('register');
});

app.get('/about', (req, res)=>{
    res.render('about');
});

app.get('/index', (req, res)=>{
    res.render('index');
});

app.get('/contact', (req, res)=>{
    res.render('contact');
});

app.get('/formulario', (req, res)=>{
    res.render('formulario');
});

app.get('/record', (req, res)=>{
    res.render('record');
});

app.get('/follow', (req, res)=>{
    res.render('follow');
});

app.get('/auth', (req, res)=>{
    res.render('auth');
});

// 11.- Register

app.post('/register', async(req, res)=>{
    const user = req.body.user;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordHash = await bcryptjs.hash(pass,8);
    connection.query ('INSERT INTO users SET ?' , {user:user, name:name, rol:rol, pass:passwordHash}, async(error, results)=>{
        if(error){
            console.log(error);
        }else{
            //res.send('Successful Registration')
            res.render('register', {
                alert: true,
                alertTitle: "Registration",
                alertMessage: "¡Successful Registration!",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: '1500',
                ruta: ''
            })
        }
    })
})  

/* Autenticación por correo electrónico o nombre de usuario
app.post('/auth', async (req, res) => {
    const user = req.body.correoOuser;
    const pass = req.body.pass;

    if (user && pass) {
        // Consulta si el correo o usuario existe en la base de datos
        connection.query('SELECT * FROM users WHERE pass = ? OR user = ?', [user, user], async (error, results) => {
            if (error) {
                console.log(error);
                res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Error en la autenticación",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                });
            } else {
                if (results.length === 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Correo/Usuario o contraseña incorrectos",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    });
                } else {
                    // Actualiza la sesión y la última conexión
                    req.session.loggedin = true;
                    req.session.name = results[0].name;

                    // Obtiene el ID del usuario
                    const userId = results[0].id;

                    // Actualiza last_login con la fecha y hora actuales para ese usuario
                    connection.query('UPDATE usuarios SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [userId], (updateError, updateResults) => {
                        if (updateError) {
                            console.log(updateError);
                            res.render('login', {
                                alert: true,
                                alertTitle: "Error",
                                alertMessage: "Error al actualizar última conexión",
                                alertIcon: "error",
                                showConfirmButton: true,
                                timer: false,
                                ruta: 'login'
                            });
                        } else {
                            res.render('login', {
                                alert: true,
                                alertTitle: "Conexión Exitosa",
                                alertMessage: "¡Inicio de sesión correcto!",
                                alertIcon: "success",
                                showConfirmButton: false,
                                timer: 1500,
                                ruta: ''
                            });
                        }
                    });
                }
            }
        });
    } else {
        res.render('login', {
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "¡Por favor ingrese un correo/usuario y contraseña!",
            alertIcon: "warning",
            showConfirmButton: true,
            timer: false,
            ruta: 'login'
        });
    }
});*/
//12 Auth

app.post('/', async (req, res) =>{
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHash = await bcryptjs.hash(pass,8);
    if(user && pass){
        connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results)=> {
            if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))){
                //res.send('Usuario y/o contraseña incorrecta');
                res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "User or password incorrect!",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                });
            
            }else{
                //res.send('Login correcto');
                req.session.loggedin = true;
                req.session.name = results[0].name
                res.render('login', {
                    alert: true,
                    alertTitle: "Successful conection",
                    alertMessage: "Login correcto!",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: ''
                });
            }
        })
    }else{
        //res.send('Por favor ingrese un usuario y/o password');
        res.render('login', {
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "Por favor ingrese un usuario y/o password",
            alertIcon: 'warning',
            showConfirmButton: true,
            timer: 1500,
            ruta: 'login'
        });
    }

})

//13 Auth Pages
app.get('/', (req, res) =>{
    if(req.session.loggedin){
        res.render('index', {
            login: true,
            name: req.session.name
        });
    }else{
        res.render('index', {
            login: false,
            name: 'Debe iniciar sesión'
        })
    }
})

//14.- Logout

app.get('/logout', (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/');
    })
})

//PRIMERA PARTE
app.listen(3000, (req, res) =>{
    console.log('Server running on https://localhost:3000/');
})