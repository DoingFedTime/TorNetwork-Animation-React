# Tor Network Animation

![Tor Network Animation](https://i.imgur.com/VYsmmE7.mp4)

A cyberpunk-styled interactive animation that visually explains how the Tor network provides anonymity online. 
Perfect for educational videos, presentations, or learning about Tor's architecture.

## 🧅 Overview

This React-based animation illustrates the core components of the Tor network:

- **User**: Initiates connection and encrypts data in multiple layers
- **Guard Node**: First relay; knows user identity but not destination
- **Middle Node**: Relay that knows neither user nor destination
- **Exit Node**: Final relay that connects to the destination
- **Destination**: Target server, unaware of the user's identity

The animation features a Matrix-inspired (of course) digital rain background and shows how data packets travel through the encrypted circuit.


## ⚙️ Installation

```bash
# Clone this repository
git clone https://github.com/DoingFedTime/tor-network-animation.git

# Navigate to the project directory
cd tor-network-animation

# Install dependencies
npm install

# Start the development server
npm start
```

## 💻 Usage

After starting the development server with `npm start`, the animation will open in your browser at [http://localhost:3000](http://localhost:3000).

### Key Features:

- **Animated Explanation**: Each node and its role is highlighted as data moves through the network
- **Technical Details**: Includes a section with technical specifications
- **Cyberpunk Aesthetic**: Matrix-style digital rain and neon highlights

## 🛠️ Technologies Used

- React
- Tailwind CSS
- Lucide Icons

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- The Tor Project for their ongoing work in privacy and anonymity
- Matrix digital rain effect inspired by the Matrix films

---

Created by [Sam Bent](https://sambent.com/social-media/) | [YouTube Channel](https://youtube.com/@Sam_Bent)