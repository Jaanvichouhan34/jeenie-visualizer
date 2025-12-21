import React, { useLayoutEffect, useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useGraph, useFrame } from '@react-three/fiber' // useGraph comes from fiber
import { useGLTF, Html } from '@react-three/drei' 
import { SkeletonUtils } from 'three-stdlib'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function Model({ accentColor, ...props }) {
  const group = useRef()
  const headRef = useRef()
  const eyeMaterialRef = useRef()

  const { scene } = useGLTF('/robot-transformed.glb')
  
  // 1. Safe Clone Logic
  const clone = useMemo(() => (scene ? SkeletonUtils.clone(scene) : null), [scene])
  const { nodes, materials } = useGraph(clone || new THREE.Group())

  // 2. Capture Refs safely
  useLayoutEffect(() => {
    if (nodes?.Object_365) headRef.current = nodes.Object_365
    if (nodes?.Object_364) eyeMaterialRef.current = nodes.Object_364.material
  }, [nodes])

  // 3. Material Cleanup: Keep skin original, glow subtle
  useLayoutEffect(() => {
    if (!materials) return
    Object.values(materials).forEach((mat) => {
      if (mat?.name?.includes('EmberRae')) {
        mat.color.set('#ffffff') // Resets to original texture color
        
        if (accentColor === '#6d4c41') {
          mat.emissive.set('#000000') // Turn off neon glow
          mat.emissiveIntensity = 0 
        } else {
          mat.emissive.set(accentColor)
          mat.emissiveIntensity = 0.05 // Very subtle glow for high-end look
        }
      }
    })
  }, [accentColor, materials])

  // 4. Animation: Pulse + Head Tracking
  useFrame((state) => {
    if (eyeMaterialRef.current) {
      const time = state.clock.getElapsedTime()
      eyeMaterialRef.current.emissiveIntensity = 0.5 + Math.abs(Math.sin(time * 2)) * 1.5
      eyeMaterialRef.current.emissive.set(accentColor)
    }

    if (headRef.current) {
      const { x, y } = state.mouse
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, x * 0.4, 0.1)
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -y * 0.4, 0.1)
    }
  })

  // 5. Scroll Explosion
 // 7. Scroll Explosion Logic
  useLayoutEffect(() => {
    // 1. Safety check: Don't run if the model isn't loaded yet
    if (!nodes?.Object_363) return 

    // 2. Setup the GSAP timeline linked to the scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".main-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
      }
    })

    // 3. FADE OUT only the first text (SCROLL TO EXPLODE)
    // Note: Make sure your first h1 in App.jsx has className="intro-text"
    tl.to(".intro-text", { opacity: 0, y: -100, duration: 1 }, 0) 

    // 4. EXPLODE the robot parts
    tl.to(nodes.Object_363.position, { x: 4, z: 2 }, 0) 
    tl.to(nodes.Object_365.position, { y: 8 }, 0)       
    tl.to(nodes.Object_364.position, { y: 8, z: 1 }, 0) 
    tl.to(nodes.Object_366.position, { y: 12, z: -1 }, 0) 

    // 5. Cleanup when the component unmounts
return () => { 
      if (tl.scrollTrigger) tl.scrollTrigger.kill() 
    }
  }, [nodes])
  if (!clone || !nodes?.Object_363) return null

  return (
    <group ref={group} {...props} dispose={null}
    position={[0, -0.8, 0]}
    scale={1.1}>
      <primitive object={nodes._rootJoint} />
      
      {/* Robot Components */}
      <skinnedMesh name="Body" geometry={nodes.Object_363.geometry} material={materials.F_MED_EmberRae_Body_5abe865} skeleton={nodes.Object_363.skeleton} rotation={[-Math.PI / 2, 0, 0]} />
      <skinnedMesh name="Eyes" geometry={nodes.Object_364.geometry} material={materials.F_MED_EmberRae_eyes_745fbd62} skeleton={nodes.Object_364.skeleton} rotation={[-Math.PI / 2, 0, 0]} />
      <skinnedMesh name="Head" geometry={nodes.Object_365.geometry} material={materials.F_MED_EmberRae_Head_5c765ff0} skeleton={nodes.Object_365.skeleton} rotation={[-Math.PI / 2, 0, 0]} />
      <skinnedMesh name="Hair" geometry={nodes.Object_366.geometry} material={materials.F_MED_EmberRae_FaceAcc_4b6d9e31} skeleton={nodes.Object_366.skeleton} />

      {/* Hotspots */}
      <mesh position={[0.5, 1.5, 0.2]}> 
        <Html distanceFactor={10}>
          <div className="hotspot" style={{ background: accentColor }}>+</div>
          <div className="hotspot-label">REINFORCED ARMOR</div>
        </Html>
      </mesh>
      <mesh position={[0, 2.3, 0.3]}> 
        <Html distanceFactor={10}>
          <div className="hotspot" style={{ background: accentColor }}>+</div>
          <div className="hotspot-label">VIRTUAL OS v1.0</div>
        </Html>
      </mesh>
    </group>
  )
}

useGLTF.preload('/robot-transformed.glb')