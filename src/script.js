// @ts-check
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import * as dat from 'dat.gui'
import GUI from 'tweakpane';

//Safety wrapper
let json = [
    {
        name: 'C',
        uid: '1111',
        targets: ['1112', '1113', '1114', '1115'],
        color: 0xff0000,
        radius: 0.1,
        position: [0, 0, 0]
    },
    {
        name: 'H',
        uid: '1112',
        targets: ['1111'],
        color: 0xff0000,
        radius: 0.1,
        position: [0, 0.5, 1.5]
    },
    {
        name: 'H',
        uid: '1113',
        targets: ['1111'],
        color: 0xff0000,
        radius: 0.1,
        position: [0, 1, 0]
    },
    {
        name: 'H',
        uid: '1114',
        targets: ['1111'],
        color: 0xff0000,
        radius: 0.1,
        position: [1, 0, 0]
    },
    {
        name: 'H',
        uid: '1115',
        targets: ['1111'],
        color: 0xff0000,
        radius: 0.1,
        position: [1, 0, 1]
    }
];

(() => {

    const mode = {
        light: {
            "--tp-base-background-color": "hsla(230, 5%, 90%, 1.00)",
            "--tp-base-shadow-color": "hsla(0, 0%, 0%, 0.10)",
            "--tp-container-background-color-active": "hsla(230, 15%, 30%, 0.32)",
            "--tp-container-background-color-focus": "hsla(230, 15%, 30%, 0.28)",
            "--tp-container-background-color-hover": "hsla(230, 15%, 30%, 0.24)",
            "--tp-container-background-color": "hsla(230, 15%, 30%, 0.20)",
            "--tp-container-foreground-color": "hsla(230, 10%, 30%, 1.00)",
            "--tp-button-background-color-focus": "hsla(230, 7%, 65%, 1.00)",
            "--tp-button-background-color-hover": "hsla(230, 7%, 70%, 1.00)",
            "--tp-input-background-color-active": "hsla(230, 15%, 30%, 0.22)",
            "--tp-input-background-color-focus": "hsla(230, 15%, 30%, 0.18)",
            "--tp-input-background-color-hover": "hsla(230, 15%, 30%, 0.14)",
            "--tp-input-foreground-color": "hsla(230, 10%, 30%, 1.00)",
            "--tp-label-foreground-color": "hsla(230, 10%, 30%, 0.70)",
            "--tp-input-background-color": "hsla(230, 15%, 30%, 0.10)",
            "--tp-button-background-color": "hsla(230, 7%, 75%, 1.00)",
            "--tp-button-foreground-color": "hsla(230, 10%, 30%, 1.00)",
            "--tp-groove-foreground-color": "hsla(230, 15%, 30%, 0.10)",
            "--tp-monitor-background-color": "hsla(230, 15%, 30%, 0.10)",
            "--tp-monitor-foreground-color": "hsla(230, 10%, 30%, 0.50)",
            "--tp-button-background-color-active": "hsla(230, 7%, 60%, 1.00)"
        },
        dark: {
            "--tp-base-shadow-color": "hsla(0, 0%, 0%, 0.2)",
            "--tp-base-background-color": "hsla(0, 0%, 10%, 0.80)",
            "--tp-input-background-color": "hsla(0, 0%, 0%, 0.30)",
            "--tp-button-background-color": "hsla(0, 0%, 80%, 1.00)",
            "--tp-button-background-color-active": "hsla(0, 0%, 100%, 1.00)",
            "--tp-button-background-color-focus": "hsla(0, 0%, 95%, 1.00)",
            "--tp-button-background-color-hover": "hsla(0, 0%, 85%, 1.00)",
            "--tp-button-foreground-color": "hsla(0, 0%, 0%, 0.80)",
            "--tp-container-background-color": "hsla(0, 0%, 0%, 0.30)",
            "--tp-container-foreground-color": "hsla(0, 0%, 100%, 0.50)",
            "--tp-container-background-color-active": "hsla(0, 0%, 0%, 0.60)",
            "--tp-container-background-color-focus": "hsla(0, 0%, 0%, 0.50)",
            "--tp-container-background-color-hover": "hsla(0, 0%, 0%, 0.40)",
            "--tp-groove-foreground-color": "hsla(0, 0%, 0%, 0.20)",
            "--tp-input-background-color-active": "hsla(0, 0%, 0%, 0.60)",
            "--tp-input-background-color-focus": "hsla(0, 0%, 0%, 0.50)",
            "--tp-input-background-color-hover": "hsla(0, 0%, 0%, 0.40)",
            "--tp-input-foreground-color": "hsla(0, 0%, 100%, 0.50)",
            "--tp-label-foreground-color": "hsla(0, 0%, 100%, 0.50)",
            "--tp-monitor-background-color": "hsla(0, 0%, 0%, 0.30)",
            "--tp-monitor-foreground-color": "hsla(0, 0%, 100%, 0.30)"
        }
    }
    
    let canvas, scene, camera, root, control, renderer, geometry;

    // Debug
    let gui = new GUI({
        title: 'GUI',
        expanded: true,
    })
     
    // Sizes
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    };
    
    root = new THREE.Group()

    // Canvas
    canvas = document.querySelector('canvas.webgl')
    
    // Scene
    scene = new THREE.Scene()
    
    scene.add(root)

    
    // Lights
    const pointLight = new THREE.DirectionalLight(0x4287f5, 2)
    pointLight.position.x = 0
    pointLight.position.y = 0
    pointLight.position.z = 5
    scene.add(pointLight)
    
    const theme = {
        mode: "dark"
    }
    gui.addInput(theme, 'mode', {
        options:{
            dark: 'dark',
            light: "light"
        }
    }).on('change', (e) => {
        // @ts-ignore
        let doc = document.querySelector(":root").style;
        let theme = (e.value == "dark" ? mode.dark : mode.light)
        for (let mod in theme) {
            doc.setProperty(mod , theme[mod])
        }
    })
    gui.addInput(pointLight.position, 'x')
    gui.addInput(pointLight.position, 'y')
    gui.addInput(pointLight.position, 'z')
    
    // Camera
    camera = new THREE.PerspectiveCamera(500, sizes.width / sizes.height, 0.1, 100)
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 3
    scene.add(camera)
    
    // Renderer
    renderer = new THREE.WebGLRenderer({
        // @ts-ignore
        canvas: canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    control = new TrackballControls(camera, renderer.domElement)    
    
    let controls = new OrbitControls(camera, renderer.domElement)

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

    // const clock = new THREE.Clock()

    const animate = () =>
    {
             
        // const elapsedTime = clock.getElapsedTime()
        
        // Update objects
        //root.rotation.y = .5 * elapsedTime
        
        // Update Orbital Controls
        controls.update()
        
        // Render
        renderer.render(scene, camera)
        
        // Call animate again on the next frame
        window.requestAnimationFrame(animate)
        
    }
    

    animate()

    const addBond = (data1, data2) => {
        let distance = data1.distanceTo(data2)
        let geometry = new THREE.CylinderGeometry(0.05, 0.05, distance)
        let material = new THREE.MeshPhongMaterial({ color: new THREE.Color(0xffffff) })
        let obj = new THREE.Mesh(geometry, material)
        obj.rotateX(Math.PI / 2)
        let grp = new THREE.Group()
        grp.position.set((data1.x + data2.x) / 2, (data1.y + data2.y) / 2, (data1.z + data2.z) / 2)
        grp.add(obj)
        grp.lookAt(data2)
        root.add(grp)
    }

    const addSphere = (data) => {
        let geometry = new THREE.SphereGeometry(data.radius, 64, 64)
        let material = new THREE.MeshPhongMaterial({ color: new THREE.Color(data.color) })
        let obj = new THREE.Mesh(geometry, material)
        obj.position.set(data.position[0], data.position[1], data.position[2])
        root.add(obj)
    }

    const load = (data) => {
        if (!data) throw new Error('Data not found..!')
        data.forEach(e => {

            addSphere(e)
            let bond = data.find(m => {
                let index = m.targets.findIndex(a => a == e.uid)
                if (index === -1) {
                    console.log('test')
                    return false;
                }
                else {
                    m.targets.splice(index, 1)
                    console.log('done')
                    return true;
                }
            })
            if (bond) addBond(new THREE.Vector3(e.position[0], e.position[1], e.position[2]), new THREE.Vector3(bond.position[0], bond.position[1], bond.position[2]))

        });
    }

load(json)


})()