export function addQuery(router,query = {},path = null) {
    let nuevaRuta = {
        path: path?path:router.path.toString(),
        query: query.add?query.add:{}
    }
    for (let key in router.query) {
        let existe = false
        if(query.add){
            for (let key2 in query.add) {
                if(key == key2){
                    existe = true
                }
            }
        }
        if(!existe && (!(query.rem) || query.rem.every(ele=>ele!==key))){
            nuevaRuta.query[key] = router.query[key]
        }
    }
    return nuevaRuta
}

/*
fuente:[{
    title,
    text,
    key:
    obligatorio: [true/false]
    creacion: [true/false]
}]
 */
export function crearArrayPreguntas(target,fuente){
    return fuente.filter(c=> (!c.creacion || !target.exists())).map((f,index,arr)=>{
        let ret =  {
            title: f.title,
            text: f.text?f.text:'',
            inputValue: target[f.key],//usuarioEdit.usuario,
            preConfirm: input=>{
                target[f.key] = input
            },
        }
        if(f.inputValidator){
            ret.inputValidator = f.inputValidator
        }else if(f.obligatorio){
            ret.inputValidator = (input) => {
                if(input.length ===0){
                    return "Campo Obligatorio"
                }
            }
        }
        if((index+1) === arr.length){
            ret.confirmButtonText = 'Guardar'
            ret.confirmButtonColor = '#36aa32'
        }
        return ret
    })
}
// export const URL = 'http://192.168.0.4:81/api'
// export const URL = 'http://api.kamaleon360.com/api'
//
// export const URL_WEB = 'http://192.168.0.4:81'
