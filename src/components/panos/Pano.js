export default class Pano{
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
    //count
    pano_destino_count
    //calculados
    position = null

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
        pano_destino_count = 0
    ) {
        this.id = id
        this.nombre = nombre
        this.archivo = archivo
        this.contenido = contenido
        this.zoom = zoom
        this.gps_lat = gps_lat
        this.gps_lng = gps_lng
        this.activo = activo
        this.created_at = created_at
        this.updated_at = updated_at
        this.pano_destino_count = pano_destino_count
        if(this.hasPosition()){
            this.position = {
                lat: this.gps_lat,
                lng: this.gps_lng
            }
        }
    }

    hasPosition(){
        return this.gps_lat && this.gps_lng
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
            e.pano_destino_count
        )
    }
}