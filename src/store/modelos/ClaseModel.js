export default class ClaseModel{

    static URL_DESCARGA = `/xxxx`
    static PRIMARY_KEY = `id`

    actualizarCambios(sucursalCopia){
        for (let key in sucursalCopia) {
            if(this[key] && this[key].actualizarCambios){
                this[key].actualizarCambios(sucursalCopia[key])
            }else{
                this[key] = sucursalCopia[key]
            }
        }
        this.construirArrays()
    }

    /**
     * Por si se quiera alterar los datos a enviar
     * @returns {ClaseModel}
     */
    dataEnvio(){
        return this
    }

    construirArrays() {

    }

    exists(){
        throw 'Se debe implementar en el hijo'
    }

    // getUrlCarga(){
    //     throw 'Se debe implementar en el hijo'
    // }

    getUrlCarga(){
        return ClaseModel.urlCargaFromId(this[ClaseModel.PRIMARY_KEY])
    }

    getMethodCarga(){
        return this.exists()?'PUT':'POST'
    }

    static fromSource(e){
        throw 'no'
    }

    static urlCargaFromId(id){
        throw 'no'
    }
}