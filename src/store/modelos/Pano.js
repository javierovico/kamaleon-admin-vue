import ClaseModel from "@/store/modelos/ClaseModel";
import Archivo from "@/store/modelos/Archivo";

export default class Pano extends ClaseModel{
    id
    nombre
    archivo
    contenido
    zoom
    gps_lat
    gps_lng
    activo
    created_at
    updated_at
    fondo_id
    tipo
    //calculadas como atributo
    urlMiniatura
    //relaciones
    fondo
    //visual
    _reproduciendo = false

    static URL_DESCARGA = `/pano`

    constructor(
        id = null,
        nombre = null,
        archivo = null,
        contenido = null,
        zoom = null,
        gps_lat = null,
        gps_lng = null,
        activo = null,
        created_at = null,
        updated_at = null,
        fondo_id = null,
        tipo = null,
        fondo = null,
        urlMiniatura = '',
    ) {
        super();
        this.id=id
        this.nombre=nombre
        this.archivo=archivo
        this.contenido=contenido
        this.zoom=zoom
        this.gps_lat=gps_lat
        this.gps_lng=gps_lng
        this.activo=activo
        this.created_at=created_at
        this.updated_at=updated_at
        this.fondo_id=fondo_id
        this.tipo=tipo
        this.fondo = fondo?Archivo.fromSource(fondo):null
        this.urlMiniatura = urlMiniatura
    }

    exists(){
        return this.id > 0
    }

    getUrlCarga(){
        let url = `pano`
        if(this.exists()){
            url += `/${this.id}`
        }
        return url
    }


    static fromSource(e){
        return new Pano(
            e.id,
            e.nombre,
            e.archivo,
            e.contenido,
            e.zoom,
            e.gps_lat,
            e.gps_lng,
            e.activo,
            e.created_at,
            e.updated_at,
            e.fondo_id,
            e.tipo,
            e.fondo,
            e.urlMiniatura,
        )
    }
}