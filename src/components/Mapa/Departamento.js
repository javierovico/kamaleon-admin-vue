export default class Departamento {
    id
    numero
    nombre
    created_at
    updated_at
    ciudades_count

    constructor(
        id = null,
        numero = null,
        nombre = null,
        created_at = null,
        updated_at = null,
        ciudades_count = null,
    ) {
        this.id = id
        this.numero = numero
        this.nombre = nombre
        this.created_at = created_at
        this.updated_at = updated_at
        this.ciudades_count = ciudades_count
    }
    isCreated(){
        return this.id !== null
    }


    static fromSource(e){
        return new Departamento(
            e.id,
            e.numero,
            e.nombre,
            e.created_at,
            e.updated_at,
            e.ciudades_count,
        )
    }
}