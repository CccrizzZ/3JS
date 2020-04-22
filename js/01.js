
// 01 creating a textured box
// use npm http-server -c-1 to run the server with cache disabled

// scene camera renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();


// set renderer to window size and appened to <body>
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

// cube geometry
var geometry = new THREE.BoxGeometry()

// basic color material
var material = new THREE.MeshPhongMaterial( { color: 0xffffff } )

// texture material
let texLoader = new THREE.TextureLoader()

let woodTex = texLoader.load("./texture/container.jpg")

var woodMaterial = new THREE.MeshPhongMaterial({
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


// animation function
var animate = () => {
    requestAnimationFrame( animate )

    // rotate all cubes
    cubes.forEach(cube => {
        cube.rotation.y += 0.01
    })

    renderer.render( scene, camera )
}


// execute animation
animate()