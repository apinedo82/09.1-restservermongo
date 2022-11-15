const { response, request } =  require('express');
const bcryptjs =  require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async(req = request, res = response) => {
    //const { f, nombre = 'No Name', ipq, page = 1, limit = 10} = req.query;
    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true }

    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite));

    // const total = await Usuario.count(query);

    const [ total, usuarios ] = await Promise.all([
        Usuario.count(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    });
};

const usuariosPost = async(req, res = response) => {
    
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( { nombre, correo, password, rol });

    // Encriptar contraseña con hash
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt);

    // guardar en BD
    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosPut = async(req, res = response) => {
    const { id } = req.params;

    const { _id, password, google, correo, ...resto } = req.body;

    // validar contra Base de datos
    if (password){
          // Encriptar contraseña con hash
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt);  
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        usuario
    });
}

const usuariosDelete = async(req, res = response) => {
    const { id } = req.params;

    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete(id);

    // Borrando cambiandole el estado a false para no perder la referencia
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false})

    res.json({
        usuario
    });
}

const usuariosPacth = (req, res = response) => {
    res.json({
        msg:'pacth API - Controlador'
    });
}





module.exports ={
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPacth
}