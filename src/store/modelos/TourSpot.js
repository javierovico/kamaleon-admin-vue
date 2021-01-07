import ClaseModel from "@/store/modelos/ClaseModel";
import Archivo from "@/store/modelos/Archivo";

export default class TourSpot extends ClaseModel{
    id
    tour_id
    fuente
    destino
    en_h
    en_v
    a_h
    a_v
    activo
    created_at
    updated_at

    static URL_DESCARGA = `/tour-spot`

    constructor(
        id = null,
        tour_id = null,
        fuente = null,
        destino = null,
        en_h = null,
        en_v = null,
        a_h = null,
        a_v = null,
        activo = null,
        created_at = null,
        updated_at = null,
    ) {
        super();
        this.id = id
        this.tour_id = tour_id
        this.fuente = fuente
        this.destino = destino
        this.en_h = en_h
        this.en_v = en_v
        this.a_h = a_h
        this.a_v = a_v
        this.activo = activo
        this.created_at = created_at
        this.updated_at = updated_at
    }

    exists(){
        return this.id
    }

    getUrlCarga(){
        let url = `tour-spot`
        if(this.exists()){
            url += `/${this.id}`
        }
        return url
    }

    static fromSource(e){
        return new TourSpot(
            e.id,
            e.tour_id,
            e.fuente,
            e.destino,
            e.en_h,
            e.en_v,
            e.a_h,
            e.a_v,
            e.activo,
            e.created_at,
            e.updated_at,
        )
    }
}