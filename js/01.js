// 01 creating a textured box
// use npm http-server -c-1 to run the server with cache disabled

// const OrbitControls = require('three-orbit-controls')(THREE);


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
let FloorTex
let FloorMaterial
let Floor
// lights
let AmbientLight
let PointLight
let PointLight2 
// raycast
let mouse = {x: 0, y: 0}
let ray
let rayCast

let OrbitControls_1

let init = () => {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 )
    renderer = new THREE.WebGLRenderer()
    
    // set renderer to window size and appened to <body>
    renderer.setSize( window.innerWidth, window.innerHeight )
    document.body.appendChild( renderer.domElement )
   
    // texture material
    texLoader = new THREE.TextureLoader()
    





    // cube geometry
    geometry = new THREE.BoxGeometry()

    // basic color material
    material = new THREE.MeshPhongMaterial( { color: 0xffffff } )


    // texture from pictures
    woodTex = texLoader.load("./texture/bw.jpg")
    
    // material from texture loaded from jpg
    woodMaterial = new THREE.MeshPhongMaterial({
        map: woodTex,
        color: 0x009900
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










    FloorGeometry = new THREE.BoxGeometry()
    FloorTex = new texLoader.load("./texture/grass.jpg")
    FloorMaterial = new THREE.MeshLambertMaterial({
        map: FloorTex,
        color: 0xffffff
    })
    Floor = new THREE.Mesh(FloorGeometry, FloorMaterial)
    Floor.scale.set(10,1,10)
    Floor.position.set(0,-5,0)

    scene.add(Floor)


    // set camera position
    camera.position.z = 5

    OrbitControls_1 = new THREE.OrbitControls(camera, renderer.domElement)
    OrbitControls_1.enableZoom = true;

    // Lights
    AmbientLight = new THREE.AmbientLight(0xff8888, 0.4)
    scene.add(AmbientLight)

    // PointLight = new THREE.PointLight(0xff00ff, 2, 5, 1)
    // PointLight.position.set(1, 0, 2)
    // scene.add(PointLight)

    // PointLight2 = new THREE.PointLight(0x00ff22, 2, 5, 1)
    // PointLight2.position.set(-1, 0, 2)
    // scene.add(PointLight2)

    PointLight3 = new THREE.PointLight(0xffffff, 2, 5, 1)
    PointLight3.position.set(0, -2, 0)
    scene.add(PointLight3)

    PointLight4 = new THREE.PointLight(0xffffff, 2, 5, 1)
    PointLight4.position.set(0, 0, 2)
    scene.add(PointLight4)

    PointLight5 = new THREE.PointLight(0xff0000, 2, 5, 1)
    PointLight5.position.set(0, -1, 5)
    scene.add(PointLight5)

    
    // add on click event listener
    document.addEventListener("mousedown", onMousedown, false)

    // raycaster for click
    ray = new THREE.Raycaster()



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
    // OrbitControl_1.update()

    // rotate all cubes
    cubes.forEach(cube => {
        cube.rotation.y += 0.01
    })

    renderer.render( scene, camera )
}


// execute functions
init()
animate()