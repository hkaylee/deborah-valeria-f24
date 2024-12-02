'use client'
import { useEffect, useState } from 'react';
import { db, auth } from './fireBaseConfig';
import { collection, addDoc, getDocs } from "firebase/firestore";
import LineChartComponent from './components/LineChart';
import Script from 'next/script';
import Link from 'next/link';
import Navbar from './components/Navbar';
import { onAuthStateChanged } from "firebase/auth";

const getLocalDate = () => {
  const local = new Date();
  local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
  return local.toISOString().split("T")[0];
};



const WeightTracking = () => {
  const [petName, setPetName] = useState('');
  const [weight, setWeight] = useState('');
  const [mealDescription, setMealDescription] = useState('');
  const [status, setStatus] = useState('');
  const [weights, setWeights] = useState([]);
  const [meals, setMeals] = useState([]);
  const [breed, setBreed] = useState('');
  const [selectedPet, setSelectedPet] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('');
  const [user, setUser] = useState(null);
  const [petNames, setPetNames] = useState([]); // For dropdown
  const [isNewPet, setIsNewPet] = useState(false); // To track if "Other" is selected
  const [date, setDate] = useState(getLocalDate());


  const breeds = [
    { name: "Golden Retriever", image: '/images/golden-retriever.png'},
    { name: "French Bulldog", image: '/images/frenchie.png'},
    { name: "German Shepherd", image: '/images/german-shepherd.png'},
    { name: "Beagle", image: '/images/beagle.png'},
    { name: "Gray Tabby", image: '/images/gray-tabby.png'},
    { name: "Orange Tabby", image: '/images/orange-tabby.png'},
    { name: "Persian Cat", image: '/images/persian-cat.png'},
    { name: "Siamese Cat", image: '/images/siamese-cat.png'}
  ]


  const getBreedImage = (breedName) => {
    const breed = breeds.find(b => b.name === breedName);
    return breed ? breed.image : '';
  };

  // Fetch weights and meals from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });

    const fetchPetNames = async () => {
      if (!user) return;
  
      const petData = []; // Array to store pet objects
      const petWeightQuery = await getDocs(collection(db, "petWeights"));
      const appointmentQuery = await getDocs(collection(db, "appointmentInfo"));
  
      petWeightQuery.forEach((doc) => {
        if (doc.data().userId === user.uid) {
          petData.push({ name: doc.data().petName, breed: doc.data().breed || "" });
        }
      });
  
      appointmentQuery.forEach((doc) => {
        if (doc.data().userId === user.uid) {
          // Avoid duplicates by checking if the pet is already added
          if (!petData.some((pet) => pet.name === doc.data().petName)) {
            petData.push({ name: doc.data().petName, breed: doc.data().breed || "" });
          }
        }
      });
  
      setPetNames(petData); // Save as array of objects
    };

   const fetchWeightsAndMeals = async () => {
    if (user) { // Only fetch data if user is logged in
      const weightSnapshot = await getDocs(collection(db, "petWeights"));
      const weightData = [];
      weightSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId === user.uid) { // Filter weights for the current user
          weightData.push(data);
        }
      });
      setWeights(weightData);

      const mealSnapshot = await getDocs(collection(db, "petMeals"));
      const mealData = [];
      mealSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId === user.uid) { // Filter meals for the current user
          mealData.push(data);
        }
      });
      setMeals(mealData);
    } else {
      setWeights([]); // Reset weights if not logged in
      setMeals([]); // Reset meals if not logged in
    }
  };

    fetchWeightsAndMeals();
    fetchPetNames();
    return () => unsubscribe(); // Clean up subscription
}, [user]); // Rerun effect when user changes

// Function to add pet weight data to Firestore
async function addPetWeight(petName, breed, weight, date) {
    if(!user) return;
    try {
      const docRef = await addDoc(collection(db, "petWeights"), {
        petName: petName,
        breed: breed,
        weight: weight,
        date: new Date(date),
        userId: user.uid
      });
      console.log("Weight document written with ID: ", docRef.id);
      return true;
    } catch (error) {
      console.error("Error adding weight document: ", error);
      return false;
    }
  }

