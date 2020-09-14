const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');



const getUsuarios = async(req, res) => {

        const usuario = await Usuario.find({}, 'nombre apellido dni email role google');


        res.status(400).json({
            ok: true,
            usuario: usuario
        });
    } // end getUsuarios



const createUsuarios = async(req, res = response) => {

        const { email, password, nombre, apellido, dni } = req.body;



        try {
            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'el correo ya fue registado'
                });
            }

            const existeDni = await Usuario.findOne({ dni });
            if (existeDni) {
                return res.status(400).json({
                    ok: false,
                    msg: 'el dni ya fue registado'
                });
            }


            const usuario = new Usuario(req.body);

            // Encriptar password
            const salt = bcrypt.genSaltSync();
            usuario.password = bcrypt.hashSync(password, salt);


            // Guardar Usuario
            await usuario.save();

            //Generar TOKEN - JWT
            const token = await generarJWT(usuario.id);

            res.json({
                ok: true,
                usuario: usuario,
                token
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Error inesperado... Revisar log'
            });

        }

    } // end createUsuarios



const actualizarUsuario = async(req, res = response) => {

        // TODO: Validar token y comprobar si es el usuario correcto

        const uid = req.params.id;

        try {

            const usuarioDB = await Usuario.findById(uid);

            if (!usuarioDB) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe un usuario con ese id'
                });
            }

            // Actualizar usuario
            const { password, google, email, ...campos } = req.body;

            if (usuarioDB.email !== email) {

                const existeEmail = await Usuario.findOne({ email });
                if (existeEmail) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Ya existe un usuario con ese email'
                    });
                }

                const existeDni = await Usuario.findOne({ dni });
                if (existeDni) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Ya existe un usuario con ese dni'
                    });
                }
            } // end if
            campos.email = email;

            const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

            res.json({
                ok: true,
                usuario: usuarioActualizado
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Error inesperado consultar log'
            });
        }

    } // end actualizarUsuario

const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);


        res.json({
            ok: true,
            msg: "Usuario eliminado"
        });

    } catch (error) {

        console.log(error);
        res.status(404).json({
            ok: false,
            msg: "Error inesperado, consultar al administrador"
        });
    }
}

module.exports = {
    getUsuarios,
    createUsuarios,
    actualizarUsuario,
    borrarUsuario,
}