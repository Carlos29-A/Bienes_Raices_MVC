import { Dropzone } from 'dropzone'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')


Dropzone.options.imagen = {
    dictDefaultMessage: 'Sube tus imagenes aqui',
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar Archivo',
    dicMaxFilesExceeded: 'El Limite es 1 archivo',
    headers: {
        'CSRF-Token': token
    },
    paramName: 'imagen',
    init: function () {
        const dropzone = this
        const btnPublicar = document.querySelector('#publicar')

        btnPublicar.addEventListener('click', function () {
            dropzone.processQueue()
        })

        dropzone.on('error', function (file, mensaje) {
            console.log(mensaje)
        })
        dropzone.on('queuecomplete', function () {
            if (dropzone.getActiveFiles().length == 0) {
                window.location.href = '/auth/vendedor/panel'
            }
        })
    }
}


Dropzone.options.imagenAdmin = {
    dictDefaultMessage: 'Subir tu imagen aqui',
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar el Archivo',
    dicMaxFilesExceeded: 'El Limite es 1 archivo',
    headers: {
        'CSRF-Token': token
    },
    paramName: 'imagenAdmin',
    init: function () {
        const dropzone = this
        const btnPublicar = document.querySelector('#publicar')

        btnPublicar.addEventListener('click', function () {
            dropzone.processQueue()
        })

        dropzone.on('error', function (file, mensaje) {
            console.log(mensaje)
        })
        dropzone.on('queuecomplete', function () {
            if (dropzone.getActiveFiles().length == 0) {
                window.location.href = '/auth/administrador/propiedades'
            }
        })
    }
}
