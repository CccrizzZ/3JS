import * as THREE from '../node_modules/three/build/three.module.js'
import {OrbitControls} from '../node_modules/three/examples/jsm/controls/OrbitControls.js'
import {Sky} from '../node_modules/three/examples/jsm/objects/Sky.js'


// 01 creating a textured box
// use npm http-server -c-1 to run the server with cache disabled


// scene camera renderer
let scene
let camera 
let renderer

// array of cubes
let cubes = []

// cube components
let geometry
let material 
let texLoader
let woodTex
let woodMaterial

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

let init = () => {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 )
    renderer = new THREE.WebGLRenderer()
    
    // set renderer to window size and appened to <body>
    renderer.setSize( window.innerWidth, window.innerHeight )
    document.body.appendChild( renderer.domElement )
   

    

    

    // Skybox
    sunSphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry(20000, 16, 8),
        new THREE.MeshBasicMaterial({color: 0xffffff})
    )
    sunSphere.position.set( 0 ,60000, -1000)
    sunSphere.visible = true;
    scene.add(sunSphere)

    sky = new Sky()
    sky.scale.setScalar(500)
    let uniforms = sky.material.uniforms
    console.log(sky);
    
    uniforms["turbidity"].value = 5
    uniforms["rayleigh"].value = 0.3
    uniforms["mieCoefficient"].value = 0.005
    uniforms["mieDirectionalG"].value = 0.35
    uniforms["luminance"].value = 0.1
    uniforms[ "sunPosition" ].value.copy( sunSphere.position )
    scene.add(sky)
    
        
    

        






    // texture material
    texLoader = new THREE.TextureLoader()
    
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
    FloorNormalTex = new texLoader.load("../asset/marble/marble-normal.jpg")

    FloorMaterial = new THREE. MeshPhongMaterial({
        map: FloorDiffuseTex,
        normalMap: FloorNormalTex,
        color: 0xffffff
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
    AmbientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(AmbientLight)


    // PointLight = new THREE.PointLight(0xff00ff, 2, 5, 1)
    // PointLight.position.set(1, 0, 2)
    // scene.add(PointLight)

    // PointLight2 = new THREE.PointLight(0x00ff22, 2, 5, 1)
    // PointLight2.position.set(-1, 0, 2)
    // scene.add(PointLight2)

    SpotLight = new THREE.SpotLight(0xffffff, 1)
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

    renderer.render( scene, camera )
}


// execute functions
init()
animate()