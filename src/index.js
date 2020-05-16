import * as THREE from '../node_modules/three/build/three.module.js'
import {GUI} from '../node_modules/three/examples/jsm/libs/dat.gui.module.js'
import {OrbitControls} from '../node_modules/three/examples/jsm/controls/OrbitControls.js'
import {Sky} from '../node_modules/three/examples/jsm/objects/Sky.js'
import {EffectComposer} from '../node_modules/three/examples/jsm/postprocessing/EffectComposer.js'
import {UnrealBloomPass} from '../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js'
import {RenderPass} from '../node_modules/three/examples/jsm/postprocessing/RenderPass.js'
import {AfterimagePass} from '../node_modules/three/examples/jsm/postprocessing/AfterimagePass.js'
import {TGALoader} from '../node_modules/three/examples/jsm/loaders/TGALoader.js'



// 01 creating a textured box
// use npm http-server -c-1 to run the server with cache disabled


// scene camera renderer
let scene
let camera 
let renderer


// texture loader
let texLoader
let tgaLoader


// array of cubes
let cubes = []


// cube components
let geometry
let material 
let woodTex
let woodMaterial
let lavaTex
let lavaEmi


// floor
let FloorGeometry
let FloorDiffuseTex
let FloorNormalTex
let FloorMaterial
let Floor


// lights
let AmbientLight
let PointLight
let PointLight2 
let SpotLight


// raycast
let mouse = {x: 0, y: 0}
let ray


// camera orbit control
let OrbitControls_1


// sky
let sky
let sunSphere
let PanoramaTex
let PanoramaMesh
let PanoramaGeometry


// effect composer
let composer
let UEBloom
let RPass
let AfterIMG







let CreateGUI = () => {
    // let gui = new GUI({name: 'Drunkness'})
    // gui.add(AfterIMG.uniforms["damp"], 'value', 0.0, 1).step(0.01)
    // AfterIMG.damp = 0.0
    
    

}




