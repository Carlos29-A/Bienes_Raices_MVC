import { check, validationResult } from 'express-validator'


const validarUsuarioAdministrador = async (req) => {

    await check('nombre').notEmpty().withMessage('El nombre es requerido').run(req)
    await check('nombre').not().matches(/[0-9]/).withMessage('El nombre no puede contener numeros').run(req)
    await check('apellido').notEmpty().withMessage('El apellido es requerido').run(req)
    await check('apellido').not().matches(/[0-9]/).withMessage('El apellido no puede contener numeros').run(req)
    await check('email').notEmpty().withMessage('El email es requerido').run(req)
    await check('email').isEmail().withMessage('El email no es válido').run(req)
    await check('telefono').notEmpty().withMessage('El telefono es requerido').run(req)
    await check('telefono').isNumeric().withMessage('El telefono debe ser un numero').run(req)
    await check('telefono').isLength({ min: 9, max: 9 }).withMessage('El telefono debe tener 9 digitos').run(req)
    await check('telefono').matches(/^9[0-9]{8}$/).withMessage('El telefono debe ser de Perú').run(req)
    await check('edad').notEmpty().withMessage('La edad es requerida').run(req)
    await check('edad').isInt({min: 23, max: 80}).withMessage('La edad debe ser entre 23 y 80 años').run(req)
    await check('edad').isNumeric().withMessage('La edad debe ser un numero').run(req)
    await check('confirmado').notEmpty().withMessage('El estado de confirmación es requerido').run(req)
    await check('password').notEmpty().withMessage('La contraseña es requerida').run(req)
    await check('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres').run(req)
    await check('password_confirmar').notEmpty().withMessage('La contraseña de confirmación es requerida').run(req)
    await check('password_confirmar').isLength({ min: 8 }).withMessage('La contraseña de confirmación debe tener al menos 8 caracteres').run(req)
    await check('password_confirmar').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req)

    //Recoger los errores 
    const errores = validationResult(req)

    return errores

}

const validarPropiedad = async (req) => {
    await check('titulo').notEmpty().withMessage('El título es obligatorio').run(req)
    await check('titulo').isLength({ min: 3 }).withMessage('El título debe tener al menos 3 caracteres').run(req)
    await check('precio').notEmpty().withMessage('El precio es obligatorio').run(req)
    await check('precio').isInt({min: 30000}).withMessage('El precio debe ser mayor a 30000').run(req)
    await check('descripcion').notEmpty().withMessage('La descripción es obligatoria').run(req)
    await check('descripcion').isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres').run(req)
    await check('categoria').notEmpty().withMessage('La categoría es obligatoria').run(req)
    await check('habitaciones').notEmpty().withMessage('El número de habitaciones es obligatorio').run(req)
    await check('wc').notEmpty().withMessage('El número de baños es obligatorio').run(req)
    await check('estacionamiento').notEmpty().withMessage('El número de estacionamientos es obligatorio').run(req)

    // Recoger los errores
    const errores = validationResult(req)

    return errores

}


export {
    validarUsuarioAdministrador,
    validarPropiedad
}