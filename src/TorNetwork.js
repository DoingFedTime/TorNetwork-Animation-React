import React, { useState, useEffect, useRef } from 'react';
import { Layers, Shield, Server, User, Globe, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';

const TorNetworkAnimation = () => {
  const [animationStep, setAnimationStep] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const canvasRef = useRef(null);

  // Animation state for data packets
  const [dataPackets, setDataPackets] = useState([
    { id: 1, x: 100, y: 250, color: '#00ff66', size: 8, visible: false },
    { id: 2, x: 250, y: 250, color: '#00aaff', size: 6, visible: false },
    { id: 3, x: 400, y: 250, color: '#aa77ff', size: 5, visible: false },
    { id: 4, x: 550, y: 250, color: '#ff55aa', size: 4, visible: false }
  ]);

  // Matrix rain effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Characters for matrix rain
    const chars = '01';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    
    // Drops array for each column
    const drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -100);
    }
    
    const drawMatrix = () => {
      // Semi-transparent black for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#00ff66';
      ctx.font = `${fontSize}px monospace`;
      
      // Drawing the characters
      for (let i = 0; i < drops.length; i++) {
        // Random character from chars array
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        // Reset at random after crossing screen and set opacity based on randomness
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Increment y coordinate
        drops[i]++;
      }
    };
    
    const matrixInterval = setInterval(drawMatrix, 50);
    
    return () => clearInterval(matrixInterval);
  }, []);

  // Progress the animation step
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationStep((prev) => (prev + 1) % 10);
    }, 8000); // Increased from 4000ms to 8000ms for a slower animation
    
    return () => clearTimeout(timer);
  }, [animationStep]);

  // Animate data packets
  useEffect(() => {
    const packetTimer = setInterval(() => {
      setDataPackets(prevPackets => {
        const newPackets = [...prevPackets];
        
        // Update packet visibility based on animation step
        if (animationStep >= 1) {
          newPackets[0].visible = true;
        }
        if (animationStep >= 3) {
          newPackets[1].visible = true;
        }
        if (animationStep >= 5) {
          newPackets[2].visible = true;
        }
        if (animationStep >= 7) {
          newPackets[3].visible = true;
        }
        
        // Animate packet positions
        for (let packet of newPackets) {
          if (packet.visible) {
            if (packet.id === 1 && packet.x < 250) {
              packet.x += 2;
            } else if (packet.id === 2 && packet.x < 400) {
              packet.x += 2;
            } else if (packet.id === 3 && packet.x < 550) {
              packet.x += 2;
            } else if (packet.id === 4 && packet.x < 700) {
              packet.x += 2;
            }
            
            // Reset packets for looping animation
            if (packet.id === 4 && packet.x >= 700) {
              for (let p of newPackets) {
                p.x = 100 + (p.id - 1) * 150;
                p.visible = false;
              }
            }
          }
        }
        
        return newPackets;
      });
    }, 50);
    
    return () => clearInterval(packetTimer);
  }, [animationStep]);

  // Nodes in the Tor network
  const nodes = [
    { id: 'user', name: 'USER', icon: <User size={24} />, x: 100, y: 250, color: '#00aaff', active: animationStep >= 0 },
    { id: 'guard', name: 'GUARD NODE', icon: <Shield size={24} />, x: 250, y: 250, color: '#00ff66', active: animationStep >= 2 },
    { id: 'middle', name: 'MIDDLE NODE', icon: <Layers size={24} />, x: 400, y: 250, color: '#aa77ff', active: animationStep >= 4 },
    { id: 'exit', name: 'EXIT NODE', icon: <Server size={24} />, x: 550, y: 250, color: '#ff55aa', active: animationStep >= 6 },
    { id: 'destination', name: 'DESTINATION', icon: <Globe size={24} />, x: 700, y: 250, color: '#ffffff', active: animationStep >= 8 }
  ];

  // Make all connections more visible
  const connections = [
    { id: 'c1', from: 'user', to: 'guard', active: animationStep >= 0, color: '#00ff66' },
    { id: 'c2', from: 'guard', to: 'middle', active: animationStep >= 2, color: '#aa77ff' },
    { id: 'c3', from: 'middle', to: 'exit', active: animationStep >= 4, color: '#ff55aa' },
    { id: 'c4', from: 'exit', to: 'destination', active: animationStep >= 6, color: '#ffffff' }
  ];

  // Node explanation panels
  const nodeExplanations = [
    {
      id: 'user',
      title: 'USER',
      icon: <User size={18} />,
      content: 'The User initiates the Tor connection, encrypting data to access the internet anonymously through relays. Their identity is protected by the Guard Node, hidden from the destination.',
      active: animationStep === 0 || animationStep === 1,
      color: '#00aaff'
    },
    {
      id: 'guard',
      title: 'GUARD NODE',
      icon: <Shield size={18} />,
      content: 'The Guard Node, the first relay, knows the User\'s identity but not their destination, ensuring privacy. It forwards encrypted data to the Middle Node, shielding the entry point.',
      active: animationStep === 2 || animationStep === 3,
      color: '#00ff66'
    },
    {
      id: 'middle',
      title: 'MIDDLE NODE',
      icon: <Layers size={18} />,
      content: 'The Middle Node relays encrypted data between nodes, knowing neither the User\'s identity nor the destination. It maintains anonymity by adding separation in the circuit.',
      active: animationStep === 4 || animationStep === 5,
      color: '#aa77ff'
    },
    {
      id: 'exit',
      title: 'EXIT NODE',
      icon: <Server size={18} />,
      content: 'The Exit Node decrypts the final data layer and sends it to the Destination, knowing the destination but not the User. It can monitor unencrypted traffic, so HTTPS is recommended.',
      active: animationStep === 6 || animationStep === 7,
      color: '#ff55aa'
    },
    {
      id: 'destination',
      title: 'DESTINATION',
      icon: <Globe size={18} />,
      content: 'The Destination is the target server, receiving data from the Exit Node without knowing the User\'s identity or Tor path. It interacts normally, unaware of the anonymity network.',
      active: animationStep === 8,
      color: '#ffffff'
    }
  ];

  // Find node coordinates by id
  const getNodeById = (id) => nodes.find(node => node.id === id);

  // Draw connection line between nodes
  const getConnectionPath = (fromId, toId) => {
    const fromNode = getNodeById(fromId);
    const toNode = getNodeById(toId);
    
    if (!fromNode || !toNode) return '';
    
    return `M${fromNode.x},${fromNode.y} L${toNode.x},${toNode.y}`;
  };

  return (
    <div className="relative bg-gray-900 w-full h-screen overflow-hidden text-gray-200">
      {/* Matrix Rain Background */}
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full opacity-20 z-0" />
      
      {/* Main Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
        {/* Title */}
        <h1 className="text-4xl font-bold text-green-400 mb-8 tracking-widest animate-pulse">THE TOR NETWORK</h1>
        
        {/* Network Diagram */}
        <div className="relative w-full max-w-4xl h-96 mb-8">
          {/* Connection Paths */}
          <svg className="absolute top-0 left-0 w-full h-full">
            {connections.map(conn => (
              <path
                key={conn.id}
                d={getConnectionPath(conn.from, conn.to)}
                stroke={conn.color}
                strokeWidth={conn.active ? 3 : 1}
                strokeDasharray={conn.active ? "none" : "5,5"}
                opacity={conn.active ? 0.8 : 0.3}
                fill="none"
                className={`transition-all duration-500 ${conn.active ? 'animate-pulse' : ''}`}
              />
            ))}
          </svg>
          
          {/* Network Nodes */}
          {nodes.map(node => (
            <div
              key={node.id}
              className={`absolute w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all duration-500 transform ${node.active ? 'scale-110 animate-pulse' : 'scale-100 opacity-50'}`}
              style={{
                left: node.x - 40,
                top: node.y - 40,
                backgroundColor: '#111',
                border: `2px solid ${node.color}`,
                boxShadow: node.active ? `0 0 15px ${node.color}` : 'none'
              }}
            >
              <div className="text-center">
                <div className={`mb-1 ${node.active ? `text-${node.color.substring(1)}` : 'text-gray-400'}`}>
                  {node.icon}
                </div>
                <div className="text-xs font-bold">{node.name}</div>
              </div>
            </div>
          ))}
          
          {/* Data Packets */}
          {dataPackets.map(packet => (
            packet.visible && (
              <div
                key={packet.id}
                className="absolute rounded-full animate-pulse"
                style={{
                  left: packet.x - packet.size / 2,
                  top: packet.y - packet.size / 2,
                  width: packet.size,
                  height: packet.size,
                  backgroundColor: packet.color,
                  boxShadow: `0 0 10px ${packet.color}`,
                  transition: 'left 0.05s linear'
                }}
              />
            )
          ))}
        </div>
        
        {/* Node Explanation Panels */}
        <div className="w-full max-w-4xl mt-8">
          {nodeExplanations.map(panel => (
            <div
              key={panel.id}
              className={`bg-gray-900 bg-opacity-90 border rounded p-4 mb-4 transition-opacity duration-1000 absolute left-0 right-0 ${panel.active ? 'opacity-100' : 'opacity-0'}`}
              style={{ 
                borderColor: panel.color, 
                boxShadow: panel.active ? `0 0 10px ${panel.color}` : 'none',
                top: 'auto',
                bottom: '120px'
              }}
            >
              <div className="flex items-center mb-2">
                <div className="mr-2" style={{color: panel.color}}>{panel.icon}</div>
                <h3 className="text-sm font-bold" style={{color: panel.color}}>{panel.title}</h3>
              </div>
              <p className="text-xs text-gray-300">{panel.content}</p>
            </div>
          ))}
        </div>
        
                  {/* Encryption Visualization */}
        <div className="mt-8 relative w-32 h-32">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-green-400 animate-spin" style={{ animationDuration: '20s' }}></div>
          <div className="absolute inset-4 rounded-full border-2 border-dashed border-purple-400 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
          <div className="absolute inset-8 rounded-full border-2 border-dashed border-pink-400 animate-spin" style={{ animationDuration: '10s' }}></div>
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <div className="text-xs font-bold text-white">DATA</div>
          </div>
        </div>
        
        {/* Technical Details Toggle */}
        <button
          className="mt-8 bg-gray-800 hover:bg-gray-700 text-green-400 px-4 py-2 rounded text-sm font-bold"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'HIDE TECHNICAL DETAILS' : 'SHOW TECHNICAL DETAILS'}
        </button>
        
        {/* Technical Details Panel */}
        {showDetails && (
          <div className="mt-4 w-full max-w-4xl bg-black bg-opacity-70 p-4 rounded border border-green-900 text-xs">
            <h3 className="text-green-400 font-bold mb-2">TOR TECHNICAL SPECIFICATIONS</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="text-green-400">Directory Authorities:</span> 9 trusted servers that maintain the list of all relays.</li>
              <li><span className="text-green-400">Guard Node Selection:</span> First relay is chosen from a small set of stable nodes for 2-3 months.</li>
              <li><span className="text-green-400">Onion Routing:</span> Each relay only decrypts one layer, revealing instructions to the next hop.</li>
              <li><span className="text-green-400">Perfect Forward Secrecy:</span> New circuits are created every 10 minutes.</li>
              <li><span className="text-green-400">Encryption:</span> AES-128 symmetric encryption for data, RSA-1024 and curve25519 for key negotiation.</li>
              <li><span className="text-green-400">Traffic Analysis Defense:</span> Traffic padding and timing obfuscation techniques prevent correlation attacks.</li>
            </ul>
          </div>
        )}
      </div>
      
      {/* Cyberpunk Decorative Elements */}
      <div className="absolute top-5 left-5 text-xs text-green-500 opacity-60">STATUS: SECURE</div>
      <div className="absolute top-5 right-5 text-xs text-green-500 opacity-60">RELAYS: 6000+</div>
      <div className="absolute bottom-5 left-5 text-xs text-green-500 opacity-60">ENCRYPTION: ACTIVE</div>
      <div className="absolute bottom-5 right-5 text-xs text-green-500 opacity-60">LOCATION: MASKED</div>
    </div>
  );
};

export default TorNetworkAnimation;