let init = () => {
    // create scene camera and renderer
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 )
    renderer = new THREE.WebGLRenderer()
    
    // set renderer to window size and appened to <body>
    renderer.setSize( window.innerWidth, window.innerHeight )
    document.body.appendChild( renderer.domElement )
    


    // texture loader
    texLoader = new THREE.TextureLoader()
    tgaLoader = new TGALoader()
    




    // Panorama
    PanoramaTex = texLoader.load('./asset/galaxy.jpg')
    PanoramaGeometry = new THREE.SphereBufferGeometry(500,60,40)
    PanoramaGeometry.scale(-1,1,1)
    
    PanoramaMesh = new THREE.Mesh(
        PanoramaGeometry,
        new THREE.MeshBasicMaterial({
            map: PanoramaTex,
            color: 0x666666
        })
    )
    PanoramaMesh.rotation.y = 500
    scene.add(PanoramaMesh)

    // // Skybox
    // sunSphere = new THREE.Mesh(
    //     new THREE.SphereBufferGeometry(20000, 16, 8),
    //     new THREE.MeshBasicMaterial({color: 0xffffff})
    // )
    // sunSphere.position.set( 0 ,0, -1000)
    // sunSphere.visible = true;
    // scene.add(sunSphere)

    // sky = new Sky()
    // sky.scale.setScalar(500)
    // let uniforms = sky.material.uniforms
    // console.log(sky);
    
    // uniforms["turbidity"].value = 10
    // uniforms["rayleigh"].value = 0.1
    // uniforms["mieCoefficient"].value = 0.005
    // uniforms["mieDirectionalG"].value = 0.20
    // uniforms["luminance"].value = 0.001
    // uniforms[ "sunPosition" ].value.copy( sunSphere.position )
    // scene.add(sky)
    
    
    
    // post process
    RPass = new RenderPass(scene, camera)
    
    UEBloom = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
    )
    UEBloom.resolution = 0.5
    UEBloom.threshold = 0
    UEBloom.exposure = 1
    UEBloom.radius = 0
    UEBloom.strength = 0.28


    AfterIMG = new AfterimagePass()
    AfterIMG.damp = 0.6



    // add pp to effect composer
    composer = new EffectComposer(renderer)
    composer.addPass(RPass)
    // composer.addPass(AfterIMG)
    composer.addPass(UEBloom)







    // lava texture
    lavaTex = tgaLoader.load('../asset/pattern_81/diffus.tga')
    lavaEmi = tgaLoader.load('../asset/pattern_81/emissive.tga')
    




    
    // basic color material
    material = new THREE.MeshPhongMaterial( { color: 0xffffff } )    
    
    // texture from pictures
    woodTex = texLoader.load("../asset/bw.jpg")
    
    // cube geometry
    geometry = new THREE.BoxGeometry()

    // material from texture loaded from jpg
    woodMaterial = new THREE.MeshPhongMaterial({
        map: woodTex,
        reflectivity: 1.0,
        color: 0xffffff
    })





    // create cube and push into the array
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            var cube = new THREE.Mesh( geometry, woodMaterial )
            cube.scale.set(1,1,1)
            cube.position.set(i * 2 - 2, j * 2 - 2, 0)
            
            cubes.push(cube)
        
        }
    }
    
    // add all elements from the array to the scene
    cubes.forEach(cube => {
        
        scene.add( cube )
    })








    // Floor
    FloorGeometry = new THREE.BoxGeometry()
    FloorDiffuseTex = new texLoader.load("../asset/marble/marble-diffuse.jpg")
    // FloorNormalTex = new texLoader.load("../asset/marble/marble-normal.jpg")

    FloorMaterial = new THREE. MeshPhongMaterial({
        map: lavaTex,
        // normalMap: FloorNormalTex,
        emissiveMap: lavaEmi,
        emissiveIntensity: 4.0,
        emissiveColor: 0xffff00,
        color: 0xffffff,
        reflectivity: 1.0
    })
    Floor = new THREE.Mesh(FloorGeometry, FloorMaterial)
    Floor.scale.set(20,20,20)
    Floor.position.set(0,-13,0)

    scene.add(Floor)


    // set camera position
    camera.position.set(0,1,8)

    // orbit control
    OrbitControls_1 = new OrbitControls(camera, renderer.domElement)
    OrbitControls_1.enableZoom = true;

    // Lights
    AmbientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(AmbientLight)


    PointLight = new THREE.PointLight(0xff00ff, 2, 5, 2)
    PointLight.position.set(3, 0, 2)
    scene.add(PointLight)

    PointLight2 = new THREE.PointLight(0x00ff22, 2, 5, 2)
    PointLight2.position.set(-3, 0, 2)
    scene.add(PointLight2)

    SpotLight = new THREE.SpotLight(0xffffff, 0.0)
    SpotLight.position.set( 0, 100, 0 );
    SpotLight.angle = Math.PI/4;
    SpotLight.penumbra = 0.05;
    SpotLight.decay = 2;
    SpotLight.distance = 400;
    scene.add( SpotLight );



    
    // add on click event listener
    document.addEventListener("mousedown", onMousedown, false)
    window.addEventListener( 'resize', onWindowResize, false );

    // raycaster for click
    ray = new THREE.Raycaster()



}

			

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );


}


function onMousedown(event) {
    console.log("mouse clicked");
    // get screen mouse position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = 1 - (event.clientY / window.innerHeight) * 2
    

    console.log(mouse.x)
    console.log(mouse.y)

    // send mouse and camera data to raycaster
    ray.setFromCamera(mouse,camera)
    
    // define array of intersected onjects
    let intersects = ray.intersectObjects(cubes, true)
    console.log(intersects)

    // onclick event for all single cubes
    if (intersects.length > 0) {
        for (let i = 0; i < cubes.length; i++) {
            if (cubes[i] === intersects[0].object) {

                cubes[i].scale.x = 0.5
                cubes[i].scale.y = 0.5
                cubes[i].scale.z = 0.5
                
            }
        }    
    }
}




// animation function
let animate = () => {
    requestAnimationFrame( animate )

    // update orbit camera
    OrbitControls_1.update()

    // rotate all cubes
    cubes.forEach(cube => {
        cube.rotation.y -= 0.01
        cube.rotation.z += 0.01
        cube.rotation.x += 0.01

    })

    // renderer.render( scene, camera )
    composer.render()

}


// execute functions
init()
CreateGUI()
animate()