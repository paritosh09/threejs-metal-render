import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { reduce } from 'async'
import { sRGBEncoding } from 'three'
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
// import { FlakesTexture } from './js/FlakesTexture.js';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const gui = new dat.GUI()
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 2, 1000)
camera.position.set(0, 0, 900)
scene.add(camera)
//light1
// const pointLight = new THREE.PointLight(0xffffff, 2)
// pointLight.position.set(200, 200, 200);
// scene.add(pointLight)
//light2
// const pointLight2 = new THREE.PointLight(0xff0000, 2)
// pointLight2.position.set(-0.57, 1, 0.64)
// pointLight2.intensity = 10
// scene.add(pointLight2)
// const light1 = gui.addFolder('Light1')

// light1.add(pointLight2.position, 'y').min(-3).max(3).step(0.01)
// light1.add(pointLight2.position, 'x').min(-6).max(6).step(0.01)
// light1.add(pointLight2.position, 'z').min(-3).max(3).step(0.01)
// light1.add(pointLight2, 'intensity').min(0).max(10).step(0.01)
// // light3
// const pointLight3 = new THREE.PointLight(0xff0000, 2)
// pointLight3.position.set(2.14, -3, -1.98)
// pointLight3.intensity = 10
// scene.add(pointLight3)

// const light2 = gui.addFolder('Light2')

// light2.add(pointLight3.position, 'y').min(-3).max(3).step(0.01)
// light2.add(pointLight3.position, 'x').min(-6).max(6).step(0.01)
// light2.add(pointLight3.position, 'z').min(-3).max(3).step(0.01)
// light2.add(pointLight3, 'intensity').min(0).max(10).step(0.01)
//light2
// const directionalLight = new THREE.DirectionalLight(  0xff0000, 50);
// directionalLight.position.x += 20
// directionalLight.position.y += 20
// directionalLight.position.z += 20
// scene.add(directionalLight);


const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha:true,
    antialias:true
})

document.body.appendChild(renderer.domElement)

const controls=new OrbitControls(camera ,renderer.domElement)
renderer.outputEncoding= THREE.sRGBEncoding;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.25;
const envmaploader= new THREE.PMREMGenerator(renderer)
animate();

new RGBELoader().setPath('textures/').load('fireplace_4k.hdr',function (hrdmap){
 let envmap= envmaploader.fromCubemap(hrdmap)
 const loader = new THREE.TextureLoader();
 let texture=loader.load('textures/shine.jpg')
    // let texture= new THREE.CanvasTexture(new FlakesTexture())
    texture.wrapS=THREE.RepeatWrapping;
    texture.wrapT=THREE.RepeatWrapping;
    texture.repeat.x=10;
    texture.repeat.y=6;

    const matProperties={
        metalness: 1,
        roughness: 0.1,
        color: 0x8418bc,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        // normalMap: texture,
        normalScale: new THREE.Vector2(0.15,0.15),
        envMap: envmap.texture
	 
     };

    
const geometry = new THREE.SphereGeometry( 150,.5, 100, 100 );
const material = new THREE.MeshPhysicalMaterial(matProperties)
const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)
})

//svgloader
const renderSVG = (extrusion, svg) => {
	const loader = new SVGLoader();
	const svgData = loader.parse('textures/002.svg');
  
	// ...
  };
  
  export { renderSVG };
// const loader = new SVGLoader();
// loader.load('textures/002.svg', function ( data ) {
 
// 		const paths = data.paths;
// 		const group = new THREE.Group();

// 		for ( let i = 0; i < paths.length; i ++ ) {

// 			const path = paths[ i ];

// 			const material = new THREE.MeshBasicMaterial( {
// 				color: path.color,
// 				side: THREE.DoubleSide,
// 				depthWrite: false
// 			} );

// 			const shapes = SVGLoader.createShapes( path );

// 			for ( let j = 0; j < shapes.length; j ++ ) {

// 				const shape = shapes[ j ];
// 				const geometry = new THREE.ShapeGeometry( shape );
// 				const mesh = new THREE.Mesh( geometry, material );
// 				group.add( mesh );

// 			}

// 		}

// 		scene.add( group );
//     },
// );
//=================================================================================
/**
 * Sizes
 */


window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})

controls.autoRotate = true;
controls.autoRotateSpeed = 1;
controls.enableDamping = true;

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

function animate(){

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