// Function to add meal data to Firestore
async function addMeal(petName, breed, mealDescription, weightDate) {
    if(!user) return;
  try {
    const docRef = await addDoc(collection(db, "petMeals"), {
      petName: petName,
      breed: breed,
      mealDescription: mealDescription,
      weightDate: weightDate, // Date of the weight entry
      date: new Date(),
      userId: user.uid
    });
    console.log("Meal document written with ID: ", docRef.id);
    return true;
  } catch (error) {
    console.error("Error adding meal document: ", error);
    return false;
  }
}

  // Handle weight form submission
  const handleWeightSubmit = async (e) => {
    e.preventDefault();
    const added = await addPetWeight(petName, breed, weight, date);
    if (added) {
      setPetName('');
      setWeight('');
      setBreed('');
      setStatus("Weight added successfully!");
      setDate(getLocalDate);
      // Re-fetch weights after adding
      const updatedWeights = await getDocs(collection(db, "petWeights"));
      const data = [];
      updatedWeights.forEach((doc) => {
        if(doc.data().userId === user.uid){
        data.push(doc.data());
        }
      });
      setWeights(data);

    } else {
      setStatus("Failed to add weight.");
    }
  };

  // Handle pet selection change
  const handlePetChange = (e) => {
    const selectedPetName = e.target.value;
    if (selectedPetName === "Other") {
      setIsNewPet(true);
      setPetName(""); // Clear input for new pet name
      setBreed("");   // Clear input for new breed
    } else {
      setIsNewPet(false);
      setPetName(selectedPetName);
  
      // Find the selected pet's breed
      const selectedPet = petNames.find((pet) => pet.name === selectedPetName);
      setBreed(selectedPet ? selectedPet.breed : ""); // Set breed or default to empty
    }
  };

  // Handle meal form submission
  const handleMealSubmit = async (e) => {
    e.preventDefault();
    const weightDate = new Date(); // Use the current date as the reference for the meal log
    const added = await addMeal(petName, breed, mealDescription, weightDate);
    if (added) {
      setMealDescription('');
      setStatus("Meal added successfully!");
      // Re-fetch meals after adding
      const updatedMeals = await getDocs(collection(db, "petMeals"));
      const data = [];
      updatedMeals.forEach((doc) => {
        data.push(doc.data());
      });
      setMeals(data);
    } else {
      setStatus("Failed to add meal.");
    }
  };

  const filteredWeights = weights.filter(weightEntry => weightEntry.petName === selectedPet); //filtered weight for chart

  return (
    <>
    <Navbar />
      <div className="pt-20">
      <Script id="chatling-config" strategy="afterInteractive">
        {`window.chtlConfig = { chatbotId: "7362981259" };`}
      </Script>
      <Script
        src="https://chatling.ai/js/embed.js"
        strategy="afterInteractive"
        data-id="7362981259"
        id="chatling-embed-script"
      />

      
      <h2 className = "mt-16">Log Pet Weight</h2>
      
      {user ? (
        <form onSubmit={handleWeightSubmit} className="mt-16">
        <label htmlFor="pet">Select a Pet:</label>
        <select
          id="pet"
          value={isNewPet ? "Other" : petName}
          onChange={handlePetChange}
          required
        >
         <option value="">-- Select a Pet --</option>
            {Array.from(new Set(petNames.map(pet => pet.name))).map((petName, index) => (
              <option key={index} value={petName}>
                {petName}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>

        {isNewPet && (
          <div>
            <input
              type="text"
              placeholder="Enter new pet name"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              required
            />
            
          </div>
        )}
          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
          <select
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            required
          >
            <option value="" disabled>Select Breed</option>
            {breeds.map((breedOption, index) => (
              <option key={index} value={breedOption.name}>
                {breedOption.name}
              </option>
            ))}
          </select>

          <input
    type="date"
    value={date}
    onChange={(e) => setDate(e.target.value)}
    required
  />
          <button type="submit">Log Weight</button>
        </form>
      ) : (
        <p>Please log in to add pet weight.</p>
      )}

      <h2>Log Pet Meal</h2>
      {user ? (
        <form onSubmit={handleMealSubmit}>
          <input
            type="text"
            placeholder="Pet Name"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Meal Description"
            value={mealDescription}
            onChange={(e) => setMealDescription(e.target.value)}
            required
          />
          <button type="submit">Log Meal</button>
        </form>
      ) : (
        <p>Please log in to add pet meals.</p>
      )}

      {status && <p>{status}</p>}
      

      <h2>Logged Weights</h2>
      {weights.length > 0 ? (
        <ul className="list-disc pl-5">
          {weights.map((weightEntry, index) => (
            <li key={index} className="mb-2">
              <img src={getBreedImage(weightEntry.breed)} alt={weightEntry.breed} className="breed-image" />
              {`Pet Name: ${weightEntry.petName}, Weight: ${weightEntry.weight} kg, Date: ${
  weightEntry.date.toDate ? weightEntry.date.toDate().toLocaleDateString() : new Date(weightEntry.date).toLocaleDateString()
}`}
              {/* Show meals for this weight entry */}
              <ul>
                {meals
                  .filter(meal => meal.petName === weightEntry.petName && meal.weightDate === weightEntry.date)
                  .map((mealEntry, mealIndex) => (
                    <li key={mealIndex}>
                      {`Meal: ${mealEntry.mealDescription}, Date: ${new Date(mealEntry.date.seconds * 1000).toLocaleDateString()}`}
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No weights logged yet.</p>
      )}

      <h2>Logged Meals</h2>
      {meals.length > 0 ? (
        <ul className="list-disc pl-5">
          {meals.map((mealEntry, index) => (
            <li key={index} className="mb-2">
              {`Pet Name: ${mealEntry.petName}, Meal: ${mealEntry.mealDescription}, Date: ${new Date(mealEntry.date.seconds * 1000).toLocaleDateString()}`}
            </li>
          ))}
        </ul>
      ) : (
        <p>No meals logged yet.</p>
      )}

  

Select a Pet    
<select
  value={selectedPet}
  onChange={(e) => {
    const petName = e.target.value;
    setSelectedPet(petName);
    
    // Find the corresponding breed
    const selectedWeightEntry = weights.find(weightEntry => weightEntry.petName === petName);
    if (selectedWeightEntry) {
      setSelectedBreed(selectedWeightEntry.breed); // Update the selected breed based on the selected pet
    } else {
      setSelectedBreed(''); // Reset if no match is found
    }
  }}
  className="border rounded p-2 mb-4"
>
<option value="">-- Select a Pet --</option>
            {Array.from(new Set(petNames.map(pet => pet.name))).map((petName, index) => (
              <option key={index} value={petName}>
                {petName}
              </option>
            ))}
          </select>


<div className="text-center"> 
  <h3> 
    {/* Display the breed image and selected pet's name */}
    {selectedPet && selectedBreed && (
      <>
        <img src={getBreedImage(selectedBreed)} alt={selectedBreed} className="inline-block w-16 h-16 mr-2" />
        {selectedPet}'s weight!
      </>
    )}
  </h3>
  <LineChartComponent weights={filteredWeights} />
</div>
    


</div>
    
    </>


   
  );
};


export default WeightTracking;