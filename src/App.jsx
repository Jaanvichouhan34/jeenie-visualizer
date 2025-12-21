import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Center, Environment, ContactShadows } from '@react-three/drei'
import { Model } from './components/canvas/Robot' 
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'

function App() {
  const [accentColor, setAccentColor] = useState('#00f2ff')

  return (
    <div className="main-container" style={{ backgroundColor: '#000', minHeight: '400vh' }}>
      
      {/* 1. HUD / HEADER - Branding Jeenie */}
      <div className="hud-container" style={{
        position: 'fixed', top: '20px', left: '20px', zIndex: 100,
        width: '300px', padding: '20px', background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '15px', color: 'white', pointerEvents: 'auto'
      }}>
        <h2 style={{ color: accentColor, letterSpacing: '2px', margin: 0 }}>JEENIE OS_v1.0</h2>
        <p style={{ fontSize: '12px', opacity: 0.7 }}>STATUS: <span style={{ color: '#00ff88' }}>OPERATIONAL</span></p>
        <hr style={{ border: '0.5px solid rgba(255,255,255,0.1)', margin: '15px 0' }} />
        
        <p style={{ fontSize: '12px', marginBottom: '10px' }}>SELECT ACCENT:</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['#6d4c41', '#00f2ff', '#ff0077', '#ffff00'].map((color) => (
            <button
              key={color}
              onClick={() => setAccentColor(color)}
              style={{
                width: '25px', height: '25px', borderRadius: '50%', background: color,
                border: accentColor === color ? '2px solid white' : 'none', cursor: 'pointer'
              }}
            />
          ))}
        </div>
      </div>

      {/* 2. FLOATING SOCIAL FOOTER - Jaanvi's Links */}
      <div style={{
        position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', zIndex: 100,
        display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(0,0,0,0.6)',
        padding: '12px 24px', borderRadius: '40px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <span style={{ color: 'white', opacity: 0.6, fontSize: '0.85rem' }}>Jaanvi Chouhan</span>
        <a href="https://github.com/Jaanvichouhan34" target="_blank" rel="noreferrer" style={{ color: accentColor, textDecoration: 'none', fontSize: '0.9rem' }}>GitHub</a>
        <a href="https://www.linkedin.com/in/jaanvi-chouhan" target="_blank" rel="noreferrer" style={{ color: accentColor, textDecoration: 'none', fontSize: '0.9rem' }}>LinkedIn</a>
        <a href="https://www.instagram.com/jaanvi_chouhan18" target="_blank" rel="noreferrer" style={{ color: accentColor, textDecoration: 'none', fontSize: '0.9rem' }}>Instagram</a>
      </div>

      {/* 3. 3D CANVAS - Sticky Container */}
      <div style={{ position: 'sticky', top: 0, width: '100vw', height: '100vh', overflow: 'hidden', zIndex: 1 }}>
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
          <color attach="background" args={['#111']} />
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <ambientLight intensity={1.5} />
          <spotLight position={[-5, 5, -5]} intensity={2} color={accentColor} angle={0.3} />
          
          <Suspense fallback={null}>
            <Environment preset="city" />
            <Center>
              <Model accentColor={accentColor} />
            </Center>
            <ContactShadows opacity={0.4} scale={10} blur={2} far={4.5} />
          </Suspense>

          <EffectComposer>
            <Bloom intensity={0.3} luminanceThreshold={0.8} mipmapBlur />
            <Noise opacity={0.05} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      {/* 4. SCROLL SECTIONS */}
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
         <h1 className="intro-text" style={{ color: 'white', fontSize: '6vw', textShadow: '0 0 20px rgba(0,0,0,1)', textAlign: 'center' }}>
           SCROLL TO EXPLODE
         </h1>
      </div>

      <div style={{ height: '200vh' }} /> 

      <div style={{ 
        height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
        position: 'relative', zIndex: 20, background: '#000', marginTop: '-10vh'
      }}>
         <h1 style={{ color: accentColor, fontSize: '6vw', textShadow: `0 0 30px ${accentColor}55`, margin: 0 }}>
            JEENIE DECONSTRUCTED
         </h1>
         <p style={{ color: 'white', opacity: 0.8, fontSize: '1.2rem', marginTop: '20px' }}>
            System Status: 100% Operational
         </p>
      </div>

    </div>
  )
}

export default App