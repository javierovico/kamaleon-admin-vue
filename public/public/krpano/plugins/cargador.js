/*
    krpano HTML5 Javascript Plugin Example
*/

function krpanoplugin() {
    var local = this;   // save the 'this' pointer from the current plugin object
    var krpano = null;  // the krpano and plugin interface objects
    var plugin = null;
    //mi propio variable
    const cortes = [2, 4, 7, 13, 24]
    const levels = ['front','right','back','left','up','down']
    let idpadre = 'kemedesistes';    //indica qeu no hay
    local.registerplugin = function(krpanointerface, pluginpath, pluginobject) {
        krpano = krpanointerface;
        plugin = pluginobject;
        plugin.registerattribute("idpadre",idpadre, set_padre, get_padre);
        plugin.carga_dinamica = action_cargaDinamica;
        plugin.notificar_cargado = notificar_cargado;
        plugin.cambiar_pano = cambiar_pano;
        action_cargaDinamica('iniciado')
    }

    function get_padre(){
        return idpadre;
    }

    function set_padre(nuevoPadre){

    }

    local.unloadplugin = function() {
        plugin = null;
        krpano = null;
    }

    local.onresize = function(width,height) {
        return false;
    }

    function cambiar_pano(pano_id) {
        krpano.call(`loadscene(pano${pano_id}, null, MERGE)`)
    }

    /**
     * Notifica que ya se cargo
     */
    function notificar_cargado() {
        const funcionNotificadora = krpano.get('notificar')
        if(funcionNotificadora){
            funcionNotificadora()
        }
    }

    /**
     * carga dinamicamente las scenas
     */
    function action_cargaDinamica(params){
        const arrayKrpanoScenes = krpano.get("scene")
        for(let i = arrayKrpanoScenes.count-1; i >= 0 ; i--){
            arrayKrpanoScenes.removeItem(i)
        }
        // krpano.get("scene").getArray().forEach(e=>{
        //     krpano.set(`scene[${e.name}].name`,null)
        // })
        const panoramas = krpano.get('panos')
        const raizArchivos = krpano.get('raizArchivos')
        const tituloPanorama = krpano.get('tituloPanorama')
        const tourSpots = krpano.get('tourSpots')
        panoramas.forEach(p=>{
            const nombrePano = `pano${p.id}`
            const thumbnail = raizArchivos + `/${p.archivo}/thumbnail.jpg`
            //Inicio de contenido
            let contenido = ''
            contenido += `<autorotate horizon="0.000000" tofov="90.000000" waittime="1" speed="5"/>
                <panoview h="0.000000" v="0.000000" fov="90.000000" hmin="-180" hmax="180" vmin="-90" vmax="90" fovmax="90" />
                <view fisheye="0"
                      limitview="range"
                      hlookatmin="-180"
                      hlookatmax="180"
                      vlookatmin="-90"
                      vlookatmax="90"
                      maxpixelzoom="1.0"
                      fovtype="VFOV"
                      fovmax="90"
                      fov="90.000000"
                      hlookat="0.000000"
                      vlookat="0.000000"/>
                <preview url="${raizArchivos}/${p.archivo}/preview.jpg" type="CUBESTRIP" striporder="FRBLUD" />`
            contenido += `<image type="CUBE" multires="true" baseindex="0" tilesize="512" devices="!androidstock|webgl">`
            for(let level = p.zoom; level >= 0 ; level-- ){
                //Se crean los levels
                contenido += `<level tiledimagewidth="${cortes[level]*512}" tiledimageheight="${cortes[level]*512}">`
                levels.forEach((l,i)=>{
                    contenido += `<${l} url="${raizArchivos}/${p.archivo}/${i}/${level}/%v_%u.jpg"/>`
                })
                contenido += `</level>`
            }
            contenido += `</image>`
            levels.forEach((l,i)=>{
                contenido += `<${l} url="${raizArchivos}/${p.archivo}/mobile/${i}.jpg"/>`
            })
            contenido += `<image type="CUBE" devices="androidstock.and.no-webgl">`

            contenido += `</image>`
            tourSpots.filter(ts=> ts.fuente === p.id).forEach(spot=>{
                const destinoPano = panoramas.find(p=> p.id === spot.destino)
                contenido += `<hotspot name="pano${destinoPano.id}"
                                 url="${destinoPano.urlMiniatura}"
                                 thumb="${raizArchivos}/${destinoPano.archivo}/thumbnail_hotspot.png"
                                 ath="${spot.en_h}" atv="${spot.en_v}"
                                 fth="${spot.a_h }" ftv="${spot.a_v}"
                                 tag="Ir a ${destinoPano.nombre}"
                                 style="hs_circle"
                        />`
            })
            //fin de contenido
            krpano.set(`scene[${nombrePano}].content`,contenido)
            if(p.gps_lat && p.gps_lng){
                krpano.set(`scene[${nombrePano}].lat`,p.gps_lat);
                krpano.set(`scene[${nombrePano}].lng`,p.gps_lng);
            }
            krpano.set(`scene[${nombrePano}].mostrarMiniaturaInferior`, 'true');
            krpano.set(`scene[${nombrePano}].thumburl`,thumbnail);
            krpano.set(`scene[${nombrePano}].backgroundsound`,'');
            krpano.set(`scene[${nombrePano}].backgroundsoundloops`,'0');
            krpano.set(`scene[${nombrePano}].haspolygons`,'false');
            krpano.set(`scene[${nombrePano}].titleid`,nombrePano);
            krpano.set(`scene[${nombrePano}].title`,p.nombre);
            krpano.set(`scene[${nombrePano}].descriptionid`,p.nombre);
            krpano.set(`scene[${nombrePano}].multires`,'true');
            krpano.set(`scene[${nombrePano}].planar`,'false');
            krpano.set(`scene[${nombrePano}].full360`,'true');
            krpano.set(`scene[${nombrePano}].video`,'false');
            krpano.set(`scene[${nombrePano}].sonido`,'');
            krpano.set(`scene[${nombrePano}].seen`,'false');
            krpano.set('title',tituloPanorama)
        })
        const scenes = krpano.get("scene").getArray();
        if(scenes.length){
            //TODO: ver por aca si hace falta cambiar la escena inicial
            krpano.call(`loadscene(${scenes[0].name}, null, MERGE)`)
            krpano.call(`skin_startup`)
        }
    }

}