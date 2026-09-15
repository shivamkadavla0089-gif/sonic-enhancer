# Clear Voice AI

SIH26052 — AI Speech Noise Cancellation System

Build a professional, modern frontend UI prototype for my Smart India Hackathon project.

Project Information

Project ID: SIH26052

Project title:
AI-Based Speech Noise Cancellation Using DCCRN

The system will take a noisy human speech audio file as input and use a trained DCCRN (Deep Complex Convolution Recurrent Network) model to generate enhanced/clean human speech.

The actual AI model will be implemented separately in Python using PyTorch. The final application will use Streamlit + Python for the user-facing application and a Python backend/API for DCCRN inference.

Therefore, this Lovable project should focus primarily on creating the frontend/UI/UX design and interaction flow. Do not implement a fake AI model or fake noise-cancellation processing.

Main User Flow

The final application should have this flow:

User opens the application.

User sees the SIH26052 AI Speech Noise Cancellation dashboard.

User uploads a noisy audio file.

Show the uploaded file name and audio player.

User clicks Enhance Speech.

Show a clear processing/loading state.

The frontend will later send the audio file to a Python/FastAPI backend.

Backend will process the audio using the trained DCCRN model.

Backend returns the enhanced/clean audio.

Show the enhanced audio player.

Provide a Download Clean Audio button.

Do not create fake processing results. Clearly structure the UI so the real Python backend/API can be connected later.

Design Requirements

Create a clean, professional, modern AI technology dashboard suitable for a Smart India Hackathon project presentation.

Design should look like a real working AI product, not a generic template.

Use:

Modern dark/light professional interface

Clean typography

Good spacing

Rounded cards

Subtle shadows

Professional AI/technology visual style

Responsive layout

Clear hierarchy

Accessible buttons and controls

Minimal unnecessary animations

No excessive gradients

No unnecessary decorative elements

The interface should be easy to understand during an SIH demonstration.

Main Dashboard

Create a landing/dashboard page containing:

Header

Display:

SIH26052

and:

AI Speech Noise Cancellation

Subtitle:

Enhance human speech by reducing unwanted background noise using Deep Learning.

Include a small status indicator such as:

AI Model Ready

Do not claim the model is actually ready unless connected to the backend. For the frontend prototype, make this a UI element that can later be connected to real backend status.

Upload Section

Create a large central upload card.

Title:

Upload Noisy Speech

Description:

Upload an audio recording containing background noise and let the AI enhance the speech.

Include a drag-and-drop style upload area.

Supported formats:

WAV

MP3

FLAC

M4A

Maximum file size should be clearly displayed as a configurable UI value rather than hard-coded into the AI logic.

After uploading:

Display file name

Display file size

Display audio player

Show remove/replace option

Enable the Enhance Speech button

Primary button:

Enhance Speech

Processing State

When the user clicks Enhance Speech, show a professional processing state.

Example UI text:

Processing Audio...

DCCRN is analyzing and enhancing the speech.

Show a spinner/progress indicator.

The UI should be designed so this state can later be controlled by the Python/FastAPI backend.

Do not simulate a fake percentage or fake processing result.

Results Section

After backend integration, the result section should contain two clearly separated cards.

Original Audio

Display:

Original file name

Audio player

Optional duration

Input status

Enhanced Speech

Display:

Enhanced audio player

Output file name

Processing status

Download button

Primary action:

Download Clean Audio

Secondary action:

Process Another Audio

Before / After Comparison

Add a clean comparison section showing:

Before Noise Reduction

and

After Noise Reduction

Each side should contain an audio player.

Do not generate fake waveform data or fake performance metrics.

Leave the structure ready for real audio waveform/analysis data later.

How It Works Section

Create a simple 4-step explanation:

1. Upload

User uploads noisy human speech.

2. Preprocessing

Audio is prepared using Python audio-processing libraries such as Librosa, NumPy and SciPy.

3. DCCRN Enhancement

The DCCRN deep-learning model analyzes the noisy speech and estimates an enhanced speech signal.

4. Clean Speech

The enhanced audio is returned to the user for playback and download.

Use simple icons and clean cards.

Technology Section

Create a section showing the technologies used:

Python

PyTorch

DCCRN

NumPy

SciPy

Librosa

FastAPI

Streamlit

The DCCRN model should be described as:

Deep Complex Convolution Recurrent Network

Do not claim any specific accuracy, SNR improvement, PESQ score, or other performance number because those values will only be added after actual model evaluation.

Architecture Section

Create a visually simple architecture explanation:

Noisy Audio
     ↓
Audio Preprocessing
     ↓
STFT
     ↓
DCCRN
     ↓
Enhanced Spectrogram
     ↓
iSTFT
     ↓
Clean Speech


Keep this section visually clean and easy to understand for judges.

About Project Section

Add a short section explaining:

Problem

Background noise makes human speech difficult to understand in real-world environments such as traffic, classrooms, public places, offices and noisy surroundings.

Solution

SIH26052 uses deep learning-based speech enhancement to suppress unwanted background noise while preserving the human speech signal.

Core Model

DCCRN — Deep Complex Convolution Recurrent Network.

Keep the explanation concise and technically accurate.

Error States

Design proper UI states for:

No file selected

Unsupported file format

File too large

Upload error

Backend unavailable

Model unavailable

Processing failure

Invalid audio

Successful processing

Use clear human-readable error messages.

Do not expose stack traces or internal technical errors to normal users.

API Integration Preparation

Structure the frontend so it can later communicate with a Python backend.

The expected future API endpoint is:

POST /enhance

The frontend should be designed around this flow:

Frontend
   ↓
POST /enhance
   ↓
Python FastAPI
   ↓
DCCRN
   ↓
Enhanced WAV
   ↓
Frontend


Do not implement a fake API.

Use a clearly separated API/service layer so the backend URL can later be changed through configuration/environment variables.

Example conceptual configuration:

BACKEND_URL

Do not hard-code production URLs.

Streamlit Compatibility

IMPORTANT:

The final application will be implemented using Streamlit + Python, not React.

Therefore:

Keep the UI structure simple enough to reproduce in Streamlit.

Avoid frontend interactions that require complicated JavaScript.

Avoid features that cannot reasonably be recreated using Streamlit components.

Prioritize upload, audio playback, buttons, loading states, result cards, status messages and download functionality.

Keep the visual hierarchy easy to reproduce using Streamlit.

Clearly organize the design into reusable sections/components.

The Lovable project is primarily being used as a UI/UX prototype and design reference. The actual final Streamlit implementation will be created separately in VS Code.

Important AI/ML Restrictions

Do NOT:

Create a fake DCCRN model.

Create fake AI results.

Generate fake accuracy values.

Generate fake noise-reduction percentages.

Pretend that audio has actually been cleaned.

Include a hard-coded fake enhanced audio file.

Add fake model performance metrics.

Claim that the backend already exists.

The actual model will later be implemented in Python/PyTorch using:

DCCRN

PyTorch

NumPy

SciPy

Librosa

Training dataset:

VoiceBank + DEMAND

Code Organization

Organize the frontend code cleanly and modularly.

Prefer a structure that makes it easy to later recreate the interface in Streamlit.

Conceptually:

frontend/
├── components/
├── assets/
├── styles/
├── services/
└── README.md


If the generated project uses React/TypeScript because that is Lovable's native environment, keep the code clean and modular. The purpose is to use this as the UI reference/design and then implement the final user interface in Streamlit/Python.

GitHub Readiness

Make the project clean and suitable for GitHub.

Include:

README

Clear project description

Setup instructions

Environment/configuration instructions

API integration explanation

No secrets

No API keys

No dataset files

No trained model weights

Do not include the VoiceBank + DEMAND dataset in the repository.

Final UI Goal

The final experience should feel like a real AI speech-enhancement product:

SIH26052
AI Speech Noise Cancellation

        Upload Noisy Speech
                ↓
          [Enhance Speech]
                ↓
          Processing...
                ↓
       ┌──────────────────┐
       │ Original Speech  │
       │ ▶ Audio Player   │
       └──────────────────┘

                ↓

       ┌──────────────────┐
       │ Enhanced Speech  │
       │ ▶ Audio Player   │
       │ Download Audio   │
       └──────────────────┘

                ↓

           How It Works
                ↓
       DCCRN Architecture
                ↓
           Technologies


Build the frontend with a polished SIH-level presentation quality while keeping the functionality realistic and ready for integration with the Python/DCCRN backend later.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cd5a1808-c59a-4062-8be0-7de6d34e766a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
