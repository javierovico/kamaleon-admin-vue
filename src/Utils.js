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