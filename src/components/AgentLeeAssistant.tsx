import { useState } from "react";
// If you want to use Gemini for TTS/STT, you will need to integrate with Google Cloud APIs or Gemini SDKs.
// This is a basic UI. TTS/STT hooks can be added later.

const steps = [
  "Welcome to TruckForms! I'm Agent Lee, your AI guide. Let's set up your company.",
  "Step 1: Enter your company details to get started.",
  "Step 2: Invite team members by email or share the signup link.",
  "Step 3: Assign roles to your team members.",
  "Step 4: Explore your dashboard and start using forms.",
];

export function AgentLeeAssistant() {
  const [step, setStep] = useState(0);
  // Placeholder for TTS/STT integration
  // You can use Gemini or Google Cloud APIs here
  // Example: useGeminiTTS(steps[step]);

  return (
    <div className="agent-lee-assistant bg-blue-50 p-4 rounded shadow mb-4">
      <h2 className="font-bold text-lg mb-2">Agent Lee</h2>
      <p className="mb-4">{steps[step]}</p>
      {step < steps.length - 1 && (
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setStep(step + 1)}>
          Next
        </button>
      )}
      {step === steps.length - 1 && (
        <span className="text-green-700 font-semibold">You're ready to go!</span>
      )}
    </div>
  );
}
