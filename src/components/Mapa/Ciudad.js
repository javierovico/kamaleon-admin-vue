export default class Ciudad {
    id
    numero
    nombre
    created_at
    updated_at

    constructor(
        id = null,
        numero = null,
        nombre = null,
        created_at = null,
        updated_at = null,
    ) {
        this.id = id
        this.numero = numero
        this.nombre = nombre
        this.created_at = created_at
        this.updated_at = updated_at
    }


    static fromSource(e){
        return new Ciudad(
            e.id,
            e.numero,
            e.nombre,
            e.created_at,
            e.updated_at,
        )
    }
}