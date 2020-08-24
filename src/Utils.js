export function addQuery(query, router) {
    let nuevaRuta = {
        path: router.path.toString(),
        query: query
    }
    for (let key in router.query) {
        let existe = false
        for (let key2 in query) {
            if(key == key2){
                existe = true
            }
        }
        if(!existe){
            nuevaRuta.query[key] = router.query[key]
        }
    }
    return nuevaRuta
}