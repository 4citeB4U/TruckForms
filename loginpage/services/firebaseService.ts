
export interface MockUser {
  email: string;
  uid: string;
}

export const signInWithEmailAndPassword = async (email: string, password: string): Promise<{ user: MockUser }> => {
  console.log(`Simulating Firebase login for: ${email}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Basic validation simulation. In a real app, this would be a call to Firebase.
  if (password && password.length > 5 && email && email.includes('@')) {
    console.log("Mock Firebase sign-in successful");
    return {
      user: {
        email: email,
        uid: `mock-uid-${Date.now()}`
      }
    };
  } else {
    console.error("Mock Firebase sign-in failed: Invalid credentials");
    throw new Error('Invalid email or password. Please try again.');
  }
};
