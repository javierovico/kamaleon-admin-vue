export default class Articulo {
    id
    nombre
    precio
    miniatura_id
    empresa_id
    created_at
    updated_at
    descripcion
    //tipos
    miniatura = null
    //para form
    miniaturaAlzar

    constructor(
        id = null,
        nombre = null,
        precio = null,
        miniatura_id = null,
        empresa_id = null,
        created_at = null,
        updated_at = null,
        miniatura = null,
        descripcion = null,
    ){
        this.id =id
        this.nombre =nombre
        this.precio =precio
        this.miniatura_id =miniatura_id
        this.empresa_id =empresa_id
        this.created_at =created_at
        this.updated_at =updated_at
        this.miniatura = miniatura
        this.descripcion = descripcion
    }

    static fromSource(e){
        return new Articulo(
            e.id,
            e.nombre,
            e.precio,
            e.miniatura_id,
            e.empresa_id,
            e.created_at,
            e.updated_at,
            e.miniatura?e.miniatura:null,
            e.descripcion,
        )
    }
}