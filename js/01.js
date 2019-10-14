let scene, camera, renderer, cube;

// Init 
function init() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,                                           // FOV
        window.innerWidth / window.innerHeight,       // Aspect
        0.1,                                          // Near
        1000                                          // Far
    );

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias : true });

    // Set renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Attach to HTML
    document.body.appendChild(renderer.domElement);

    // Create a cube
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    // const material = new THREE.MeshBasicMaterial({color : 0x00ff00});
    // Texture
    const texture = new THREE.TextureLoader().load("texture/wood.gif");
    const material = new THREE.MeshBasicMaterial({map:texture});

    cube = new THREE.Mesh(geometry, material);

        

    // Add cube to scene
    scene.add(cube);

    // Set camera position
    camera.position.z = 5;
}


// Update animation
function animate() {
    requestAnimationFrame(animate);

    // Rotation of cube
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;



    renderer.render(scene, camera);
}


// When resizing window
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Listen to window resize
window.addEventListener('resize', onWindowResize, false);


// Init
init();

// Update animation
animate();