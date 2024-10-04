# Self-Driving Car Simulation

This project is a JavaScript-based simulation of a self-driving car using neural networks and machine learning techniques.

## Overview

The simulation creates a virtual environment where AI-controlled cars learn to navigate a road with traffic. The project uses a neural network to make driving decisions based on sensor inputs from the car's environment.

## Key Features

- Neural network-based decision making
- Realistic car physics simulation
- Traffic simulation with multiple cars
- Visualizer for neural network state
- Ability to save and load the best performing neural network

## File Structure

- `main.js`: The entry point of the application, handling the game loop and rendering
- `car.js`: Defines the Car class with physics and drawing logic
- `sensor.js`: Implements the car's sensor system
- `network.js`: Contains the neural network implementation
- `road.js`: Defines the road and its properties
- `controls.js`: Handles user input for manual control
- `utils.js`: Utility functions used across the project
- `visualizer.js`: Provides visualization for the neural network

## How It Works

1. Cars are spawned on a road with randomly generated traffic.
2. Each car uses sensors to detect its environment (road borders and other cars).
3. Sensor data is fed into a neural network, which outputs driving decisions.
4. Cars learn to navigate the road and avoid collisions through a process of natural selection and mutation.

## Usage

To run the simulation:

1. Clone the repository
2. Open `index.html` in a web browser
3. Use the "Save" button to store the best performing neural network
4. Use the "Discard" button to reset the saved neural network

## Future Improvements

- Implement more complex road layouts
- Add obstacles and varying traffic patterns
- Improve the learning algorithm for faster convergence
- Add a user interface for adjusting simulation parameters

## Contributing

Contributions to improve the simulation or add new features are welcome. Please feel free to submit pull requests or open issues for bugs and feature requests.

## License

This project is open source and available under the [MIT License](LICENSE).