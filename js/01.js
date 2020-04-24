
// 01 creating a textured box
// use npm http-server -c-1 to run the server with cache disabled

// scene camera renderer
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
let renderer = new THREE.WebGLRenderer();
let mouse = {x: 0, y: 0}
let rayCast

// set renderer to window size and appened to <body>
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

// cube geometry
let geometry = new THREE.BoxGeometry()

// basic color material
let material = new THREE.MeshPhongMaterial( { color: 0xffffff } )

// texture material
let texLoader = new THREE.TextureLoader()

let woodTex = texLoader.load("./texture/container.jpg")

let woodMaterial = new THREE.MeshPhongMaterial({
    map: woodTex,
    color: 0xffffff
})




// array of cubes
let cubes = []


// create cube and push into the array
for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
        var cube = new THREE.Mesh( geometry, woodMaterial )
        cube.scale.set(1,1,1)
        cube.position.set(i * 2 - 4, j * 2 - 4, 0)
        cubes.push(cube)
        
    }
}

// add all elements from the array to the scene
cubes.forEach(cube => {
    scene.add( cube )
})




// light
let AmbientLight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(AmbientLight)

let PointLight = new THREE.PointLight(0xff00ff, 2, 5, 1)
PointLight.position.set(1, 0, 2)
scene.add(PointLight)

let PointLight2 = new THREE.PointLight(0x00ff22, 2, 5, 1)
PointLight2.position.set(-1, 0, 2)
scene.add(PointLight2)




// set camera position
camera.position.z = 10

// on click event
document.addEventListener("mousedown", onMousedown, false)
let ray = new THREE.Raycaster()


function onMousedown(event) {
    console.log("mouse clicked");
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = 1 - (event.clientY / window.innerHeight) * 2
    

    console.log(mouse.x)
    console.log(mouse.y)

    
    ray.setFromCamera(mouse,camera)
    
    let intersects = ray.intersectObjects(cubes, true)
    console.log(intersects)

    if (intersects.length > 0) {
        for (let i = 0; i < cubes.length; i++) {
            if (cubes[i] === intersects[0].object) {
                cubes[i].scale.x = 0.1
                
            }
        }    
    }
}







// animation function
let animate = () => {
    requestAnimationFrame( animate )

    // rotate all cubes
    cubes.forEach(cube => {
        cube.rotation.y += 0.01
    })

    renderer.render( scene, camera )
}


// execute functions
animate()