const { Console } = require('console');
const webdriver = require('selenium-webdriver');
const assert = require("assert").strict;
const {Builder, By, Key, until} = webdriver;
const chrome = require('selenium-webdriver/chrome');
let options = new chrome.Options();
let driver = new Builder().forBrowser('chrome').setChromeOptions(options).build();

async function iniciarSesion(){
   await driver.get('http://127.0.0.1:5500/registrodeClientes.html');//colocar aqui la ruta que liveServer provea

          let usuario = await driver.findElement( By.id('usuario') );
          let password = await driver.findElement( By.id('password') );
          let botonlogin = await driver.findElement( By.id('botonIniciarSesion') );
          
          await usuario.clear();
          await password.clear();
      
          await usuario.sendKeys('JuanPerez');
          await password.sendKeys('123456');
          await botonlogin.click();
          await driver.sleep(1000);

}
async function ejecutarPruebas() {
    describe('Pruebas de integracion', async function() {
       after(async function(){
          await driver.quit();
       });
       it('1.	Al intentar iniciar sesión con credenciales no válidas, el sistema lo notifica y no permite el acceso.', async function(){
          this.timeout(30000);
          await driver.get('http://127.0.0.1:5500/registrodeClientes.html');//colocar aqui la ruta que liveServer provea
 
          let usuario = await driver.findElement( By.id('usuario') );
          let password = await driver.findElement( By.id('password') );
          let botonlogin = await driver.findElement( By.id('botonIniciarSesion') );
          let credenciales = await driver.findElement( By.xpath("//strong[contains( text( ), 'Credenciales no válidos!')]"));
          
        
          await usuario.sendKeys('JuanPerez');
          await password.sendKeys('1234');
          await botonlogin.click();
          
          await driver.sleep(1000);
          let seEstaMostrando = await credenciales.isDisplayed();
          assert.equal(seEstaMostrando, true);
       });

       it('2.	Al intentar iniciar sesión con credenciales válidas, el sistema permite el acceso.', async function(){
          this.timeout(30000);
          iniciarSesion();
          await driver.sleep(1000);
          let encabezado = await driver.findElement( By.xpath("//h1[contains( text( ), 'Informacion Sobre Clientes')]"));
        
          
          let seEstaMostrando = await encabezado.isDisplayed();
          assert.equal(seEstaMostrando, true);
          
       });

       it('3.	Al pulsar la pestaña Registro de Clientes se debe mostrar el formulario de Registro de Clientes.', async function(){
          this.timeout(30000);
          iniciarSesion();

          await driver.sleep(1000);
          
          let botonRegistro = await driver.findElement( By.xpath("//a[contains( text( ), 'Registro')]"));
          let formularioRegistro = await driver.findElement( By.css("#contenedor-formulario-de-clientes>form"));
      
          botonRegistro.click();
          let seEstaMostrando = await formularioRegistro.isDisplayed();
          assert.equal(seEstaMostrando, true);
          await driver.sleep(1000);
       });

       it('4.	Al crear un nuevo cliente (o sea, no existente), el mismo se puede crear correctamente y los campos se muestran vacíos.', async function(){
          this.timeout(30000);

          await driver.sleep(1000);
      
          let cedula = await driver.findElement(By.id('txtCedula'));
          let nombre = await driver.findElement(By.id('txtNombre'));
          let apellido = await driver.findElement(By.id('txtApellido'));
          let direccion = await driver.findElement(By.id('txtDireccion'));
          let botonAgregar = await driver.findElement(By.id('agrega'));


          await cedula.sendKeys('40221368459');
          await nombre.sendKeys('Harry');
          await apellido.sendKeys('Styles');
          await direccion.sendKeys('London Road, Holmes Chapel, Crewe, Cheshire CW4 7BG');
          await driver.sleep(1000);
          botonAgregar.click();

          let botonRegistro = await driver.findElement( By.xpath("//a[contains( text( ), 'Registro')]"));
          botonRegistro.click();
          
          let cedulaVacia = await cedula.getAttribute("value");
          let nombreVacia = await cedula.getAttribute("value");
          let apellidoVacia = await cedula.getAttribute("value");
          let direccionVacia = await cedula.getAttribute("value");

          assert.equal(cedulaVacia,'');
          assert.equal(nombreVacia,'');
          assert.equal(apellidoVacia,'');
          assert.equal(direccionVacia,'');
       });

       it('5.	Al agregar un nuevo cliente (presionando el botón Agregar), se debe mostrar el listado de clientes.', async function(){
          this.timeout(30000);

          await driver.sleep(1000);
      
          let cedula = await driver.findElement(By.id('txtCedula'));
          let nombre = await driver.findElement(By.id('txtNombre'));
          let apellido = await driver.findElement(By.id('txtApellido'));
          let direccion = await driver.findElement(By.id('txtDireccion'));
          let botonAgregar = await driver.findElement(By.id('agrega'));


          await cedula.sendKeys('40221368456');
          await nombre.sendKeys('Genesis');
          await apellido.sendKeys('Peña');
          await direccion.sendKeys('Santiago de los caballeros RD');
          await driver.sleep(1000);
          botonAgregar.click();

          let listadoClientes = await driver.findElement( By.css("#contenedor-datos-de-clientes>table"));
      
          let seEstaMostrando = await listadoClientes.isDisplayed();
          assert.equal(seEstaMostrando, true);
          await driver.sleep(1000);
          
       });

       it('6.	Al intentar crear un cliente existente (o sea, el número de cedula ya estaba registrado), el sistema no lo permite y muestra un mensaje notificando que el cliente ya existe.', async function(){
         this.timeout(30000);

         await driver.sleep(1000);
         let botonRegistro = await driver.findElement( By.xpath("//a[contains( text( ), 'Registro')]"));
          botonRegistro.click();
     
         let cedula = await driver.findElement(By.id('txtCedula'));
         let nombre = await driver.findElement(By.id('txtNombre'));
         let apellido = await driver.findElement(By.id('txtApellido'));
         let direccion = await driver.findElement(By.id('txtDireccion'));
         let botonAgregar = await driver.findElement(By.id('agrega'));


         await cedula.sendKeys('40221368456');
         await nombre.sendKeys('Genesis');
         await apellido.sendKeys('Peña');
         await direccion.sendKeys('Santiago de los caballeros RD');
         await driver.sleep(1000);
         botonAgregar.click();

         await driver.sleep(1000);
         let notifCedulaDuplicada = await driver.findElement( By.xpath("//strong[contains( text( ), 'Ya existe un cliente con ese número de cédula!')]"));
     
         let seEstaMostrando = await notifCedulaDuplicada.isDisplayed();
         assert.equal(seEstaMostrando, true);
         await driver.sleep(1000);
         
       });

       it('7.	Al pulsar la pestaña Listado de Clientes se debe mostrar la tabla de clientes.', async function(){
         this.timeout(30000);
         
          let pestaniaListado = await driver.findElement( By.xpath("//a[contains( text( ), 'Listado de Clientes')]"));
          let listadoClientes = await driver.findElement( By.css("#contenedor-datos-de-clientes>table"));
      
          pestaniaListado.click();
      
          let seEstaMostrando = await listadoClientes.isDisplayed();
          assert.equal(seEstaMostrando, true);
          await driver.sleep(1000);
       
       });
       ////*[@id="tabla-clientes"]/tbody/tr[1]/td[5]/button[2]
       it('8.	Al pulsar el botón eliminar en alguna de las filas de la tabla de clientes, dicha fila se elimina de la tabla.', async function(){
         this.timeout(30000);
         
          let cedula = await driver.findElement( By.css('#tabla-clientes > tbody > tr:nth-child(1) > td:nth-child(1) > span'));
          let obtenerCedula = await cedula.getText();

          
          let botonEliminar = await driver.findElement( By.xpath("//tbody/tr[1]/td[5]/button[2]"));
          botonEliminar.click();

          await driver.sleep(1000);

          let cedulaPosterior = await driver.findElement( By.css('#tabla-clientes > tbody > tr:nth-child(1) > td:nth-child(1) > span'));
          let obtenerCedulaPosterior = await cedulaPosterior.getText();
          
          assert.notEqual(obtenerCedula,obtenerCedulaPosterior);

          await driver.sleep(1000);
       });
       ////tbody/tr[1]/td[1]/input
       it('9.	Al pulsar el botón modificar en alguna de las filas de la tabla de clientes, dicha fila muestra los campos de texto correspondientes (Se pone en modo de edición).', async function(){
         this.timeout(30000);
         
          let botonEditar = await driver.findElement( By.xpath("//tbody/tr[1]/td[5]/button[1]"));
          botonEditar.click();
          await driver.sleep(1000);

          let modoEdicion = await driver.findElement( By.xpath("//tbody/tr[1]/td[1]/input"));
      
          let seEstaMostrando = await modoEdicion.isDisplayed();
          assert.equal(seEstaMostrando, true);
          await driver.sleep(1000);
       
       });

       it('10.	Al pulsar el botón modificar en alguna de las filas de la tabla de clientes (mientras esta esté en modo de edición), dicha fila Oculta los campos de texto y muestra solamente el texto. ', async function(){
         this.timeout(30000);
         
         let botonEditar = await driver.findElement( By.xpath("//tbody/tr[1]/td[5]/button[1]"));
         botonEditar.click();
         await driver.sleep(3000);

          let modoEdicionCerrado = await driver.findElement( By.css("#tabla-clientes > tbody > tr:nth-child(1) > td:nth-child(1) > input"));
      
          let seEstaMostrando = await modoEdicionCerrado.isDisplayed();
          assert.equal(seEstaMostrando, false);
          
       
       });

    });
 }

 ejecutarPruebas();
 