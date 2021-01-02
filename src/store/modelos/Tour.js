import ClaseModel from "@/store/modelos/ClaseModel";
import Archivo from "@/store/modelos/Archivo";

export default class Tour extends ClaseModel{
    id
    nombre
    activo
    created_at
    updated_at
    fondo_id
    //relaciones
    fondo
    //visual
    _reproduciendo = false

    static URL_DESCARGA = `tour`

    constructor(
        id = null,
        nombre = null,
        activo = null,
        created_at = null,
        updated_at = null,
        fondo_id = null,
        fondo = null,
    ) {
        super();
        this.id = id
        this.nombre = nombre
        this.activo = activo
        this.created_at = created_at
        this.updated_at = updated_at
        this.fondo_id = fondo_id
        this.fondo = fondo?Archivo.fromSource(fondo):null
    }

    exists(){
        return this.id > 0
    }

    getUrlCarga(){
        return (this.exists())?(`tour/${this.id}`):(`tour`)
    }

    static fromSource(e){
        return new Tour(
            e.id,
            e.nombre,
            e.activo,
            e.created_at,
            e.updated_at,
            e.fondo_id,
            e.fondo,
        )
    }
}