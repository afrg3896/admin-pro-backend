
const {response} = require('express');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const Usuario = require('../models/usuario');
const res = require('express/lib/response');
const req = require('express/lib/request');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) => {

    const usuarios = await Usuario.find({}, 'nombre email google');

    res.status(200).json({
        ok: true,
        usuarios,
        uid: req.uid
    });
}

const crearUsuario = async(req, res = response) => {

    const {email, password} = req.body;

    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({
            ok:false,
            errors: errores.mapped()
        });
    }

    try {

        const existeEmail = await Usuario.findOne({email:email});

        if(existeEmail){
            return res.status(400).json({
                ok:false,
                msg: 'El correo ya està registrado'
            });
        }

        const usuario = new Usuario(req.body);

        //Encriptar Contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);


        await usuario.save();
        const token = await generarJWT(usuario.id);
    
        res.json({
            ok: true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Error inesperado...revisar logs'
        })
    }


}


const actualizarUsuario = async() => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg: 'No existe un usuario por ese id'
            });
        }

        //Actualizaciones

        const {password, google,email, ...campos} = req.body;
        if(usuarioDB.email !== email){

            const existeEmail = await Usuario.findOne({email});
            if(existeEmail){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new:true});

        res.json({
            ok:true,
            usuario: usuarioActualizado
        })
        
    } catch (error) {
        res.status(500).json({
            ok:false,

        })
    }

}

const borrarUsuario = async(req, res = response) => {
    const uid = req.params.id;
    try {

        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            })
        }

        await Usuario.findByIdAndDelete(uid);
        res.json({
            ok:true,
            msg: 'Usuario Eliminado'
        });

    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'Error, hable con el administrador'
        });
    }
}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}