/*
    Este archivo contiene funciones para encriptar y desencriptar datos sensibles en la base de datos, como el teléfono y la dirección de los responsables.
    Usamos el módulo 'crypto' de Node.js para implementar un cifrado simétrico con el algoritmo AES-256-CBC, que es un estándar de seguridad utilizado por bancos y gobiernos.
*/
const crypto = require('crypto');

// ALGORITMO: Es el modelo de "caja fuerte" que vamos a usar. 
const ALGORITMO = 'aes-256-cbc';

// LA LLAVE: Debe tener EXACTAMENTE 32 caracteres.
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; 

const encriptarDato = (textoPlano) => {
    // Si no mandaron nada (ej: el responsable no tiene teléfono fijo), no hacemos nada
    if (!textoPlano) return textoPlano;
    
    // 1. Genera el vector de inicialización aleatorio (16 bytes)
    const vectorInicializacion = crypto.randomBytes(16);
    
    // 2. Crea la "caja fuerte" indicando el algoritmo, la llave y el vector de inicialización
    const cifrador = crypto.createCipheriv(ALGORITMO, Buffer.from(ENCRYPTION_KEY), vectorInicializacion);
    
    // 3. Se mete el texto plano adentro de la caja y se cierra
    let textoEncriptado = cifrador.update(textoPlano);
    textoEncriptado = Buffer.concat([textoEncriptado, cifrador.final()]);
    
    // 4. Devuelve un string uniendo el vector de inicialización y el texto encriptado, separados por ":"
    // Quedará algo como: "b2a1c...:f8d9e..."
    return vectorInicializacion.toString('hex') + ':' + textoEncriptado.toString('hex');
};


const desencriptarDato = (textoEncriptadoRandom) => {
    // Si viene vacío, lo devuelve vacío
    if (!textoEncriptadoRandom) return textoEncriptadoRandom;
    
    // Todos nuestros datos encriptados tienen el formato "random:textoCifrado".
    // Si el texto NO contiene ":", significa que es un dato viejo guardado en texto plano.
    // Entonces lo devolvemos tal cual sin intentar desencriptarlo.
    if (!textoEncriptadoRandom.includes(':')) {
        return textoEncriptadoRandom;
    }

    try {
        // 1. Agarra el string "b2a1c...:f8d9e..." y lo corta por los dos puntos ":"
        const partes = textoEncriptadoRandom.split(':');
        
        // 2. La primera parte es el vector de inicialización, la segunda parte es la información encriptada
        const vectorInicializacion = Buffer.from(partes.shift(), 'hex');

        // 2.1 Validación: El vector debe ser exactamente de 16 bytes
        if (vectorInicializacion.length !== 16) {
            return textoEncriptadoRandom;
        }

        const textoEncriptado = Buffer.from(partes.join(':'), 'hex');

        // 3. Agarra la llave y el vector de inicialización para preparar la apertura de la caja
        const descifrador = crypto.createDecipheriv(ALGORITMO, Buffer.from(ENCRYPTION_KEY), vectorInicializacion);
        
        // 4. Abre la caja y saca el texto original
        let textoDescifrado = descifrador.update(textoEncriptado);
        textoDescifrado = Buffer.concat([textoDescifrado, descifrador.final()]);
        
        // 5. Lo devuelve como texto normal listo para usar en el backend o mandar al front
        return textoDescifrado.toString();

    } catch (error) {
        // Si por alguna razón falla al desencriptar, devolvemos el texto original
        // para evitar que toda la API se caiga (Error 500)
        console.error("Error silencioso al desencriptar:", error.message);
        return textoEncriptadoRandom;
    }
};

module.exports = { 
    encriptarDato, 
    desencriptarDato 
};