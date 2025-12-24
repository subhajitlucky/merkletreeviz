# Merkle Tree Visualizer

An interactive educational microsite for learning about Merkle Trees and data integrity.

## Features
- **Interactive Playground**: Add, remove, and edit data items to see how the Merkle Tree reacts in real-time.
- **Proof Generation**: Visualize the "Merkle Proof" path for any data item.
- **Tamper Detection**: Instantly see how a tiny data change propagates to the root.
- **Guided Learning**: Step-by-step path through core concepts.

## How to Run
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`

## Technical Details
- **Framework**: React 19 + TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Hashing**: SHA-256 (via Web Crypto API)

## Integrity Guarantees
Merkle Trees provide efficient and secure verification of large data structures. By hashing data into a tree structure, any change in a leaf node causes a cascade of hash changes up to the root. This allows for:
1. **Tamper Evidence**: The Root hash changes if any data is modified.
2. **Efficient Proofs**: Verify existence of data with only $O(\log N)$ hashes.